'use strict';

const concat = require('gulp-concat'),
      gulp = require('gulp'),
      rename = require('gulp-rename'),
      sass = require('gulp-sass'),
      gutil = require('gulp-util'),
      autoprefixer = require('gulp-autoprefixer'),
      babel = require('gulp-babel'),
      connect = require('gulp-connect'),
      merge = require('merge-stream'),
      uglify = require('gulp-uglify'),
      ghPages = require('gulp-gh-pages'),
      env = require('gulp-env'),
      plugins = require("gulp-load-plugins")({
      	pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
      	replaceString: /\bgulp[\-.]/
      });

const paths = {
      js: 'dist/js/*.js',
      css: 'dist/scss/*.scss',
      html: 'dist/index.html',
      images: 'dist/images/*.{gif,jpg,png,svg}'
};

function sassify() {
    return sass({
        outputStyle: 'compressed'
    }).on('error', sass.logError);
}

gulp.task('build:js', function() {

  var bowerjs = gulp.src( plugins.mainBowerFiles() )
    .pipe(plugins.filter( '**/*.js' ) )

  var js = gulp.src(paths.js)
    .pipe(babel())
    .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })

  return merge(bowerjs, js)
    .pipe(plugins.uglify())
    .pipe(concat('main.min.js'))
    .pipe(rename({dirname: '/'}))
    .pipe(gulp.dest('.build/'))
    .pipe(connect.reload());
});

gulp.task('build:images', function() {
  return gulp.src(paths.images)
      .pipe(gulp.dest('.build/images/'))
      .pipe(connect.reload());
});

gulp.task('build:html', function() {
  return gulp.src(paths.html)
      .pipe(gulp.dest('.build/'))
      .pipe(connect.reload());
});

gulp.task('build:css', () => (
    gulp.src(paths.css)
        .pipe(sassify())
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest('.build/'))
        .pipe(connect.reload())
));

gulp.task('watch:js', () => {
    gulp.watch(paths.js, ['build:js']);
});

gulp.task('watch:images', () => {
    gulp.watch(paths.images, ['build:images']);
});

gulp.task('watch:css', () => {
    gulp.watch(paths.css, ['build:css']);
});

gulp.task('watch:html', () => {
    gulp.watch(paths.html, ['build:html']);
});

gulp.task('deploy', ['set-prod-env','build:css', 'build:js', 'build:images', 'build:html'], function() {
  return gulp.src('.build/**/*')
    .pipe(ghPages());
});

gulp.task('set-dev-env', function() {
  env({
    file: '.env.json'
  });
});

gulp.task('set-prod-env', function() {
  env({
    file: '.env.json',
    vars: {
      MARVEL_CLIENT_ID: "7Ig0DiIJJNSFiX8xx6VS9lubcymTqBGgfUYZuzpa"
    }
  });
});

gulp.task('webserver', function() {
  connect.server({
    livereload: true,
    root: '.build'
  });
});

gulp.task('default', [ 'set-dev-env', 'build:css', 'build:js', 'build:images', 'build:html', 'watch:js', 'watch:css', 'watch:images', 'watch:html', 'webserver']);
