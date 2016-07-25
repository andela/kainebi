var gulp             = require('gulp');
var sass             = require('gulp-sass');
var jshint           = require('gulp-jshint');
var print            = require('gulp-print');
var uglify           = require('gulp-uglify');
var cssnano          = require('gulp-cssnano');
var gulpIf           = require('gulp-if');
var concat           = require('gulp-concat');
var postcss          = require('gulp-postcss');
var cssnext          = require('postcss-cssnext');
var precss           = require('precss');
var stripCssComments = require('gulp-strip-css-comments');
var del              = require('del');
var runSequence      = require('run-sequence');
var browserSync      = require('browser-sync').create();


gulp.task('sass', function () {
  var processors = [
    cssnext,
    precss,
    cssnano
  ];
  return gulp.src(['src/**/*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(stripCssComments())
    .pipe(gulp.dest('dist/css'))
    .pipe(print())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: 'demo',
      routes: {
        "/dist": "dist"
      }
    },
  });
});

gulp.task('concat', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(concat('app.js'))
     // Minifies if JS file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', ['serve', 'sass'], function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.js', browserSync.reload);

  // Reload when markup for demo app changes
  gulp.watch('./src/_site/*.html', browserSync.reload);
});

gulp.task('fonts', function () {
  return gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean:dist', function () {
  return del.sync('dist');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'concat', 'fonts'],
      callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'serve', 'watch'],
    callback
  );
});
