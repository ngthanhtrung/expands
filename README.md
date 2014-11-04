# expands

[![NPM version][meta-img-npm]][meta-url-npm]
[![Build status][meta-img-travis]][meta-url-travis]
[![Coveralls status][meta-img-coveralls]][meta-url-coveralls]
[![Support us][meta-img-gratipay]][meta-url-gratipay]

Expands variable placeholders in objects.

## Installation

This module can be installed easily with [npm][url-npm]:

```sh
$ npm install expands
```

## Usage

These examples show you how `expands` works:

```js
var assert = require('assert');
var expand = require('expands');

// Expands string
assert.deepEqual(expand({
  message: 'Welcome {name}!',
  name: 'intruder'
}), {
  message: 'Welcome intruder!',
  name: 'intruder'
});

// Expands array
assert.deepEqual(expand({
  messages: [
    'Welcome {name}!',
    'You are {age} years old.',
    12345
  ],
  name: 'intruder',
  age: 1000
}), {
  messages: [
    'Welcome intruder!',
    'You are 1000 years old.',
    12345
  ],
  name: 'intruder',
  age: 1000
});

// Expands deep path
assert.deepEqual(expand({
  foo: {
    bar: {
      one: '1',
      two: '2'
    },
    message: 'One is {foo.bar.one} and two is {foo.bar.two}.'
  }
}), {
  foo: {
    bar: {
      one: '1',
      two: '2'
    },
    message: 'One is 1 and two is 2.'
  }
});

// Expands circle dependency
assert.deepEqual(expand({
  a: 'from {b}', // expanding is top-down so `a` will be expanded first
  b: 'from {c}',
  c: 'from {a}', // `a` is not expanded completely, resolved to 'from ',
}), {
  a: 'from from from from ',
  b: 'from from from ',
  c: 'from from '
});
```

## Contributing

Before [create a pull request][repo-url-pull-request], make sure that you:

* Followed coding convention as described in
**[.editorconfig][repo-editorconfig]** or **[.jshintrc][repo-jshintrc]** file
(more information can be found at [editorconfig.org][url-editorconfig] and
[www.jshint.com/docs][url-jshint-docs], respectively).

* Added tests for your code.

* Passed all tests!

To execute all tests, simply run:

    $ npm test

### Contributors

* **Author**: [Meo][url-meoguru]

## License

This module is released under [MIT license][repo-license].

[![Analytics][meta-img-ga]][meta-url-ga]

[//]: # (Site URLs)
[url-node]: http://nodejs.org
[url-npm]: https://www.npmjs.org/
[url-editorconfig]: http://editorconfig.org
[url-jshint-docs]: http://www.jshint.com/docs
[url-traceur]: https://github.com/google/traceur-compiler
[url-source-map-support]: https://github.com/evanw/node-source-map-support

[//]: # (Repository URLs and resources)
[repo-url-new-issue]: https://github.com/meoguru/traceur-source-maps/issues/new
[repo-url-pull-request]: https://github.com/meoguru/traceur-source-maps/pulls
[repo-license]: https://github.com/meoguru/traceur-source-maps/blob/master/LICENSE
[repo-editorconfig]: https://github.com/meoguru/traceur-source-maps/blob/master/.editorconfig
[repo-jshintrc]: https://github.com/meoguru/traceur-source-maps/blob/master/.jshintrc

[//]: # (Repository meta information)
[meta-url-npm]: https://npmjs.org/package/expands
[meta-img-npm]: https://img.shields.io/npm/v/expands.svg?style=flat
[meta-url-travis]: https://travis-ci.org/meoguru/expands
[meta-img-travis]: https://img.shields.io/travis/meoguru/expands.svg?style=flat
[meta-url-coveralls]: https://coveralls.io/r/meoguru/expands
[meta-img-coveralls]: https://img.shields.io/coveralls/meoguru/expands/master.svg?style=flat
[meta-url-gratipay]: https://gratipay.com/meoguru
[meta-img-gratipay]: https://img.shields.io/gratipay/meoguru.svg?style=flat
[meta-url-ga]: https://github.com/igrigorik/ga-beacon
[meta-img-ga]: https://ga-beacon.appspot.com/UA-54698248-1/repo/README.md

[//]: # (Authors and contributors URLs)
[url-meoguru]: http://meo.guru
