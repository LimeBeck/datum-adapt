var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
/* other requirements */
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// This task can be called from the command line with  `gulp django`
gulp.task('django', function() {
    const spawn = require('child_process').spawn;
    return spawn('python', ['manage.py', 'runserver'])
        .stderr.on('data', (data) => {
        console.log(`${data}`);
    });
});

// Take
gulp.task('styles', function() {
    gulp.src('./map/static/map/sass/main.sass')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer() ]))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./map/static/map/css/'));
});

// Initiate browsersync and point it at localhost:8000
gulp.task('browsersync', function() {
    browserSync.init({
        notify: true,
        proxy: "localhost:8000",
    });
});

// Tell gulp to execute 'styles' every time a sass file changes
gulp.task('watch', function() {
    gulp.watch('./map/static/map/sass/**/*.sass', ['styles']);
    gulp.watch(['./**/*.{sass,css,html,py,js}'], reload);
});

// This task can be called with `gulp`
gulp.task('default', ['django', 'browsersync', 'watch']);
