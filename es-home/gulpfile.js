const gulp = require('gulp');
const war = require('gulp-war');
const zip = require('gulp-zip');
const merge = require('merge-stream');
const version = require('./package.json').version;
const name = 'es-home';

gulp.task('war', function () {
  return gulp.src('./build/**')
    .pipe(war({
      welcome: 'index.html',
      displayName: 'Extension Scaffold',
    }))
    .pipe(zip(`${name}-${version}.war`))
    .pipe(gulp.dest('./target'));
});