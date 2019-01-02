const gulp = require('gulp'),
    webpack = require('webpack-stream'),
    minify = require('gulp-minify');

gulp.task('scripts', () => {
    return (gulp.src('./ts/*.ts'))
        .pipe(webpack(require('./webapack.config.js')))
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulp.dest('./js/'))
});