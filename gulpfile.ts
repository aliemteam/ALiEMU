// tslint:disable:no-console
import { exec as cp_exec, spawn } from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as autoprefixer from 'gulp-autoprefixer';
import * as imagemin from 'gulp-imagemin';
import * as sass from 'gulp-sass';
import * as sourcemaps from 'gulp-sourcemaps';
import * as composer from 'gulp-uglify/composer';
import * as merge from 'merge-stream';
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

const reload = (cb: () => void) => [browserSync.reload, cb].forEach(f => f());
const clean = () => exec(`rm -rf ${__dirname}/dist/*`);
export { clean, reload };

export const bump = () =>
    readFile(`${__dirname}/src/functions.php`, 'utf-8')
        .then(file =>
            file.replace(
                /(define\('ALIEMU_VERSION', ')(.+?)('\);)/,
                `$1${VERSION}$3`
            )
        )
        .then(file => writeFile(`${__dirname}/src/functions.php`, file))
        .catch(e => {
            console.log(e);
            throw e;
        });

export function staticFiles() {
    const misc = gulp
        .src([
            'src/**/*.{php,css}',
            '!src/lib/templates/{pages,learndash}',
            '!src/lib/templates/{pages,learndash}/*',
        ])
        .pipe(gulp.dest('dist'));

    const pages = gulp
        .src(['src/lib/templates/pages/**/*.php'])
        .pipe(gulp.dest('dist'));

    const learndash = gulp
        .src('src/lib/templates/learndash/**/*.php')
        .pipe(gulp.dest('dist/learndash'));

    return merge(misc, pages, learndash);
}

export function assets() {
    return gulp
        .src('src/assets/**/*.{png,jpg,jpeg,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/assets'));
}

export function styles() {
    let stream = gulp.src('src/**/*.scss', { base: 'src' });

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.init());
    }

    stream = stream
        .pipe(
            sass({
                outputStyle: IS_PRODUCTION ? 'compressed' : 'nested',
            }).on('error', sass.logError)
        )
        .pipe(autoprefixer({ browsers: ['last 2 versions'] }));

    if (!IS_PRODUCTION) {
        stream = stream.pipe(sourcemaps.write('.', undefined));
    }

    stream = stream.pipe(gulp.dest('dist'));

    if (!IS_PRODUCTION) {
        stream = stream.pipe(browserSync.stream({ match: '**/*.css' }));
    }

    return stream;
}

export function bundle(cb: () => void) {
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
    if (!IS_PRODUCTION) return cb();
}

export function js() {
    let stream = gulp.src(['src/**/*.js']);
    if (IS_PRODUCTION) stream = stream.pipe(uglify());
    stream = stream.pipe(gulp.dest('dist'));
    return stream;
}

const main = gulp.series(
    clean,
    gulp.parallel(staticFiles, assets, bundle, styles, js),
    cb => {
        if (IS_PRODUCTION) return cb();

        gulp.watch(['src/**/*.scss'], gulp.series(styles));
        gulp.watch(['src/**/*.php'], gulp.series(staticFiles, reload));
        gulp.watch(['src/**/*.js'], gulp.series(js, reload));
        gulp.watch(
            ['src/**/*.{svg,png,jpeg,jpg}'],
            gulp.series(assets, reload)
        );

        browserSync.init({
            proxy: 'localhost:8080',
            open: false,
            reloadDebounce: 2000,
            notify: false,
        });
    }
);
export default main;
