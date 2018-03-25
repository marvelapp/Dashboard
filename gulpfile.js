'use strict';

const concat = require('gulp-concat'),
      gulp = require('gulp'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      gutil = require('gulp-util'),
      autoprefixer = require('gulp-autoprefixer'),
      babel = require('gulp-babel'),
      connect = require('gulp-connect');

const paths = {
      js: 'assets/js/*.js',
      css: 'assets/scss/*.scss'
};

function sassify() {
    return sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError);
}

gulp.task('build:js', function() {
    return gulp.src(paths.js)
        .pipe(concat('main.min.js'))
        .pipe(babel({
    			presets: ["env"]
    		}))
        .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
        .pipe(rename({dirname: '/'}))
        .pipe(gulp.dest('assets/'))
        .pipe(connect.reload())
});

gulp.task('build:css', () => (
    gulp.src('assets/scss/style.scss')
        .pipe(sassify())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('assets/'))
        .pipe(connect.reload())
));

gulp.task('watch:js', () => {
    gulp.watch(paths.js, ['build:js']);
});

gulp.task('watch:css', () => {
    gulp.watch(paths.css, ['build:css']);
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});

gulp.task('default', [ 'build:css', 'build:js', 'watch:js', 'watch:css', 'webserver']);
