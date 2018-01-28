// tslint:disable:no-console
import { exec as cp_exec, spawn } from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as composer from 'gulp-uglify/composer';
import * as uglifyEs from 'uglify-es';
import { promisify } from 'util';

const browserSync = require('browser-sync').create();
const uglify = composer(uglifyEs, console);
const exec = promisify(cp_exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const VERSION = require('./package.json').version;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

process.env.FORCE_COLOR = '1';

const reload = (cb: () => void): void =>
    [browserSync.reload, cb].forEach(f => f());
const clean = async (): Promise<any> => exec(`rm -rf ${__dirname}/dist/*`);
export { clean, reload };

export const bump = async (): Promise<any> =>
    readFile(`${__dirname}/src/functions.php`, 'utf-8')
        .then(file =>
            file.replace(
                /(define\('ALIEMU_VERSION', ')(.+?)('\);)/,
                `$1${VERSION}$3`
            )
        )
        .then(async (file) => writeFile(`${__dirname}/src/functions.php`, file))
        .catch(e => {
            console.log(e);
            throw e;
        });

export function bundle(cb: () => void): void {
    const child = spawn(`${__dirname}/node_modules/.bin/webpack`, undefined, {
        env: process.env,
    });
    child.on('error', err => {
        console.error(err);
        process.exit(1);
    });
    child.on('exit', (code, signal) => {
        if (code !== 0) {
            console.error(
                `Exited with non-zero exit code (${code}): ${signal}`
            );
            process.exit(1);
        }
        cb();
    });
    child.on('disconnect', () => child.kill());
    child.stdout.on('data', data => {
        const msg = data.toString();
        console.log(msg.trim());
        if (msg.indexOf('[at-loader] Ok') > -1) {
            browserSync.reload();
        }
    });
    child.stderr.on('data', data => {
        const msg = data.toString();
        console.error(msg.trim());
    });
    if (!IS_PRODUCTION) {
        return cb();
    }
}

export function js(): NodeJS.ReadWriteStream {
    let stream = gulp.src(['src/**/*.js']);
    if (IS_PRODUCTION) {
        stream = stream.pipe(uglify());
    }
    stream = stream.pipe(gulp.dest('dist'));
    return stream;
}

const main = gulp.series(
    clean,
    gulp.parallel(bundle, js),
    cb => {
        if (IS_PRODUCTION) {
            return cb();
        }

        browserSync.init({
            proxy: 'localhost:8080',
            open: false,
            reloadDebounce: 2000,
            notify: false,
        });
    }
);
export default main;
