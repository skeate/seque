var gulp = require('gulp');
var babel = require('gulp-babel');
var umd = require('gulp-umd');
var karma = require('karma').server;

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

gulp.task('default', ['build', 'tdd']);
