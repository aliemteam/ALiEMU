"""This module holds code that is shared across 2 or more scripts."""
from os import path, getenv
from functools import lru_cache as memoize
from json import load
from shlex import split
from subprocess import PIPE, Popen, getoutput, getstatusoutput
from sys import exit as sys_exit
from textwrap import dedent
from typing import List, Mapping, Optional, TypeVar

T = TypeVar('T', str, List[str])


def prechecks(include_env=None) -> None:
    """Check to see if the system has all external dependencies available"""
    executables = ['docker-machine', 'rsync']
    env = ['DIGITALOCEAN_ACCESS_TOKEN']
    for ex in executables:
        if getstatusoutput('command -v {}'.format(ex))[0] != 0:
            print('{} must be installed to run this script'.format(ex))
            sys_exit(1)
    if include_env:
        for var in env:
            if not getenv(var, False):
                print('Cannot locate environment variable {}'.format(var))
                sys_exit(1)


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
                if path.isfile('{}/package.json'.format(current_path)):
                    root = current_path
                if current_path == '/':
                    raise FileNotFoundError
                current_path = path.dirname(
                    path.realpath('{}../'.format(current_path)))
            return root

    @property
    def meta(self) -> Optional[Mapping[str, T]]:
        """Return a mapping of the "server" properties defined in the project's package.json."""
        with open('{}/package.json'.format(self.dirs.root)) as pkg:
            file = load(pkg)
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
                IdentityFile ~/.ssh/<name-of-our-private-key-file>

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
                print(stdout.strip().decode('utf-8'))
