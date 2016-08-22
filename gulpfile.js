var os               = require('os');
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
var hologram         = require('gulp-hologram');
var open             = require('gulp-open');
var flatten          = require('gulp-flatten');
var imagemin         = require('gulp-imagemin');
var cache            = require('gulp-cache');
var util             = require('gulp-util');
var svgSprite        = require('gulp-svg-sprite');
var svg2png          = require('gulp-svg2png');
var size             = require('gulp-size');
var debug            = require('gulp-debug-streams');
var plumber          = require('gulp-plumber');

var basePaths = {
  src: './src/',
  dest: './dist/'
};

var paths = {
  icons: {
    sprite: {
      src: basePaths.src + 'icons/svg/**/*.svg',
      templateSrc: basePaths.src + 'icons/template/sprite-template.scss',
      svgDest: 'sprites/sprite.svg', // relative
      pngDest: 'sprites/',  // relative
      cssDest: 'sprites/_sprite.scss',  // relative
      dest: basePaths.src + 'icons/'
    }
  },
  img: {
  },
  scss: {
  },
  js: {
  },
  fonts: {
  },
  styleguide: {
  }
};

gulp.task('sass', ['styleguide'], function () {
  var processors = [
    cssnext,
    precss,
    cssnano
  ];
  return gulp.src(['./src/**/*.scss', '!' + paths.icons.sprite.templateSrc])
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(processors))
    .pipe(stripCssComments())
    .pipe(gulp.dest('./dist/css'))
    .pipe(print())
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('fonts', function () {
  return gulp.src("./src/fonts/*.{otf, woff, woff2}")
    .pipe(flatten({ includeParents: 1 }))
    .pipe(gulp.dest('./dist/css/fonts'));
});


gulp.task('images', function(){
  return gulp.src('./src/images/*.+(png|jpg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('dist/images'))
});


gulp.task('icons', function () {
  return gulp.src("./src/icons/sprites/sprite.svg")
    .pipe(plumber())
    .pipe(flatten({ includeParents: 1 }))
    .pipe(gulp.dest('./dist/icons'));
});


gulp.task('styleguide', function () {
  return gulp.src('hologram_config.yml')
    .pipe(hologram({bundler: true, logging: true}));
});

gulp.task('styleguidePreview', function () {
	var browser = os.platform() === 'linux' ? 'google-chrome' : (os.platform() === 'darwin' ? 'google chrome' : (os.platform() === 'win32' ? 'chrome' : 'firefox'));
	return gulp.src(__filename)
		.pipe(open({uri: 'http://localhost:3000/styleguide'}));
});
/*
gulp.task('svgSprite', function () {
  return gulp.src(paths.icons.sprite.src)
    .pipe(plumber())
    .pipe(svgSprite({
      log: 'verbose',
      shape: {
        spacing: {
          padding: 5
        }
      },
      mode: {
        css: {
          dest: './',
          layout: 'diagonal',
          sprite: paths.icons.sprite.svgDest,
          bust: false,
          render: {
            scss: {
              dest: paths.icons.sprite.cssDest,
              template: paths.icons.sprite.templateSrc
            }
          }
        }
      },
      variables: {
        mapname: 'icons'
      }
    })).on('error', function (error) {
      print(error);
    })
    .pipe(gulp.dest(paths.icons.sprite.dest));
});

gulp.task('png2Sprite', ['svgSprite'], function () {
  return gulp.src(paths.icons.sprite.svgDest)
    .pipe(plumber())
    .pipe(svg2png())
    .pipe(size({
      showFiles: true
    })).on('error', function(error) {
      print(error);
    })
    .pipe(gulp.dest(paths.icons.sprite.pngDest));
});

gulp.task('sprite', ['png2Sprite']);
*/

gulp.task('lint', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('serve', function () {
  browserSync.init({
    open: true,
    server: {
      baseDir: 'demo',
      routes: {
        '/dist': 'dist',
        '/styleguide': 'styleguide'
      },
    },
    logPrefix: 'Kainebi',
  });
});

gulp.task('concat', function () {
  return gulp.src(['./src/**/*.js'])
    .pipe(concat('app.js'))
     // Minifies if JS file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', ['serve', 'sass', 'icons', 'fonts', 'images'], function () {
  gulp.watch('./src/**/*.scss', ['sass']);
  // Watch svgs :)
  // gulp.watch(['./src/icons/*/*', '!./src/icons/_mixins.scss'], ['sprite']);
  gulp.watch('./src/images/*.+(png|jpg|gif|svg)', ['images']);

  gulp.watch('./src/**/*.js', browserSync.reload);
  // Reload when markup for demo app changes
  gulp.watch('./demo/**/*.html', browserSync.reload);
});


gulp.task('clean:dist', function () {
  return del.sync('./dist');
});

gulp.task('build', function (callback) {
  runSequence('clean:dist',
    ['sass', 'concat', 'icons', 'fonts', 'images'],
      callback
  );
});

gulp.task('default', function (callback) {
  runSequence(['sass', 'serve', 'watch', 'styleguidePreview'],
    callback
  );
});
