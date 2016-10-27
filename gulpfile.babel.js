import gulp from 'gulp';
import postcss from 'gulp-postcss';
import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';
import cssnext from 'cssnext';
import precss from 'precss';
import watchify from 'watchify';
import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';
import rename from 'gulp-rename';
import sequence from 'gulp-sequence';
import browserSyncObj from 'browser-sync';

const browserSync = browserSyncObj.create();
const reload = browserSync.reload;

gulp.task('css', function() {
    const processors = [
        autoprefixer,
        cssnext,
        precss,
        cssnano
    ];
    return gulp.src('./public/css/*.scss')
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./public'))
        .pipe(reload({
            stream: true
        }));
});

gulp.task('template', function() {
    return gulp.src('./public/template/*.ejs')
        .pipe(reload({
            stream: true
        }));
});
gulp.task('ejs', function() {
    return gulp.src('./views/*.ejs')
        .pipe(reload({
            stream: true
        }));
});

const browserify_instance = watchify(browserify({
    entries: './public/js/index.es6',
    debug: true
}).transform(babelify, {
    presets: ['es2015']
}));

gulp.task('es6', bundleJs);

function bundleJs() {
    return browserify_instance
        .bundle()
        .on('error', function(err) {
            console.log(err.toString());
            this.emit('end');
        })
        .pipe(source('index.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./public'))
        .pipe(reload({
            stream: true
        }));
}

gulp.task('img', function() {
    return gulp.src('./public/img/*')
        .pipe(reload({
            stream: true
        }));
});

gulp.task('compile', function(cb) {
    sequence(['css', 'template', 'ejs', 'es6', 'img'], cb);
});

gulp.task('default', ['compile'], function() {
    browserSync.init({
        proxy: 'localhost:3123'
    });
    gulp.watch('./views/*.ejs', ['ejs']);
    gulp.watch('./public/template/*.ejs', ['template']);
    gulp.watch('./public/css/*.scss', ['css']);
    browserify_instance.on('update', bundleJs);
    gulp.watch('./public/js/**/*', ['es6']);

    gulp.watch('./public').on('change', reload);
});
