(function() {

var gulp = require('gulp'),
  webserver = require('gulp-webserver'),
  runSequence = require('run-sequence'),
  del = require('del'),
  stylus = require('gulp-stylus'),
  rename = require("gulp-rename"),
  concat = require('gulp-concat'),
  jshint = require('gulp-jshint'),
  sourcemaps = require('gulp-sourcemaps'),
  browserify = require('browserify'),
  source = require('vinyl-source-stream'),
  buffer = require('vinyl-buffer'),
  uglify = require('gulp-uglify'),
  gutil = require('gulp-util'),
  ngAnnotate = require('browserify-ngannotate'),
  htmlreplace = require('gulp-html-replace'),
  open = require('gulp-open'),
  CacheBuster = require('gulp-cachebust'),
  cachebust = new CacheBuster(),
  imagemin = require('gulp-imagemin'),
  cache = require('gulp-cache');

// Define app file path variables
var paths = {
  root: './app/',        // App root path
  css: './app/css/',     // CSS path
  js: './app/js/',       // JS path
  img: './app/img/',     // Img path
  fonts: './app/fonts/', // Fonts path
  views: './app/views/', // Views path
  build: './dev/'      // Build path
};

/////////////////////////////////////////////////////////////////////////////////////
//
// cleans the dev/prod output
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('clean', function () {
  return del( ['dev'] );
});

gulp.task('clean-prod', function () {
  return del( ['prod'] );
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace non-angular scripts to the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('bower', function() {
  return gulp
    .src([
      './app/bower_components/jquery/jquery.min.js',
      './app/bower_components/bootstrap/dist/js/*min.js'
    ])
    .pipe(concat('components.min.js'))
    .pipe(gulp.dest( paths.build + 'js/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace vendor scripts to the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('vendors', function() {
  return gulp.src( paths.js + 'vendors/**/*' )
    .pipe(gulp.dest( paths.build + 'js/vendors/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace index.html to the dev/prod folder with new files' paths
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('index.html', function() {
  return gulp.src( paths.root + 'index.html' )
    .pipe(htmlreplace({
      'bs-css': 'css/bootstrap.min.css',
      'normalize-css': 'css/normalize.css',
      'app-css': 'css/app.min.css',
      'mdrz': 'js/vendors/modernizr.min.js',
      'rem': 'js/vendors/rem.js',
      'slvzr': 'js/vendors/selectivizr-min.js',
      'placeholders': 'js/vendors/placeholders.min.js',
      'components': 'js/components.min.js',
      'bundle': 'js/bundle.js'
    }))
    .pipe(cachebust.references())
    .pipe(gulp.dest( paths.build ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// compile *.styl, minify it and place in the dev/prod folder
// stylus' errors are processed properly
//
/////////////////////////////////////////////////////////////////////////////////////

// dev - non-minified
gulp.task('styl', function (done) {
  gulp.src( paths.css + 'app.styl' )
    .pipe(sourcemaps.init())
    .pipe(stylus()
      .on('error', function(err) {
        done(err);
      }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest( paths.build + 'css/' ))
    .on('end', function() {
      done();
    });
});

// prod - minified
gulp.task('minify-styl', function (done) {
  gulp.src( paths.css + 'app.styl' )
    .pipe(stylus({
        compress: true
      }).on('error', function(err) {
        done(err);
      }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest( paths.build + 'css/' ))
    .on('end', function() {
      done();
    });
});

/////////////////////////////////////////////////////////////////////////////////////
//
// additional css files that should be placed in the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('other-css', function() {
  return gulp
    .src([
      './app/bower_components/bootstrap/dist/css/bootstrap.min.css',
      './app/bower_components/normalize-css/normalize.css'
    ])
    .pipe(gulp.dest( paths.build + 'css/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace fonts to the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('fonts', function() {
  return gulp.src( paths.root + 'fonts/**/*' )
    .pipe(gulp.dest( paths.build + 'fonts/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace images to the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('images', function() {
  return gulp.src( paths.img + '**/*' )
    .pipe(cache(imagemin()))
    .pipe(gulp.dest( paths.build + 'img/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// replace views to the dev/prod folder
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('views', function() {
  return gulp.src( paths.root + 'views/**/*')
    .pipe(gulp.dest( paths.build + 'views/' ));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// Javascript bundle - the order of the js files is determined by Browserify
//
/////////////////////////////////////////////////////////////////////////////////////

var brsfy = browserify({
  entries: paths.js + 'app.js'
});

// dev
gulp.task('browserify', function() {
  return brsfy.bundle()
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(paths.build + 'js/'));
});

// prod
gulp.task('browserify-min', function() {
  return brsfy.bundle()
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(cachebust.resources())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .on('error', gutil.log)
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.build + 'js/'));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// dev/prod build
//
/////////////////////////////////////////////////////////////////////////////////////

// dev
gulp.task('dev', function(callback) {
  // run tasks sync
  runSequence(
    'clean',
    'bower',
    'vendors',
    'styl',
    'other-css',
    'fonts',
    'images',
    'browserify',
    'index.html',
    'views', callback);
});

// prod - minified js and css files
gulp.task('final', ['clean-prod'], function(callback) {
  // change output folder
  paths.build = './prod/';
  // run tasks sync
  runSequence(
    'bower',
    'vendors',
    'minify-styl',
    'other-css',
    'fonts',
    'images',
    'browserify-min',
    'index.html',
    'views', callback);
});

/////////////////////////////////////////////////////////////////////////////////////
//
// watches file system and triggers separate tasks when a modification is detected
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('watch', function() {
  var files = [
    paths.root + 'index.html',
    paths.views + '**/*.html',
    paths.css + '*.styl',
    paths.js + '**/*.js',
    paths.img + '**/*',
    paths.fonts + '**/*'
  ];

  gulp.watch( files[0], ['index.html'] );
  gulp.watch( files[1], ['views'] );
  gulp.watch( files[2], ['styl'] );
  gulp.watch( files[3], ['browserify'] );
  gulp.watch( files[4], ['images'] );
  gulp.watch( files[5], ['fonts'] );
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launches a web server with livereload and open app in browser
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('webserver', ['dev'], function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: 'http://localhost:8000/dev/index.html'
    }));
});

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a development build and publish it to a running server
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', ['watch', 'webserver']);

/////////////////////////////////////////////////////////////////////////////////////
//
// launch a production build
//
/////////////////////////////////////////////////////////////////////////////////////

gulp.task('prod', ['final']);

})();