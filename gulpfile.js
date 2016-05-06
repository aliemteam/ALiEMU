/*eslint-env es6*/
'use strict';

const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const uglify       = require('gulp-uglify');
const browserSync  = require('browser-sync').create();
const sass         = require('gulp-sass');
const webpack      = require('webpack-stream');
const del          = require('del');


//!==================================================!
//!                   Clean                          !
//!==================================================!

gulp.task('clean', () => {
  return del([
    'dist/aliemu-plugins/inc/**/*',
  ]);
});

//!==================================================!
//!                   Serve                          !
//!==================================================!

gulp.task('serve', ['build'], () => {

  switch (process.env.USER) {
    case 'dsifford':
      browserSync.init({
        proxy: 'localhost:8080'
      });
      break;
    default:
      try {
        let MACHINE_IP = process.env.DOCKER_HOST.match(/\d.*(?=:)/)[0] + ':8080';
        browserSync.init({
          proxy: process.env.MACHINE_IP
        });
      } catch (e) {
        console.log('The following error occurred:\n');
        console.log(e.message);
      }
  }

  gulp.watch([
    './wp-content/plugins/aliemu-plugins/**/*.{ts,tsx}',
    './wp-content/themes/Divi-child/**/*.{ts,tsx}',
    '!./wp-content/**/*-test.{ts,tsx}',
    '!data.test.ts',
  ], ['webpack']).on('change', browserSync.reload);

  gulp.watch([
    './wp-content/plugins/aliemu-plugins/**/*.scss',
    './wp-content/themes/Divi-child/**/*.scss',
  ], ['sass']);

  gulp.watch([
    './wp-content/plugins/aliemu-plugins/**/*',
    './wp-content/themes/Divi-child/**/*',
    '!./wp-content/plugins/aliemu-plugins/**/*.{ts,tsx,scss}',
    '!./wp-content/themes/Divi-child/**/*.{ts,tsx,scss}',
    '!__tests__/**/*'
  ], ['build', 'reload-delay']);

});


//!==================================================!
//!                   Build                          !
//!==================================================!

gulp.task('build', ['clean', 'sass', 'webpack'], (cb) => {
  new Promise(resolve => {
    let task = gulp.src([
        'wp-content/plugins/aliemu-plugins/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/plugins/aliemu-plugins/**/*.{ts,tsx,json,scss}'
      ], { base: 'wp-content/plugins/aliemu-plugins/' }
    )
    .pipe(gulp.dest('dist/aliemu-plugins'));
    task.on('end', resolve);
  }).then(() => {
    let task = gulp.src([
        'wp-content/themes/Divi-child/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/themes/Divi-child/**/*.{ts,tsx,json,scss\}'
      ],{ base: 'wp-content/themes/Divi-child/' }
    )
    .pipe(gulp.dest('dist/Divi-child'));
    task.on('end', cb);
  });
});

// Compile + autoprefix + minify sass
gulp.task('sass', () => {
  let task1 = new Promise(resolve => {
    let task = gulp.src([
        'wp-content/plugins/aliemu-plugins/**/*.scss',
      ], { base: 'wp-content/plugins/aliemu-plugins/' }
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleanCSS({ compatibility: 'ie10' }))
    .pipe(gulp.dest('dist/aliemu-plugins'))
    .pipe(browserSync.stream());
    task.on('end', resolve);
  });

  let task2 = new Promise(resolve => {
    let task = gulp.src([
        'wp-content/themes/Divi-child/**/*.scss',
      ],{ base: 'wp-content/themes/Divi-child/' }
    )
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleanCSS({ compatibility: 'ie10' }))
    .pipe(gulp.dest('dist/Divi-child'))
    .pipe(browserSync.stream());
  });

  Promise.all([task1, task2]);

});

gulp.task('webpack', () => {
  return gulp.src('wp-content/plugins/aliemu-plugins/inc/dashboards/educator-dashboard/EducatorDashboard.tsx')
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(gulp.dest('dist/'));
});


//!==================================================!
//!                  Deploy                          !
//!==================================================!

// Minify JS + Remove Mapfiles
gulp.task('deploy', ['build'], () => {
  new Promise(resolve => {
    let task = gulp.src(['./dist/**/*.js'])
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
    task.on('end', resolve);
  })
  .then(() => {
    del(['./dist/**/*.map']);
  });
});

//!==================================================!
//!                    Misc                          !
//!==================================================!

gulp.task('reload-delay', ['build'], () => {
  browserSync.reload();
});
