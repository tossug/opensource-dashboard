'use strict';

var babel = require('gulp-babel');
var gulp = require('gulp');

var src = [
    'src/**/*.js',
];

var test = [
    'test/**/*.js',
];

var dest = 'build';

gulp.task('babel', function () {
    return gulp.src(src)
        .pipe(babel())
        .pipe(gulp.dest(dest));
});

gulp.task('prepublish', ['babel']);
