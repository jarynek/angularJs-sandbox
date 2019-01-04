const gulp = require('gulp'),
    webpack = require('webpack-stream'),
    minify = require('gulp-minify'),
    sass = require('gulp-sass');

gulp.task('scripts', () => {
    return (gulp.src('./ts/*.ts'))
        .pipe(webpack(require('./webapack.config.js')))
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./js/'))
});

gulp.task('sass', () => {
    return gulp.src('./sass/*.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./css'));
});