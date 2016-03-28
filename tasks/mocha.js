// -------------------------------------------
// Tests
// -------------------------------------------

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('mocha', function() {
  return gulp.src([
    './test/setup/node.js',
    './test/unit/**/*.js'
  ], { read: false })
    .pipe($.plumber())
    .pipe($.mocha({ reporter: 'spec' }));
});
