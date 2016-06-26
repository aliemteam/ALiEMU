/*eslint-env es6*/
'use strict';

// General
const gulp          = require('gulp');
const browserSync   = require('browser-sync').create();
const del           = require('del');
const exec          = require('child_process').exec;
const replace       = require('gulp-replace');
// CSS
const stylus        = require('gulp-stylus');
const poststylus    = require('poststylus');
const autoprefixer  = require('autoprefixer')({ browsers: ['last 2 versions'] });
const rucksack      = require('rucksack-css');
const sourcemaps    = require('gulp-sourcemaps');
// JS
const uglify        = require('gulp-uglify');
// TypeScript
const webpack       = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const webpackDevConfig = Object.assign({}, webpackConfig, {
    devtool: 'eval-source-map',
    cache: true,
});



// ==================================================
//                 Utility Tasks
// ==================================================

// Delete all files in dist/aliemu-plugins
gulp.task('clean', (done) => del(['dist/aliemu-plugins/**/*', 'dist/Divi-child/**/*'], done) );

// Take ownership of dist directory
gulp.task('chown', (done) => {
    exec('ls -ld dist | awk \'{print $3}\'', (err, stdout, stderr) => {
        if (err) throw err;
        if (stdout === process.env.USER) return done();
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

gulp.task('static:aliemu-plugins', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/plugins/aliemu-plugins/**/*.{ts,tsx,json,styl,md}',
    ], { base: 'wp-content/plugins/aliemu-plugins/' })
    .pipe(gulp.dest('dist/aliemu-plugins'))
);

gulp.task('static:divi-child', () =>
    gulp.src([
        'wp-content/themes/Divi-child/**/*.*',
        '!wp-content/**/__tests__',
        '!wp-content/themes/Divi-child/**/*.{ts,tsx,json,styl,md}',
    ], { base: 'wp-content/themes/Divi-child/' })
    .pipe(gulp.dest('dist/Divi-child'))
);


gulp.task('static', gulp.parallel('static:aliemu-plugins', 'static:divi-child'));


// ==================================================
//                     Styles
// ==================================================

gulp.task('stylus:dev', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/inc/styles/styles.styl',
    ], { base: 'wp-content/plugins/aliemu-plugins/', })
    .pipe(sourcemaps.init())
    .pipe(stylus({
        use: [ poststylus([rucksack, autoprefixer]), ],
        compress: true,
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/aliemu-plugins'))
    .pipe(browserSync.stream({ match: '**/*.css' }))
);

gulp.task('stylus:prod', () =>
    gulp.src([
        'wp-content/plugins/aliemu-plugins/inc/styles/styles.styl',
    ], { base: 'wp-content/plugins/aliemu-plugins/', })
    .pipe(stylus({
        use: [ poststylus([rucksack, autoprefixer]), ],
        compress: true,
    }))
    .pipe(gulp.dest('dist/aliemu-plugins'))
);


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
    gulp.parallel('static', 'webpack:prod', 'stylus:prod'),
    'js'
));

gulp.task('default',
    gulp.series(
        'chown',
        'clean',
        gulp.parallel('static', 'webpack:dev', 'stylus:dev'), () => {

            // Tries to connect via docker-machine first, if it fails, then default to
            // docker native (keeping this in the event we get more contributors in the future)
            try {
                let MACHINE_IP = process.env.DOCKER_HOST.match(/\d.*(?=:)/)[0] + ':8080';
                browserSync.init({
                    proxy: MACHINE_IP
                });
            } catch(e) {
                browserSync.init({
                    proxy: 'localhost:8080'
                });
            }

            gulp.watch([
                'wp-content/plugins/**/*.styl',
            ], gulp.series('stylus:dev'));

            gulp.watch([
                'wp-content/**/*.{ts,tsx}',
                '!wp-content/**/__tests__/',
                '!wp-content/**/__tests__/*',
            ], gulp.series('webpack:dev', 'reload'));

            gulp.watch([
                'wp-content/**/*',
                '!wp-content/**/*.{ts,tsx,styl}',
                '!wp-content/**/__tests__/',
                '!wp-content/**/__tests__/*',
            ], gulp.series('static', 'reload'));

        }
    )
);

// ==================================================
//               Plugin/Theme Fixes
// ==================================================

gulp.task('fix-divi', () => {
    const slackEmailHook = `
    do_action('slack_email_hook', array(
        'name' => $contact_name,
        'email' => $contact_email,
        'message' => stripslashes( wp_strip_all_tags( $message_pattern ) ),
    ));
    `;

    return gulp.src([
        './wp-content/themes/Divi/includes/builder/main-modules.php'
    ], { base: './' })
    .pipe(replace(/wp_mail(.|\n)+?;/, slackEmailHook))
    .pipe(gulp.dest('./'));
});

gulp.task('fix-learndash', () =>
    gulp.src([
        './wp-content/plugins/sfwd-lms/**/*.{php,po,pot}'
    ], { base: './' })
    .pipe(replace(/PRINT YOUR CERTIFICATE!?/, 'Print Certificate'))
    .pipe(gulp.dest('./'))
);


gulp.task('fix-files', gulp.parallel('fix-divi', 'fix-learndash'));
