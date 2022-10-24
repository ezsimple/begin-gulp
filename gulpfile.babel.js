import gulp from 'gulp';
import gpug from 'gulp-pug';
import del from 'del';
import ws from 'gulp-webserver';
import image from 'gulp-image';
// import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import miniCSS from 'gulp-csso';
import bro from 'gulp-bro';
import babelify from 'babelify';
import ghPages from 'gulp-gh-pages';
import gulpif from 'gulp-if';

const sass = require('gulp-sass')(require('node-sass'));

const isProduction = false;
const uglifyFlag = isProduction ? true : false;
const prettyFlag = isProduction ? false : true;
const minifyFlag = isProduction ? true : false;

const routes = {
  pug: {
    watch: 'src/**/*.pug',
    src: 'src/*.pug',
    dest: 'build',
  },
  img: {
    src: 'src/img/*',
    dest: 'build/img',
  },
  scss: {
    watch: 'src/scss/**/*.scss',
    src: 'src/scss/style.scss',
    dest: 'build/css',
  },
  js: {
    watch: 'src/js/**/*.js',
    src: 'src/js/**/*.js',
    dest: 'build/js',
  },
};

const img = () =>
  gulp.src(routes.img.src).pipe(image()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
      })
    )
    .pipe(gulpif(minifyFlag, miniCSS()))
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      gulpif(
        uglifyFlag,
        bro({
          transform: [
            babelify.configure({ presets: ['@babel/preset-env'] }),
            ['uglifyify', { global: true }],
          ],
        })
      )
    )
    .pipe(gulp.dest(routes.js.dest));

const pug = () =>
  gulp
    .src(routes.pug.src)
    .pipe(gpug())
    // .pipe(gulpif(prettyFlag, pug({ pretty: prettyFlag })))
    .pipe(gulp.dest(routes.pug.dest));

const clean = () => del(['build/', '.publish']);

const webServer = () =>
  gulp.src(routes.pug.dest).pipe(ws({ livereload: true, open: true }));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const gh = () => gulp.src('build/**/*').pipe(ghPages());

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const live = gulp.parallel([webServer, watch]);

export const build = gulp.series([prepare, assets]);
export const dev = gulp.series([build, live]);
export const deploy = gulp.series([build, gh, clean]);