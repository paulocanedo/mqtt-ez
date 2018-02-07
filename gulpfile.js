const gulp    = require('gulp'),
      connect = require('gulp-connect'),
      debug   = require('gulp-debug');;

gulp.task('default', function(done) {
  done();
});

gulp.task('connect', function() {
  connect.server({
    root: 'app',
    livereload: true
  });
});

gulp.task('html', function () {
  gulp.src('./src/**/*.html')
    .pipe(debug({title: 'HTML:'}))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('js', function () {
  gulp.src('./src/**/*.js')
    .pipe(debug({title: 'JS:'}))
    .pipe(gulp.dest('./app'))
    .pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['./src/*.html'], ['html', 'js']);
});

gulp.task('server', ['connect', 'watch']);
