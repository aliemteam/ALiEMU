"""This module holds code that is shared across 2 or more scripts."""
from os import path, getenv
from functools import lru_cache as memoize
import json
from shlex import split
from subprocess import PIPE, Popen, getoutput, getstatusoutput
from sys import exit as sys_exit
from textwrap import dedent
from urllib.request import Request, urlopen
from urllib.error import HTTPError

from typing import List, Mapping, Optional, TypeVar

T = TypeVar('T', str, List[str])


class Has(object):  # pylint: disable=too-few-public-methods
    """Helper for making assertions about the running user's machine."""

    @classmethod
    def env(cls, *varnames) -> 'Has':
        """Assert an environment variable {name} is set."""
        for name in varnames:
            assert getenv(name), (
                'Missing required environment variable {v}'.format(v=name))
        return cls

    @classmethod
    def executable(cls, *exes) -> 'Has':
        """Assert that an executable binary {name} is in PATH."""
        for name in exes:
            assert getstatusoutput(
                'command -v {cmd}'.format(cmd=name))[0] == 0, (
                    '"{cmd}" must be installed to run this script'.format(
                        cmd=name))
        return cls


class Project(object):  # pylint: disable=too-few-public-methods
    """Contains project-related metadata."""

    def __init__(self):
        self.dirs = self.Dirs()

    class Dirs(object):
        """Contains directory metadata"""

        @property
        def script(self) -> str:
            """Return directory of currently executing script"""
            return path.dirname(path.realpath(__file__))

        @property  # type: ignore
        @memoize(maxsize=1)
        def root(self) -> str:
            """Return root directory of current project."""
            current_path = self.script
            root = ''
            while not root:
                if path.isfile('{path}/package.json'.format(path=current_path)):
                    root = current_path
                if current_path == '/':
                    raise FileNotFoundError
                current_path = path.dirname(
                    path.realpath('{path}../'.format(path=current_path)))
            return root

    @property
    def meta(self) -> Optional[Mapping[str, T]]:
        """Return a mapping of the "server" properties defined in the project's package.json."""
        with open('{path}/package.json'.format(path=self.dirs.root)) as pkg:
            file = json.load(pkg)
            server_meta = file['server']
        return server_meta


class CommandRunner(object):
    """Abstraction for running commands on server.

    This abstraction is necessary because the connection to the server is could
    either be via docker-machine or via regular ssh. Instances of this class
    sort out which connection type to use and then run commands on both types
    using the same interface.
    """
    dirs = Project().dirs

    def __init__(self):
        self.meta = Project().meta
        has_docker_machine = getoutput(
            "docker-machine ls -q --filter 'name=^{name}$' | wc -l"
            .format(**self.meta)).strip() == '1'
        has_ssh = getoutput('grep -c "Host {name}" ~/.ssh/config'
                            .format(**self.meta)) == '1'
        if has_docker_machine:
            self.cmd = ('docker-machine', 'scp -r -d')
        elif has_ssh:
            self.cmd = ('rsync', '-avz')
        else:
            print(
                dedent("""
            ERROR: Could not locate a docker-machine or ssh identity for {name}

            To enable SSH connections, add the following to your ~/.ssh/config file:

            Host {name}
                HostName <ip-address-of-server>
                Port 22
                User {name}
                IdentityFile ~/.ssh/<name-of-your-private-key-file>

            """.format(**self.meta)))
            sys_exit(1)

    def ssh(self, command: str) -> None:
        """Run arbitrary command via SSH on server"""
        cmd = 'docker-machine ssh' if self.cmd[0] == 'docker-machine' else 'ssh'
        self.run('{exe} {name} "{command}"'.format(
            exe=cmd, command=command, **self.meta))

    def rsync(self, src: str, dest: str) -> None:
        """Transfer files between server and local machine using rsync"""
        self.run('{command} {options} "{src}" "{dest}"'.format(
            command=self.cmd[0], options=self.cmd[1], src=src, dest=dest))

    @staticmethod
    def run(command: str) -> None:
        """Run arbitrary command on local system."""
        proc = Popen(split(command), stdout=PIPE)
        while True:
            stdout = proc.stdout.readline()
            if proc.poll() is not None:
                break
            if stdout:
                print(stdout.strip().decode())


