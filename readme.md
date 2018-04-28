# thunky-with-args

Like [thunky](https://github.com/mafintosh/thunky) but:

**Delay the evaluation of a ~~paramless~~ variadic async function and cache the result.**

[![npm status](http://img.shields.io/npm/v/thunky-with-args.svg?style=flat-square)](https://www.npmjs.org/package/thunky-with-args)
[![node](https://img.shields.io/node/v/thunky-with-args.svg?style=flat-square)](https://www.npmjs.org/package/thunky-with-args)
[![Travis build status](https://img.shields.io/travis/vweevers/thunky-with-args.svg?style=flat-square&label=travis)](http://travis-ci.org/vweevers/thunky-with-args)
[![Dependency status](https://img.shields.io/david/vweevers/thunky-with-args.svg?style=flat-square)](https://david-dm.org/vweevers/thunky-with-args)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg?style=flat-square)](https://standardjs.com)

## example

```js
const dns = require('dns')
const memoize = require('thunky-with-args')

const lookup = memoize(function (hostname, opts, callback) {
  if (typeof opts === 'function') {
    callback = opts
    opts = null
  }

  console.log('lookup', hostname, opts)
  dns.lookup(hostname, opts, callback)
})

lookup('localhost', console.log)
lookup('localhost', console.log)
lookup('localhost', console.log)
lookup('localhost', { family: 6 }, console.log)
lookup('localhost', { family: 6 }, console.log)
```

This results in two lookups, the other calls are cached:

```
lookup localhost null
lookup localhost { family: 6 }
null '127.0.0.1' 4
null '127.0.0.1' 4
null '127.0.0.1' 4
null '::1' 6
null '::1' 6
```

## `thunk = thunkyWithArgs(work[, stringify])`

Returns a function `thunk` that caches the result of `work(..)` unless it returned an error. Optionally provide a `stringify` function that converts an array of arguments to a cache key. Defaults to [`sigmund`](https://github.com/isaacs/sigmund) which works well for primitives, arrays and plain objects but takes a few shortcuts to be fast.

## install

With [npm](https://npmjs.org) do:

```
npm install thunky-with-args
```

## license

[MIT](http://opensource.org/licenses/MIT) © Vincent Weevers
