'use strict';

import browserify from 'browserify';
import browsersync from 'browser-sync';
import gulp from 'gulp';
import babel from 'gulp-babel';
import bulkSass from 'gulp-sass-bulk-import';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import buffer from 'vinyl-buffer';
import source from 'vinyl-source-stream';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';

const paths = {
  js: [
    'index.js',
    'app/src/**/*.js'
  ],
  sassSrc: 'app/styles/*.scss',
  sassDest: 'dist/',
  layout: 'layout.xml'
};

gulp.task('src', () => {
  return browserify('index.js', {
      extensions: ['.js', '.json'],
      debug: true
  })
  .transform('babelify')
  .bundle()
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  //.pipe(rename('index.min.js'))
  //.pipe(uglify())
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('dist/'));
});

gulp.task('sass', () => {
  return gulp.src(paths.sassSrc)
    .pipe(sourcemaps.init())
    .pipe(bulkSass())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.sassDest));
});

gulp.task('watch', () => {
  gulp.watch(paths.sassSrc, ['reload-sass']);
	gulp.watch(paths.js, ['reload-src']);
  gulp.watch(paths.layout, ['reload-all'])
});

gulp.task('reload-sass', ['sass'], function () {
  browsersync.reload();
});

gulp.task('reload-src', ['src'], function () {
  browsersync.reload();
});

gulp.task('reload-all', ['src', 'sass'], function () {
  browsersync.reload();
});

gulp.task('serve', () => {
  browsersync.init({
    server: {
      baseDir: './'
    }
  });
});
 
gulp.task('default', ['src', 'sass', 'watch', 'serve']);