class Provider(object):  # pylint: disable=too-few-public-methods
    """Interface with the connected cloud provider.

    In this case, it's DigitalOcean, but this will hopefully allow us to be agile
    and move to anther cloud provider if we choose in the future without a great
    deal of effort.
    """

    def __init__(self, token=None):
        assert token, 'API token required'
        self.__baseurl = 'https://api.digitalocean.com/v2'
        self.__headers = {
            'Authorization': 'Bearer {token}'.format(token=token),
            'Content-Type': 'application/json',
        }

    def add_dns_records(self, name: str):
        """Create or transfer DNS records to new droplet."""
        # Get all droplets
        res, err = self.__get('/droplets')
        assert err is None, \
            'An error occurred while attempting to retrieve droplet list'

        # Filter droplet whose name matches {name}
        droplet = next(
            (dplt for dplt in res['droplets'] if dplt['name'] == name), None)
        assert droplet, \
            'Droplet for "{name}" could not be located'.format(name=name)

        ipv4 = droplet['networks']['v4'][0]['ip_address']
        records = [{
            'type': 'A',
            'name': '@',
            'data': ipv4,
        }, {
            'type': 'A',
            'name': 'www',
            'data': ipv4,
        }]
        domain_name = input(
            '--> Enter domain name [{name}.com]: '
            .format(name=name)) or '{name}.com'.format(name=name)

        # Check to see if domain name already exists (err == does not exist)
        res, err = self.__get('/domains/{domain}'.format(domain=domain_name))
        if err is None:
            # Fetch existing records
            res, err = self.__get('/domains/{domain}/records'
                                  .format(domain=domain_name))
            assert err is None, (
                'An error occured while attempting to fetch DNS records for "{domain}"'
                .format(domain=domain_name))

            # Weed out A records and also remove the id property from each
            old_records = [{k: x[k]
                            for k in x
                            if k != 'id'}
                           for x in res['domain_records']
                           if x['type'] != 'A']
            # Merge old records and new records
            records = [*old_records, *records]

            # Delete existing domain (and records)
            res, err = self.__delete('/domains/{domain}'
                                     .format(domain=domain_name))
            assert err is None, \
                'An error occurred while attempting to delete old domain entry'

        # Add new domain
        res, err = self.__post('/domains', {
            'name': domain_name,
            'ip_address': ipv4,
        })
        assert err is None, (
            'An error occurred while attempting to create domain "{domain}"'
            .format(domain=domain_name))

        # Add new records to domain
        for record in records:
            res, err = self.__post(
                '/domains/{domain}/records'.format(domain=domain_name), record)
            if err:
                print(('[{code}] An error occurred while attempting '
                       'to create the following record: {data}').format(
                           code=err.code, data=json.dumps(record, indent=4)))

    def __get(self, endpoint: str) -> (Optional[object], Optional[HTTPError]):
        """Generic HTTP GET method"""
        req = Request(
            '{base}{endpoint}'.format(base=self.__baseurl, endpoint=endpoint),
            headers=self.__headers,
            method='GET')
        try:
            with urlopen(req) as res:
                return (json.loads(res.read().decode()), None)
        except HTTPError as err:
            return (None, err)

    def __post(self, endpoint: str,
               data) -> (Optional[object], Optional[HTTPError]):
        """Generic HTTP POST method"""
        req = Request(
            '{base}{endpoint}'.format(base=self.__baseurl, endpoint=endpoint),
            data=json.dumps(data).encode(),
            headers=self.__headers,
            method='POST')
        try:
            with urlopen(req) as res:
                return (json.loads(res.read().decode()), None)
        except HTTPError as err:
            return (None, err)

    def __delete(self, endpoint: str) -> (Optional[int], Optional[HTTPError]):
        """Generic HTTP DELETE method"""
        req = Request(
            '{base}{endpoint}'.format(base=self.__baseurl, endpoint=endpoint),
            headers=self.__headers,
            method='DELETE')
        try:
            with urlopen(req) as res:
                return (res.status, None)
        except HTTPError as err:
            return (None, err)
