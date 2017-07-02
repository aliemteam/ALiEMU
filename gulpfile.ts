// tslint:disable:no-console
import * as autoprefixer from 'autoprefixer-stylus';
import * as cp from 'child_process';
import * as fs from 'fs';
import * as gulp from 'gulp';
import * as imagemin from 'gulp-imagemin';
import * as sourcemaps from 'gulp-sourcemaps';
import * as stylus from 'gulp-stylus';
import * as uglify from 'gulp-uglify';
import * as merge from 'merge-stream';
import { promisify } from 'util';
import * as webpack from 'webpack';
import * as webpackStream from 'webpack-stream';
import webpackConfig from './webpack.config';

const browserSync = require('browser-sync').create();
const VERSION = require('./package.json').version;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const exec = promisify(cp.exec);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// prettier-ignore
const reload = cb => { browserSync.reload(); cb(); };
const clean = () => exec(`rm -rf ${__dirname}/dist/aliemu/*`);
export { clean, reload };

export function bump() {
    return readFile(`${__dirname}/aliemu/functions.php`, 'utf-8')
        .then(file =>
            file.replace(
                /(define\('ALIEMU_VERSION', ')(.+?)('\);)/,
                `$1${VERSION}$3`
            )
        )
        .then(file => writeFile(`${__dirname}/aliemu/functions.php`, file))
        .catch(e => {
            console.log(e);
            throw e;
        });
}

export function staticFiles() {
    const main = gulp
        .src(
            [
                'aliemu/**/*.{php,css}',
                '!aliemu/templates/{pages,overrides,learndash}',
                '!aliemu/templates/{pages,overrides,learndash}/*',
            ],
        )
        .pipe(gulp.dest('dist/aliemu'));

    const pages = gulp
        .src([
            'aliemu/templates/pages/**/*.php',
            'aliemu/templates/overrides/**/*.php',
        ])
        .pipe(gulp.dest('dist/aliemu'));

    const learndash = gulp
        .src('aliemu/templates/learndash/**/*.php')
        .pipe(gulp.dest('dist/aliemu/learndash'));

    return merge(main, pages, learndash);
}

export function assets() {
    return gulp
        .src('aliemu/assets/**/*.{png,jpg,jpeg,svg}')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/aliemu/assets'));
}

export function styles(cb) {
    const stylusConfig = {
        use: [autoprefixer({ browsers: 'last 2 versions' })],
        compress: IS_PRODUCTION,
    };

    let stream = gulp.src(['aliemu/styles/{style,editor}.styl']);

    if (!IS_PRODUCTION) stream = stream.pipe(sourcemaps.init());

    stream = stream.pipe(
        stylus(stylusConfig).on('error', e => {
            console.log(e.message);
            if (process.env.NODE_ENV === 'production') {
                throw e;
            }
            cb();
        })
    );

    if (!IS_PRODUCTION) stream = stream.pipe(sourcemaps.write('.'));

    stream = stream.pipe(gulp.dest('dist/aliemu'));

    if (!IS_PRODUCTION) stream = stream.pipe(browserSync.stream());

    return stream;
}

export function bundler() {
    let bundle = gulp
        .src('aliemu/js/educator-dashboard/index.tsx')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('dist/aliemu/js'));
    if (process.env.NODE_ENV !== 'production') {
        bundle = bundle.pipe(browserSync.stream());
    }
    return bundle;
}

export function js() {
    let stream = gulp.src(['aliemu/**/*.js']);
    if (IS_PRODUCTION) stream = stream.pipe(uglify());
    stream = stream.pipe(gulp.dest('./dist/aliemu'));
    return stream;
}

const main = gulp.series(
    clean,
    gulp.parallel(staticFiles, assets, bundler, styles, js),
    cb => {
        if (IS_PRODUCTION) return cb();

        gulp.watch(['aliemu/**/*.styl'], gulp.series(styles));

        gulp.watch(['aliemu/**/*.php'], gulp.series(staticFiles, reload));
        gulp.watch(['aliemu/**/*.js'], gulp.series(js, reload));

        gulp.watch(
            ['aliemu/**/*.{svg,png,jpeg,jpg}'],
            gulp.series(assets, reload)
        );

        gulp.watch(
            [
                'aliemu/**/*.{ts,tsx}',
                '!aliemu/**/__tests__/',
                '!aliemu/**/__tests__/*',
            ],
            gulp.series(bundler, reload)
        );

        browserSync.init({
            proxy: 'localhost:8080',
            open: false,
            notify: false,
        });
    }
);
export default main;
