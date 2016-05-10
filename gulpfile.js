/*eslint-env es6*/
'use strict';

const gulp             = require('gulp');
const postcss          = require('gulp-postcss');
const rename           = require('gulp-rename');
const sugarss          = require('sugarss');
const sourcemaps       = require('gulp-sourcemaps');
const webpack          = require('webpack-stream');
const browserSync      = require('browser-sync').create();
const del              = require('del');
const uglify           = require('gulp-uglify');
const webpackConfig    = require('./webpack.config.js');
const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'source-map',
    cache: true,
})

// ==================================================
//                 Utility Tasks
// ==================================================

// Delete all files in dist/aliemu-plugins
gulp.task('clean', (done) => del(['dist/aliemu-plugins/**/*', 'dist/Divi-child/**/*'], done) );

// Trigger a browsersync reload
gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

// ==================================================
//                    Static
// ==================================================

gulp.task('static:aliemu-plugins', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/plugins/aliemu-plugins/**/*.{ts,tsx,json,scss,sss}',
    ], { base: 'wp-content/plugins/aliemu-plugins/' })
    .pipe(gulp.dest('dist/aliemu-plugins'))
);

gulp.task('static:divi-child', () =>
    gulp.src([
        'wp-content/themes/Divi-child/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/themes/Divi-child/**/*.{ts,tsx,json,scss,sss}',
    ], { base: 'wp-content/themes/Divi-child/' })
    .pipe(gulp.dest('dist/Divi-child'))
);


gulp.task('static', gulp.parallel('static:aliemu-plugins', 'static:divi-child'));


// ==================================================
//                     Styles
// ==================================================

const processors = [
    require('precss'),
    require('autoprefixer')({ browsers: ['last 2 versions'] }),
    require('cssnano')(),
];

gulp.task('styles-dev:aliemu-plugins', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/inc/styles/styles.sss',
    ], { base: 'wp-content/plugins/aliemu-plugins/', })
    .pipe(sourcemaps.init())
    .pipe(postcss(processors, { parser: sugarss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/aliemu-plugins'))
    .pipe(browserSync.stream({match: '**/*.css'}))
);
gulp.task('styles-dev:divi-child', () =>
    gulp.src([
        'wp-content/themes/Divi-child/**/*.sss',
    ], { base: 'wp-content/themes/Divi-child/', })
    .pipe(sourcemaps.init())
    .pipe(postcss(processors, { parser: sugarss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/Divi-child'))
    .pipe(browserSync.stream({match: '**/*.css'}))
);

gulp.task('styles-prod:aliemu-plugins', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/inc/styles/styles.sss',
    ], { base: 'wp-content/plugins/aliemu-plugins/', })
    .pipe(postcss(processors, { parser: sugarss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('dist/aliemu-plugins'))
);
gulp.task('styles-prod:divi-child', () =>
    gulp.src([
        'wp-content/themes/Divi-child/**/*.sss',
    ], { base: 'wp-content/themes/Divi-child/', })
    .pipe(postcss(processors, { parser: sugarss }))
    .pipe(rename({ extname: '.css' }))
    .pipe(gulp.dest('dist/Divi-child'))
);

gulp.task('styles:dev', gulp.parallel(
    'styles-dev:aliemu-plugins',
    'styles-dev:divi-child'
));
gulp.task('styles:prod', gulp.parallel(
    'styles-prod:aliemu-plugins',
    'styles-prod:divi-child'
));


// ==================================================
//                    Javascript
// ==================================================

gulp.task('webpack:dev', () =>
    gulp.src('wp-content/plugins/aliemu-plugins/inc/dashboards/educator-dashboard/EducatorDashboard.tsx')
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest('dist/'))
);


gulp.task('webpack:prod', () =>
    gulp.src('wp-content/plugins/aliemu-plugins/inc/dashboards/educator-dashboard/EducatorDashboard.tsx')
    .pipe(webpack(webpackConfig))
    .pipe(gulp.dest('dist/'))
);

gulp.task('js', () =>
    gulp.src([
        'dist/**/*.js',
    ])
    .pipe(uglify({
        compress: {
            'dead_code': true,
            'unused': true,
            'drop_debugger': true,
            'drop_console': true,
        }
    }))
    .pipe(gulp.dest('dist'))
);

// ==================================================
//                 Compound Tasks
// ==================================================

gulp.task('build', gulp.series(
    'clean',
    gulp.parallel('static', 'webpack:prod', 'styles:prod'),
    'js'
));

gulp.task('default',
    gulp.series(
        'clean',
        gulp.parallel('static', 'webpack:dev', 'styles:dev'), () => {

            switch (process.platform) {
                case 'linux':
                    browserSync.init({
                        proxy: 'localhost:8080'
                    });
                    break;
                default:
                    try {
                        let MACHINE_IP = process.env.DOCKER_HOST.match(/\d.*(?=:)/)[0] + ':8080';
                        browserSync.init({
                            proxy: MACHINE_IP
                        });
                    } catch (e) {
                        console.log('The following error occurred:\n');
                        console.log(e.message);
                    }
            }

            gulp.watch([
                'wp-content/plugins/**/*.sss',
            ], gulp.series('styles-dev:aliemu-plugins'));

            gulp.watch([
                'wp-content/themes/**/*.sss',
            ], gulp.series('styles-dev:divi-child'));

            gulp.watch([
                'wp-content/**/*.{ts,tsx}',
                '!wp-content/**/__tests__/',
                '!wp-content/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            gulp.watch([
                'wp-content/**/*',
                '!wp-content/**/*.{ts,tsx,sss}',
                '!wp-content/**/__tests__/',
                '!wp-content/**/__tests__/*',
            ], gulp.series('build', 'reload'));

        }
    )
);
