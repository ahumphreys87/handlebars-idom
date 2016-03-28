'use strict';

var gulp = require('gulp');
var requireDir = require('require-dir');

requireDir('./tasks');

// -------------------------------------------
//  Tests
// -------------------------------------------

gulp.task('test', [
  'lint',
  'mocha',
]);

// -------------------------------------------
//  Coverage
// -------------------------------------------

gulp.task('coverage', [
  'lint',
  'istanbul',
]);

// -------------------------------------------
//  Default
// -------------------------------------------

gulp.task('default', ['test']);
