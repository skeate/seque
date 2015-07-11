var gulp = require('gulp');
var babel = require('gulp-babel');
var umd = require('gulp-umd');
var karma = require('karma').server;
var mocha = require('gulp-mocha');
require('coffee-script/register');
require('babel/register');

gulp.task('build', function() {
  gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(umd())
  .pipe(gulp.dest('dist'))
  ;
});

gulp.task('test', function() {
  gulp.src('./test/seque_test.coffee', {read: false})
    .pipe(mocha());
});

gulp.task('default', ['build']);
