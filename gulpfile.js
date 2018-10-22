const gulp = require('gulp'),
    nittro = require('gulp-nittro'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnano = require('cssnano'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    pump = require('pump');

const builder = new nittro.Builder({
    base: {
        core: true,
        datetime: true,
        neon: true,
        di: true,
        ajax: true,
        page: true,
        forms: true,
        flashes: true,
        routing: true
    },
    extras: {
        checklist: true,
        keymap: true,
        dialogs: true,
        confirm: true,
        dropzone: true,
        paginator: true,
        storage: true
    },
    bootstrap: true,
    stack: true
});

const info = require('./package.json');

gulp.task('js', function (cb) {
    pump([
        nittro('js', builder),
        sourcemaps.init(),
        uglify({compress: true, mangle: false}),
        concat('nittro.min.js'),
        sourcemaps.write('.'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('css', function (cb) {
    pump([
        nittro('css', builder),
        sourcemaps.init(),
        less(),
        postcss([ autoprefixer(), cssnano({preset: 'default'}) ]),
        concat('nittro.min.css'),
        sourcemaps.write('.'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('zip', function (cb) {
    pump([
        gulp.src(['dist/nittro.min.*', 'Readme.md']),
        zip(info.name + '-' + info.version + '.zip'),
        gulp.dest('dist/')
    ], cb);
});

gulp.task('build', gulp.parallel('js', 'css'));
gulp.task('release', gulp.series('zip'));
