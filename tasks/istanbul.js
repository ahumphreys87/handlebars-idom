// -------------------------------------------
// Coverage
// -------------------------------------------

'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('istanbul', function() {
  require('babel-register');

  return gulp.src(['./src/**/*.js', './main.js'])
    .pipe($.istanbul())
    .pipe($.istanbul.hookRequire())
    .on('finish', function() {
      gulp.src(['./spec/**/*.js'], { read: false })
        .pipe($.mocha({
          reporter: 'spec'
        }))
        .pipe($.istanbul.writeReports({
          dir: './coverage',
          reporters: ['html'],
          reportOpts: { dir: './coverage' }
        }))
    });
});
