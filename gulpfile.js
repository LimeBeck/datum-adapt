var gulp = require('gulp');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// This task can be called from the command line with  `gulp django`
gulp.task('django', function () {
    const spawn = require('child_process').spawn;
    return spawn('python', ['manage.py', 'runserver'])
        .stderr.on('data', (data) => {
            console.log(`${data}`);
        });
});

// Take
gulp.task('styles', function () {
    return gulp.src('map/static/map/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(debug())
        .pipe(gulp.dest('map/static/map/css'));

});

// Initiate browsersync and point it at localhost:8000
gulp.task('browsersync', function () {
    browserSync.init({
        notify: true,
        proxy: "localhost:8000/",
    });

        gulp.watch('map/static/map/sass/**/*.scss', gulp.series('styles'));
        gulp.watch('**/*.{css,html,py,js}').on('change', reload);
});

gulp.task('watch', function(){
    gulp.watch('map/static/map/sass/**/*.scss', gulp.series('styles'));
    gulp.watch('**/*.{scss,css,html,py,js}').on('change', reload);
});


gulp.task('runserver',
    gulp.series('styles',
        gulp.parallel('django', 'browsersync', 'watch')));

// This task can be called with `gulp`
gulp.task('default', gulp.series('django', 'browsersync', 'watch'));
