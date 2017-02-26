/**
 * Created by techmaster on 2/11/17.
 */
/**
 * Created by techmaster on 2/5/17.
 */
const spawn = require('child_process').spawn;
const gutil = require('gulp-util');
const gulp = require('gulp');



function run_command(command, options) {
  const child = spawn(command, options, {cwd: process.cwd()});
  let stdout = '', stderr = '';

  child.stdout.setEncoding('utf8');

  child.stdout.on('data', function (data) {
    stdout += data;
    gutil.log(data);
  });

  child.stderr.setEncoding('utf8');
  child.stderr.on('data', function (data) {
    stderr += data;
    gutil.log(gutil.colors.red(data));
    gutil.beep();
  });

  child.on('close', function (code) {
    gutil.log("Done with exit code", code);
    gutil.log("You access complete stdout and stderr from here"); // stdout, stderr
  });
}

gulp.task('default', ['nopromise', 'promise', 'asynawait', 'await_ajax']);

//-------- Running app using npm start
gulp.task('nopromise', () => {
  run_command('node', ['nopromise.js']);
});

gulp.task('promise', () => {
  run_command('node', ['promise.js']);
});

/***
 * Để chạy tính năng async - await cần có option --harmony-async-await
 */
gulp.task('asynawait', () => {
  //run_command('node', ['--harmony-async-await', 'asynawait.js']);
  run_command('node', ['asynawait.js']);
});


gulp.task('await_ajax', () => {
  //remove --harmony-async-await option if you use Node.js version 7.6.0 or later
  //run_command('node', ['--harmony-async-await', 'awaitajax.js']);
  run_command('node', ['awaitajax.js']);
});

