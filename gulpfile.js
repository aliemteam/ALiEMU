/* eslint-disable no-console */
const autoprefixer = require('autoprefixer-stylus');
const del = require('del');
const exec = require('child_process').exec;
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const insert = require('gulp-insert');
const merge = require('merge-stream');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const uglify = require('gulp-uglify');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync').create();
const VERSION = require('./package.json').version;

// ==================================================
//                Configurations
// ==================================================

const stylusConfig = {
    use: [
        autoprefixer({ browsers: 'last 2 versions' }),
    ],
};

const styleHeader =
`/*
 Theme Name: ALiEMU
 Template: Divi
*/
`;

const uglifyConfig = {
    compress: {
        dead_code: true,
        unused: true,
        drop_debugger: true,
        drop_console: true,
    },
};

// ==================================================
//                 Utility Tasks
// ==================================================

// Delete all files in dist/aliemu/
gulp.task('clean', done => del(['dist/aliemu/**/*'], done));

// Take ownership of dist directory
gulp.task('chown', (done) => {
    exec('ls -ld dist/aliemu/ | awk \'{print $3}\'', (err, stdout) => {
        if (err) throw err;
        if (stdout.trim() === process.env.USER) {
            done();
            return;
        }
        exec(`sudo chown -R ${process.env.USER} dist/ wp-content/`, (e) => {
            if (e) throw e;
            done();
        });
    });
});

// Trigger a browsersync reload
gulp.task('reload', (done) => { browserSync.reload(); done(); });

gulp.task('bump', () => (
    gulp.src([
        'aliemu/functions.php',
    ], { base: './aliemu' })
    .pipe(replace(/define\('ALIEMU_VERSION', '.+?'\);/, `define('ALIEMU_VERSION', '${VERSION}');`))
    .pipe(gulp.dest('./aliemu'))
));

// ==================================================
//                    Static
// ==================================================

gulp.task('static', () => {
    const main = gulp
        .src([
            'aliemu/**/*.*',
            '!aliemu/**/templates',
            '!aliemu/**/templates/**',
            '!aliemu/**/__tests__',
            '!aliemu/**/*.{ts,tsx,json,styl,md,txt,svg,png}',
        ], { base: './aliemu' })
        .pipe(gulp.dest('dist/aliemu'));

    const pages = gulp
        .src([
            'aliemu/php/templates/pages/**/*.php',
            'aliemu/php/templates/overrides/**/*.php',
        ])
        .pipe(gulp.dest('dist/aliemu/'));

    const learndash = gulp
        .src('aliemu/php/templates/learndash/**/*.php')
        .pipe(gulp.dest('dist/aliemu/learndash/'));

    return merge(main, pages, learndash);
});

gulp.task('assets', () => (
    gulp.src('aliemu/assets/**/*.{png,jpg,jpeg,svg}', { base: './aliemu' })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/aliemu'))
));

// ==================================================
//                     Styles
// ==================================================

gulp.task('stylus:dev', cb => (
    gulp.src(['aliemu/styles/{style,editor}.styl'], { base: './aliemu/styles' })
        .pipe(sourcemaps.init())
        .pipe(stylus(stylusConfig).on('error', (e) => { console.log(e.message); cb(); }))
        .pipe(insert.prepend(styleHeader))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/aliemu'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
));

gulp.task('stylus:prod', () =>
    gulp.src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(stylus(Object.assign({}, stylusConfig, { compress: true })))
        .pipe(insert.prepend(styleHeader))
        .pipe(gulp.dest('dist/aliemu'))
);

// ==================================================
//                    Javascript
// ==================================================

gulp.task('webpack:dev', () =>
    gulp.src('aliemu/js/educator-dashboard/index.tsx')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
    );


gulp.task('webpack:prod', () =>
    gulp.src('aliemu/features/dashboards/educator-dashboard/index.tsx')
        .pipe(webpackStream(webpackConfig, webpack))
        .pipe(gulp.dest('dist/'))
);

gulp.task('js', () =>
    gulp.src('dist/**/*.js', { base: './' })
        .pipe(uglify(uglifyConfig))
        .pipe(gulp.dest('./'))
);

// ==================================================
//                 Compound Tasks
// ==================================================

gulp.task('_build', gulp.series(
    'clean',
    'bump',
    gulp.parallel(
        'static',
        'assets',
        'webpack:prod',
        'stylus:prod'
    ),
    'js'
));

gulp.task('_dev',
    gulp.series(
        'chown',
        'clean',
        gulp.parallel('static', 'assets', 'webpack:dev', 'stylus:dev'), () => {
            gulp.watch([
                'aliemu/**/*.styl',
            ], gulp.series('stylus:dev'));

            gulp.watch([
                'aliemu/**/*.{php,js}',
            ], gulp.series('static', 'reload'));

            gulp.watch([
                'aliemu/**/*.{svg,png,jpeg,jpg}',
            ], gulp.series('assets', 'reload'));

            gulp.watch([
                'aliemu/**/*.{ts,tsx}',
                '!aliemu/**/__tests__/',
                '!aliemu/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            browserSync.init({
                proxy: 'localhost:8080',
                open: false,
                notify: false,
            });
        }
    )
);
