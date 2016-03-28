// -------------------------------------------
// Linting
// -------------------------------------------

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var stylish = require('jshint-stylish');
var jscsStylish = require('jscs-stylish');

var js = [
  './lib/**/*.js',
  // './spec/**/*.js',
  './index.js',
  './gulpfile.js'
];

gulp.task('jshint', function() {
  return gulp.src(js)
    .pipe($.plumber())
    .pipe($.jshint())
    .pipe($.jshint.reporter(stylish))
    .pipe($.jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(js)
    .pipe($.jscs())
    .pipe($.jscs.reporter(jscsStylish))
    .pipe($.jscs.reporter('fail'));
});

gulp.task('lint', ['jshint', 'jscs']);
