const autoprefixer = require('autoprefixer-stylus');
const csso = require('gulp-csso');
const del = require('del');
const exec = require('child_process').exec;
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const insert = require('gulp-insert');
const jade = require('gulp-jade2php');
const merge = require('merge-stream');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
// const sourcemaps = require('gulp-sourcemaps');
const stylus = require('gulp-stylus');
const uglify = require('gulp-uglify');
const webpackStream = require('webpack-stream');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const browserSync = require('browser-sync').create();

// ==================================================
//                Configurations
// ==================================================

const jadeConfig = {
    omitPhpRuntime: true,
    omitPhpExtractor: true,
    arraysOnly: false,
    noArraysOnly: true,
};

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


// ==================================================
//                    Static
// ==================================================

gulp.task('jade', () => {
    const templatePages = gulp
        .src('aliemu/templates/pages/*.jade', { base: './aliemu/templates/pages' })
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php', prefix: 'page-' }))
        .pipe(gulp.dest('dist/aliemu/'));

    const templateOverrides = gulp
        .src('aliemu/templates/overrides/*.jade', { base: './aliemu/templates/overrides' })
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest('dist/aliemu/'));

    const templateLearndash = gulp
        .src('aliemu/templates/learndash/*.jade', { base: './aliemu/templates' })
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest('dist/aliemu/'));

    return merge(templatePages, templateOverrides, templateLearndash);
});

gulp.task('php', () => {
    const main = gulp
        .src([
            'aliemu/**/*.*',
            '!aliemu/templates/**/*.*',
            '!aliemu/templates',
            '!aliemu/**/__tests__',
            '!aliemu/**/*.{ts,tsx,json,styl,md,txt,svg,png}',
        ], { base: './aliemu' })
        .pipe(gulp.dest('dist/aliemu'));

    const templates = gulp
        .src('aliemu/templates/pages/**/*.php')
        .pipe(rename({ prefix: 'page-' }))
        .pipe(gulp.dest('dist/aliemu/'));

    return merge(main, templates);
});

gulp.task('assets', () => (
    gulp.src('aliemu/assets/**/*.{png,jpg,jpeg,svg}', { base: './aliemu' })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/aliemu'))
));

// ==================================================
//                     Styles
// ==================================================

gulp.task('stylus:dev', () =>
    gulp.src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(stylus(stylusConfig))
        .pipe(insert.prepend(styleHeader))
        .pipe(gulp.dest('dist/aliemu'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);

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
    gulp.src('aliemu/features/dashboards/educator-dashboard/index.tsx')
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
    gulp.parallel(
        'php',
        'assets',
        'jade',
        'webpack:prod',
        'stylus:prod'
    ),
    'js'
));

gulp.task('_dev',
    gulp.series(
        'chown',
        'clean',
        gulp.parallel('php', 'assets', 'jade', 'webpack:dev', 'stylus:dev'), () => {
            gulp.watch([
                'aliemu/**/*.styl',
            ], gulp.series('stylus:dev'));

            gulp.watch([
                'aliemu/**/*.php',
            ], gulp.series('php', 'reload'));

            gulp.watch([
                'aliemu/**/*.{svg,png,jpeg,jpg}',
            ], gulp.series('assets', 'reload'));

            gulp.watch([
                'aliemu/**/*.jade',
            ], gulp.series('jade', 'reload'));

            gulp.watch([
                'aliemu/**/*.{ts,tsx}',
                '!aliemu/**/__tests__/',
                '!aliemu/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            browserSync.init({
                proxy: 'localhost:8080',
                open: false,
            });
        }
    )
);

// ==================================================
//               Plugin/Theme Fixes
// ==================================================

gulp.task('fix-divi', () => {
    const js = gulp
        .src('wp-content/themes/Divi/**/*.js', { base: './' })
        .pipe(uglify(uglifyConfig))
        .pipe(gulp.dest('./'));

    const css = gulp
        .src('wp-content/themes/Divi/**/*.css', { base: './' })
        .pipe(csso())
        .pipe(gulp.dest('./'));

    return merge(js, css);
});

gulp.task('fix-learndash', () =>
    gulp
        .src('wp-content/plugins/sfwd-lms/**/*.{php,po,pot}', { base: './' })
        .pipe(replace(/PRINT YOUR CERTIFICATE!?/, 'Print Certificate'))
        .pipe(gulp.dest('./'))
);


gulp.task('fix-files', gulp.parallel('fix-divi', 'fix-learndash'));
