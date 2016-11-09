import autoprefixer from 'autoprefixer';
import csso from 'gulp-csso';
import del from 'del';
import { exec } from 'child_process';
import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import insert from 'gulp-insert';
import jade from 'gulp-jade2php';
import merge from 'merge-stream';
import poststylus from 'poststylus';
import rename from 'gulp-rename';
import replace from 'gulp-replace';
import rucksack from 'rucksack-css';
// import sourcemaps from 'gulp-sourcemaps';
import stylus from 'gulp-stylus';
import svgmin from 'gulp-svgmin';
import uglify from 'gulp-uglify';
import webpack from 'webpack-stream';
import _webpack from 'webpack';

import webpackConfig from './webpack.config';

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
gulp.task('reload', (done) => { browserSync.reload(); done(); });


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
        .pipe(stylus(stylusConfig))
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
    gulp
        .src('aliemu/features/dashboards/educator-dashboard/index.tsx')
        .pipe(webpack(webpackConfig, _webpack))
        .pipe(gulp.dest('dist/'))
        .pipe(browserSync.stream())
    );


gulp.task('webpack:prod', () =>
    gulp
        .src('aliemu/features/dashboards/educator-dashboard/index.tsx')
        .pipe(webpack(webpackConfig, _webpack))
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
    gulp.parallel('static', 'webpack:prod', 'stylus:prod'),
    'js'
));

gulp.task('_dev',
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
