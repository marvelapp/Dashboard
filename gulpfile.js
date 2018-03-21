'use strict';

const concat = require('gulp-concat'),
      gulp = require('gulp'),
      rename = require('gulp-rename'),
      uglify = require('gulp-uglify'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer');

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
        .pipe(uglify())
        .on('error', function(err){
            console.log(err);
        })
        .pipe(rename({dirname: '/'}))
        .pipe(gulp.dest('assets/'));
});

gulp.task('build:css', () => (
    gulp.src('assets/scss/style.scss')
        .pipe(sassify())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('assets/'))
));

gulp.task('watch:js', () => {
    gulp.watch(paths.js, ['build:js']);
});

gulp.task('watch:css', () => {
    gulp.watch(paths.css, ['build:css']);
});

gulp.task('default', [ 'build:css', 'build:js', 'watch:js', 'watch:css' ]);
