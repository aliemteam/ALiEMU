/* eslint-env es6 */

// General
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const exec = require('child_process').exec;
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const insert = require('gulp-insert');
// Assets
const svgmin = require('gulp-svgmin');
const imagemin = require('gulp-imagemin');
// PHP
const jade = require('gulp-jade2php');
// CSS
const stylus = require('gulp-stylus');
const poststylus = require('poststylus');
const autoprefixer = require('autoprefixer')({ browsers: ['last 2 versions'] });
const rucksack = require('rucksack-css');
const sourcemaps = require('gulp-sourcemaps');
const csso = require('gulp-csso'); // used for Divi and Learndash minification
// JS
const uglify = require('gulp-uglify');
// TypeScript
const webpack = require('webpack-stream');


// ==================================================
//                Configurations
// ==================================================

const webpackConfig = require('./webpack.config.js');

const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'eval-source-map',
    cache: true,
});

const jadeConfig = {
    omitPhpRuntime: true,
    omitPhpExtractor: true,
    arraysOnly: false,
    noArraysOnly: true,
};

const stylusConfig = {
    use: [
        poststylus([
            rucksack,
            autoprefixer,
        ]),
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
gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});


// ==================================================
//                    Static
// ==================================================

gulp.task('static', () => {
    const svg = gulp
        .src('aliemu/assets/**/*.svg', { base: './aliemu' })
        .pipe(svgmin())
        .pipe(gulp.dest('dist/aliemu'));

    const images = gulp
        .src('aliemu/assets/**/*.png', { base: './aliemu' })
        .pipe(imagemin())
        .pipe(gulp.dest('dist/aliemu'));

    const main = gulp
        .src([
            'aliemu/**/*.*',
            '!aliemu/templates/**/*.*',
            '!aliemu/templates',
            '!aliemu/**/__tests__',
            '!aliemu/**/*.{ts,tsx,json,styl,md,txt,svg,png}',
        ], { base: './aliemu' })
        .pipe(gulp.dest('dist/aliemu'));

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

    return merge(svg, images, main, templatePages, templateOverrides, templateLearndash);
});

// ==================================================
//                     Styles
// ==================================================

gulp.task('stylus:dev', () =>
    gulp
        .src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(sourcemaps.init())
        .pipe(stylus(stylusConfig))
        .pipe(sourcemaps.write('.'))
        .pipe(insert.prepend(styleHeader))
        .pipe(gulp.dest('dist/aliemu'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('stylus:prod', () =>
    gulp
        .src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(stylus(Object.assign({}, stylusConfig, { compress: true })))
        .pipe(insert.prepend(styleHeader))
        .pipe(gulp.dest('dist/aliemu'))
);

// ==================================================
//                    Javascript
// ==================================================

gulp.task('webpack:dev', () =>
    gulp.src('aliemu/features/dashboards/educator-dashboard/EducatorDashboard.tsx')
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest('dist/'))
);


gulp.task('webpack:prod', () =>
    gulp.src('aliemu/features/dashboards/educator-dashboard/EducatorDashboard.tsx')
    .pipe(webpack(webpackConfig))
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

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('static', 'webpack:prod', 'stylus:prod'),
    'js'
));

gulp.task('default',
    gulp.series(
        'chown',
        'clean',
        gulp.parallel('static', 'webpack:dev', 'stylus:dev'), () => {
            browserSync.init({
                proxy: 'localhost:8080',
            });

            gulp.watch([
                'aliemu/**/*.styl',
            ], gulp.series('stylus:dev'));

            gulp.watch([
                'aliemu/**/*.{ts,tsx}',
                '!aliemu/**/__tests__/',
                '!aliemu/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            gulp.watch([
                'aliemu/**/*',
                '!aliemu/**/*.{ts,tsx,styl}',
                '!aliemu/**/__tests__/',
                '!aliemu/**/__tests__/*',
            ], gulp.series('static', 'reload'));
        }
    )
);

// ==================================================
//               Plugin/Theme Fixes
// ==================================================

gulp.task('fix-divi', () => {
    const slackEmailHook = `
    do_action('slack_email_hook', [
        'name' => $contact_name,
        'email' => $contact_email,
        'message' => stripslashes(wp_strip_all_tags($message_pattern)),
    ]);
    `;

    const slack = gulp
        .src('wp-content/themes/Divi/includes/builder/main-modules.php', { base: './' })
        .pipe(replace(/wp_mail(.|\n)+?;/, slackEmailHook))
        .pipe(gulp.dest('./'));

    const js = gulp
        .src('wp-content/themes/Divi/**/*.js', { base: './' })
        .pipe(uglify(uglifyConfig))
        .pipe(gulp.dest('./'));

    const css = gulp
        .src('wp-content/themes/Divi/**/*.css', { base: './' })
        .pipe(csso())
        .pipe(gulp.dest('./'));

    return merge(slack, js, css);
});

gulp.task('fix-learndash', () =>
    gulp
        .src('wp-content/plugins/sfwd-lms/**/*.{php,po,pot}', { base: './' })
        .pipe(replace(/PRINT YOUR CERTIFICATE!?/, 'Print Certificate'))
        .pipe(gulp.dest('./'))
);


gulp.task('fix-files', gulp.parallel('fix-divi', 'fix-learndash'));
