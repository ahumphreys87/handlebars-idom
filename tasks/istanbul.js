// -------------------------------------------
// Coverage
// -------------------------------------------

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('istanbul', function() {
  return gulp.src(['./lib/**/*.js'])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src([
        './spec/env/browser.js',
        './spec/*.js'
      ], { read: false })
      .pipe($.mocha({
        reporter: 'spec'
      }))
      .pipe($.istanbul.writeReports({
        dir: './coverage',
          reporters: [process.env.NODE_ENV === 'build' ? 'lcov' : 'html'],
          reportOpts: {dir: './coverage'}
      }))
    });
});

gulp.task('coveralls', ['istanbul'], function() {
  gulp.src('coverage/**/lcov.info')
    .pipe($.coveralls());
});
