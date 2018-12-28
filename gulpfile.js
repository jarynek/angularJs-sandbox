const gulp = require('gulp'),
   webpack = require('webpack-stream');

gulp.task('scripts', ()=>{
    return(gulp.src('./ts/*.ts'))
        .pipe(webpack(require('./webapack.config.js')))
        .pipe(gulp.dest('./js/'))
});