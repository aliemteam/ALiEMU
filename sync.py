#!/usr/bin/env python3
"""
Performs non-destructive synchronization of project files.

Direction of file transfer: Production -> Local

No deletions occur at any point
"""
from argparse import ArgumentParser
from os import remove, rename

from shared import CommandRunner, Has


def parse_args():
    """Return parsed command line arguments."""
    parser = ArgumentParser()
    parser.add_argument(
        '-i',
        '--init',
        help='Syncs everything. Run this on initial setup',
        action='store_true')
    parser.add_argument(
        '-u', '--uploads', help='Sync uploads', action='store_true')
    parser.add_argument(
        '-p', '--plugins', help='Sync plugins', action='store_true')
    parser.add_argument('-t', '--theme', help='Sync theme', action='store_true')
    parser.add_argument(
        '-d', '--database', help='Sync database', action='store_true')
    return parser.parse_args()


class Sync(object):
    """Perform all sync actions."""

    def __init__(self):
        self.cmd = CommandRunner()
        self.meta = {
            **self.cmd.meta,
            'root': self.cmd.dirs.root,
        }
        self.calls = 0
        self.cmd.run(('mkdir -p '
                      '{root}/data '
                      '{root}/wp-content/themes '
                      '{root}/wp-content/plugins '
                      '{root}/wp-content/uploads').format(**self.meta))

    def uploads(self) -> 'Sync':
        """Pull all uploads."""
        print('Downloading uploads from server...')
        self.cmd.rsync(
            '{name}:/home/{name}/app/wp-content/uploads/'.format(**self.meta),
            '{root}/wp-content/uploads'.format(**self.meta))
        self.calls += 1
        return self

    def plugins(self) -> 'Sync':
        """Pull plugins."""
        print('Downloading plugins from server...')
        for plugin in self.meta['plugins']:
            print('--> Downloading plugin {}'.format(plugin))
            self.cmd.rsync(
                '{name}:/home/{name}/app/wp-content/plugins/{plugin}'.format(
                    plugin=plugin, **self.meta),
                '{root}/wp-content/plugins'.format(**self.meta))
        self.calls += 1
        return self

    def theme(self) -> 'Sync':
        """Pull base theme."""
        if 'base_theme' not in self.meta:
            print('No base theme defined. Skipping...')
            return self

        print('Downloading theme from server...')
        self.cmd.rsync('{name}:/home/{name}/app/wp-content/themes/{base_theme}'
                       .format(**self.meta),
                       '{root}/wp-content/themes'.format(**self.meta))
        self.calls += 1
        return self

    def database(self) -> 'Sync':
        """Rotate backup database and pull database."""
        try:
            remove('{root}/data/database.sql.bak'.format(**self.meta))
        except FileNotFoundError:
            pass
        try:
            rename('{root}/data/database.sql'.format(**self.meta),
                   '{root}/data/database.sql.bak'.format(**self.meta))
        except FileNotFoundError:
            pass

        print('Exporting database...')
        self.cmd.ssh((
            'cd /home/{name}/app && sudo -u {name} '
            'docker-compose exec -T wordpress /bin/bash -c '
            "'wp db export /data/database.sql --allow-root'"
        ).format(**self.meta))

        print('Exporting database to local machine...')
        self.cmd.rsync(
            '{name}:/home/{name}/app/data/database.sql'.format(**self.meta),
            '{root}/data/database.sql'.format(**self.meta))

        self.calls += 1
        return self


def main():
    """Main entrypoint."""
    args = parse_args()
    Has.executable('docker-machine', 'rsync')
    sync = Sync()
    if args.init:
        sync.database().plugins().theme().uploads()
        return
    if args.uploads:
        sync.uploads()
    if args.plugins:
        sync.plugins()
    if args.theme:
        sync.theme()
    if args.database:
        sync.database()
    if sync.calls == 0:
        sync.database().uploads()


if __name__ == '__main__':
    main()
