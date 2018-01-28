import * as fs from 'fs';
import * as path from 'path';

const FILE_PATH = path.resolve(__dirname, '../../', 'src', 'css', 'style.scss');

const content = fs.readFileSync(FILE_PATH, { encoding: 'utf-8' });

const newContent = content.replace(
    /(^Version:).+/m,
    `$1 ${process.env.npm_package_version}`,
);

fs.writeFileSync(FILE_PATH, newContent);
