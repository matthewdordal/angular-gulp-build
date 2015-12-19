var gulp = require('gulp');
var webserver = require('gulp-webserver');
var del = require('del');
var sass = require('gulp-sass');
var karma = require('gulp-karma');
var jshint = require('gulp-jshint');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');
var ngAnnotate = require('browserify-ngannotate');

var CacheBuster = require('gulp-cachebust');
var cachebust = new CacheBuster();

gulp.task('build-css', ['clean'], function() {
	return gulp.src('./styles/*')
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(cachebust.resources())
		.pipe(sourcemaps.write('./maps'))
		.pipe(gulp.dest('./dist'));
});

gulp.task('build-js', ['clean'], function() {
	var b = browserify({
		entries: './js/app.js',
		debug: true,
		paths: ['./js/**/*.js'],
		transform: [ngAnnotate]
	});

	return b.bundle()
		.pipe(source('bundle.js'))
		.pipe(buffer())
		.pipe(cachebust.resources())
		.pipe(sourcemaps.init({loadMaps: true}))
		.pipe(uglify())
		.on('error', gutil.log)
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.des('./dist/js/'));
});

gulp.task('sprite', function () {
  var spriteData = gulp.src('./images/*.png')
      .pipe(spritesmith({
          imgName: 'todo-sprite.png',
          cssName: '_todo-sprite.scss',
          algorithm: 'top-down',
          padding: 5
      }));
 
    spriteData.css.pipe(gulp.dest('./dist'));
    spriteData.img.pipe(gulp.dest('./dist'))
});
