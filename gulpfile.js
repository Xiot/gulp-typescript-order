var gulp = require('gulp');
var tsOrder = require('./index');
var angularSort = require('gulp-angular-filesort');
var ts = require('gulp-typescript');
var lister = require('./helpers/file-lister');

var tsProject = ts.createProject({
    sortOutput: false,
    declarationFiles: false,
    target: 'es5',
    sourceRoot: '../',
    noExternalResolve: false
});

gulp.task('order', function (){
    return gulp.src("sample/*.ts")
        .pipe(tsOrder(true));
})

gulp.task('default', function () {
    var tsStream = gulp.src('sample/*.ts')
        //.pipe(lister())
                .pipe(tsOrder())
                .pipe(lister('after ts-order'))
                .pipe(ts(tsProject));

    return tsStream.js
            .pipe(lister('after tsc'))
            .pipe(angularSort())
            .pipe(lister('after ng-sort'))
            ;
});