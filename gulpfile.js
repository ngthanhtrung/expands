'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

/* Constants */

var constant = {
  dir: {
    lib: 'lib',
    test: 'test',
    testResources: 'test/resources'
  },
  file: {
    testSetup: 'test/setup.js'
  },
  set: {
    all: [
      'lib/**/*.js',
      'test/**/*.js',
      'gulpfile.js'
    ],
    code: [ 'lib/**/*.js' ],
    test: [ 'test/**/*.js' ],
    testSets: [
      'test/**/*.js',
      '!test/setup.js'
    ]
  }
};

var f = constant.file;
var s = constant.set;

/* Gulp helpers */

var watching = false;

gulp.doneCallback = function (err) {
  if (!watching) {
    process.exit(err ? 1 : 0);
  }
};

var onError = function (err) {
  $.util.log(
    $.util.colors.red(
      err && err.stack ? err.stack : err
    )
  );

  if (watching) {
    this.emit('end');
  }
  else {
    process.exit(1);
  }
};

/* Gulp tasks */

gulp.task('lint', function () {
  return lint(
    gulp.src(s.all)
  );
});

gulp.task('test', function (cb) {
  gulp.src(s.code)
    .pipe($.istanbul({
      includeUntested: true
    }))
    .on('error', $.notify.onError({
      title: 'Test',
      message: '<%= error.message}'
    }))
    .on('error', onError)
    .on('finish', function () {
      test(gulp.src(s.testSets))
        .pipe($.istanbul.writeReports())
        .on('end', cb);
    });
});

gulp.task('watch', function () {
  watching = true;

  // Lints changed files
  lint($.watch(s.all));

  // Tests using only changed test files
  test($.watch(s.testSets));

  // Tests all on code and test resource changes
  gulp.watch(s.test, [ 'test' ]);
});

gulp.task('default', [ 'watch' ]);

/* Gulp task logic */

function lint(src) {
  return src
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.notify({
      title: 'Lint',
      message: function (file) {
        if (!file.jshint || file.jshint.success) {
          return false;
        }

        var errors = file.jshint.results.map(function (data) {
          if (data.error) {
            return $.util.template(
              '(<%= line %>:<%= character %>) <%= reason %>',
              {
                file: file,
                line: data.error.line,
                character: data.error.character,
                reason: data.error.reason
              }
            );
          }
        }).join('\n');

        return '<%= file.relative %> ' +
          '(<%= file.jshint.results.length %> ' +
          'error<% if (file.jshint.results.length > 1) { %>s<% } %>).\n' +
          errors;
      }
    }))
    .pipe($.jshint.reporter('fail'))
    .on('error', onError);
}

function test(src) {
  require('./' + f.testSetup);

  return src
    .pipe($.mocha())
    .on('error', $.notify.onError({
      title: 'Test',
      message: '<%= error.message}'
    }))
    .on('error', onError);
}
