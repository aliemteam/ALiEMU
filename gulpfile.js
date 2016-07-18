/*eslint-env es6*/
'use strict';

// General
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const del = require('del');
const exec = require('child_process').exec;
const replace = require('gulp-replace');
const rename = require('gulp-rename');
const merge = require('merge-stream');
// Assets
const svgmin = require('gulp-svgmin');
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

const uglifyConfig  = {
    compress: {
        'dead_code': true,
        'unused': true,
        'drop_debugger': true,
        'drop_console': true,
    },
};

// ==================================================
//                 Utility Tasks
// ==================================================

// Delete all files in dist/Divi-child/
gulp.task('clean', (done) => del(['dist/Divi-child/**/*'], done));

// Take ownership of dist directory
gulp.task('chown', (done) => {
    exec('ls -ld dist/Divi-child/ | awk \'{print $3}\'', (err, stdout, stderr) => {
        if (err) throw err;
        if (stdout.trim() === process.env.USER) return done();
        exec(`sudo chown -R ${process.env.USER} dist/ wp-content/`, (err) => {
            if (err) throw err;
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

    const assets = gukp
        .src('aliemu/assets/**.*', { base: './aliemu' })
        .pipe(svgmin())
        .pipe(gulp.dest('dist/Divi-child'));

    const main = gulp
        .src([
            'aliemu/**/*.*',
            '!aliemu/templates/**/*.*',
            '!aliemu/templates',
            '!aliemu/**/__tests__',
            '!aliemu/**/*.{ts,tsx,json,styl,md,txt}',
        ], { base: './aliemu' })
        .pipe(gulp.dest('dist/Divi-child'));

    const templatePages = gulp
        .src('aliemu/templates/pages/*.jade', { base: './aliemu/templates/pages' })
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php', prefix: 'page-'}))
        .pipe(gulp.dest('dist/Divi-child/'));

    const templateOverrides = gulp
        .src('aliemu/templates/overrides/*.jade', { base: './aliemu/templates/overrides'})
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest('dist/Divi-child/'));

    const templateLearndash = gulp
        .src('aliemu/templates/learndash/*.jade', { base: './aliemu/templates' })
        .pipe(jade(jadeConfig))
        .pipe(rename({ extname: '.php' }))
        .pipe(gulp.dest('dist/Divi-child/'));

    return merge(assets, main, templatePages, templateOverrides, templateLearndash);
});

// ==================================================
//                     Styles
// ==================================================

gulp.task('stylus:dev:step1', () =>
    gulp
        .src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(sourcemaps.init())
        .pipe(stylus(stylusConfig))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist/Divi-child'))
        .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('stylus:prod:step1', () =>
    gulp
        .src('aliemu/styles/style.styl', { base: './aliemu/styles' })
        .pipe(stylus(Object.assign({}, stylusConfig, { compress: true })))
        .pipe(gulp.dest('dist/Divi-child'))
);

// FIXME: We can probably pitch this
gulp.task('stylus:step2', (done) => {
    const header =
    '/*\n' +
    ' Theme Name: Divi Child\n' +
    ' Theme URI: http://www.elegantthemes.com/gallery/divi/\n' +
    ' Description: Divi Child Theme\n' +
    ' Author: Elegant Themes\n' +
    ' Author URI: http://www.elegantthemes.com\n' +
    ' Template: Divi\n' +
    ' Version: 1.0.0\n' +
    ' License: GNU General Public License v2\n' +
    ' License URI: http://www.gnu.org/licenses/gpl-2.0.html\n' +
    '*/\n';
    exec(`echo -en "${header}$(<dist/Divi-child/style.css)" > dist/Divi-child/style.css`, (err) => {
        if (err) throw err;
        done();
    });
});

gulp.task('stylus:dev', gulp.series('stylus:dev:step1', 'stylus:step2'));
gulp.task('stylus:prod', gulp.series('stylus:prod:step1', 'stylus:step2'))

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
                proxy: 'localhost:8080'
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

            gulp.watch([
                'aliemu/assets/**/*'
            ], gulp.series('assets', 'reload'));

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
        .pipe(gulp.dest('./'))

    const css = gulp
        .src('wp-content/themes/Divi/**/*.css', { base: './' })
        .pipe(csso())
        .pipe(gulp.dest('./'))

    return merge(slack, js, css);

});

gulp.task('fix-learndash', () =>
    gulp
        .src('wp-content/plugins/sfwd-lms/**/*.{php,po,pot}', { base: './' })
        .pipe(replace(/PRINT YOUR CERTIFICATE!?/, 'Print Certificate'))
        .pipe(gulp.dest('./'))
);


gulp.task('fix-files', gulp.parallel('fix-divi', 'fix-learndash'));
