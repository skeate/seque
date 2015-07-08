var gulp = require('gulp');
var babel = require('gulp-babel');
var umd = require('gulp-umd');
var karma = require('karma').server;
var mocha = require('gulp-mocha');
require('coffee-script/register');

gulp.task('build', function() {
  gulp.src('src/**/*.js')
  .pipe(babel())
  .pipe(umd())
  .pipe(gulp.dest('dist'))
  ;
});

gulp.task('tdd', function(done) {
  gulp.watch('src/**/*.js', ['build']);
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

gulp.task('mocha', function() {
  gulp.src('./test/seque_test.coffee', {read: false})
    .pipe(mocha());
});

gulp.task('karma-ci', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

// note: this does not actually seem to work for various reasons :/
gulp.task('test', ['mocha', 'karma-ci']);
gulp.task('default', ['build', 'tdd']);
