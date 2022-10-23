import gulp from 'gulp';
import gpug from 'gulp-pug';
import { deleteAsync } from 'del';
import gws from 'gulp-webserver';

const routes = {
  pug: {
    src: 'src/*.pug',
    dest: 'build',
    watch: 'src/**/*.pug',
  },
};

// Funtions
const clean = () => deleteAsync(['build/']);

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const webServer = () => {
  gulp.src('build').pipe(gws({ livereload: true, open: true }));
};

const watch = () => gulp.watch(routes.pug.watch, pug);

// Tasks
const prepare = gulp.series([clean]);
const assets = gulp.series([pug]);
const render = gulp.parallel([webServer, watch]);

const dev = gulp.series([prepare, assets, render]);
gulp.task('default', dev);
