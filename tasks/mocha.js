// -------------------------------------------
// Tests
// -------------------------------------------

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('mocha', function() {
  return gulp.src([
    './spec/env/browser.js',
    './spec/*.js'
  ], { read: false })
    .pipe($.plumber())
    .pipe($.mocha({ reporter: 'spec' }));
});
