/**********************************************************************************/
/*                                                                                */
/*                                   LIBRARIES                                    */
/*                                                                                */
/**********************************************************************************/

import del from 'del';
import gulp from 'gulp';
import shell from 'gulp-shell';
import HTMLMinifier from 'gulp-htmlmin';

/**********************************************************************************/
/*                                                                                */
/*                                   VARIABLES                                    */
/*                                                                                */
/**********************************************************************************/

const dataToRemove = [ './dist', './src/app/**/*.js', './src/app/**/*.js.map' ];

/**********************************************************************************/
/*                                                                                */
/*                                     HOOKS                                      */
/*                                                                                */
/**********************************************************************************/

const minify = () => {
  return gulp.src('dist/index.html')
    .pipe(HTMLMinifier({
      minifyJS: {
        mangle: true,
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      },
      minifyCSS: {
        level: 2
      },
      collapseWhitespace: true,
      quoteCharacter: '"',
      removeComments: true
    }))
    .pipe(gulp.dest('dist/'));
};

const clean = () => {
  console.log('--> Removing:', dataToRemove.join(', '));
  return del(dataToRemove);
};

/**********************************************************************************/
/*                                                                                */
/*                                     TASKS                                      */
/*                                                                                */
/**********************************************************************************/

gulp.task('clean', clean);
gulp.task('start', shell.task('npm run start'));

gulp.task('build', gulp.series(clean, shell.task('npm run build'), minify));
gulp.task('build:staging', gulp.series(clean, shell.task('npm run build:staging'), minify));
gulp.task('build:prod', gulp.series(clean, shell.task('npm run build:prod'), minify));

gulp.task('default', gulp.series('start'));
