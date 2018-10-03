var gulp = require('gulp');
var sass = require('gulp-sass');
var debug = require('gulp-debug');
var concat = require('gulp-concat');
var autoprefixer = require('autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var csso = require('gulp-csso');
var cleanCSS = require ('gulp-clean-css') ; 
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var rjs = require('gulp-requirejs'); 
var del = require('del')

// This task can be called from the command line with  `gulp django`
gulp.task('django', function () {
    const spawn = require('child_process').spawn;
    return spawn('python', ['manage.py', 'runserver'])
        .stderr.on('data', (data) => {
            console.log(`${data}`);
        });
});

// Take
gulp.task('sass-styles', function () {
    return gulp.src('map/static/map/sass/main.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(sourcemaps.write('.'))
        .pipe(debug())
        .pipe(cleanCSS())
        .pipe(gulp.dest('map/static/map/css'));

});

gulp.task('del_style', function(){
    return del('map/static/map/css/style.css{,.map}')
});

gulp.task('styles', gulp.series('del_style', function () {
    return gulp.src('map/static/map/css/*.css')
        .pipe(debug())
        .pipe(sourcemaps.init())
        .pipe(postcss([autoprefixer()]))
        .pipe(concat('style.css'))
        .pipe(debug())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('map/static/map/css'));

}));

gulp.task('make-styles', gulp.series('sass-styles', 'styles'))

gulp.task('minify', function() {
    return gulp.src('map/**/*.{html, tpl}')
    .pipe(debug())  
    .pipe(htmlmin({
            collapseWhitespace: true,
            removeComments: true
          }))
    .pipe(debug())
    .pipe(gulp.dest('map/dist/'))
});

gulp.task('requirejsBuild', function(){
    return rjs({
        baseUrl: 'map/static/map/',
        name: 'main',
        mainConfigFile: 'map/static/map/main.js',
        out: 'require.built.js'
    })
    .pipe(gulp.dest('map/static/map/'));

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
    gulp.watch('map/static/map/sass/**/*.scss', gulp.series('make-styles'));
    //gulp.watch('**/*.{scss,css,html,py,js}').on('change', gulp.series("styles", reload));
});


gulp.task('runserver',
    gulp.series('styles',
        gulp.parallel('django', 'browsersync', 'watch')));

// This task can be called with `gulp`
gulp.task('default', gulp.series('runserver'));
