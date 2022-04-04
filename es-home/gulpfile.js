const gulp = require('gulp');
const war = require('gulp-war');
const zip = require('gulp-zip');
const merge = require('merge-stream');
const version = require('./package.json').version;
const name = 'extension-scaffold'

gulp.task('war', function () {
  return merge(gulp.src('./build/**'),
    gulp.src('WEB-INF/**', {base: '.'}))
    .pipe(war({
      welcome: 'index.html',
      displayName: 'Extension Scaffold',
    }))
    .pipe(zip(`${name}-${version}.war`))
    .pipe(gulp.dest('./target'));
});