'use strict'

const test = require('tape')
const parallel = require('run-parallel')
const memoize = require('.')

test('0 arguments', function (t) {
  t.plan(3)

  const calls = []
  const f = memoize(function (...args) {
    const callback = args.pop()
    calls.push(args)
    callback()
  })

  parallel([f, f, f], (err, results) => {
    t.ifError(err, 'no error')
    t.same(calls, [[]], '1 call')
    t.is(results.length, 3)
  })
})

test('multiple arguments', function (t) {
  t.plan(6)

  let calls = []

  const f = memoize(function (...args) {
    const callback = args.pop()
    calls.push(args)
    callback(null, calls.length)
  })

  const tasks = [
    f,
    f.bind(null, 1),
    f.bind(null, 1, 2),
    f.bind(null, 1)
  ]

  parallel(tasks, (err, results) => {
    t.ifError(err, 'no error')
    t.same(calls, [[], [1], [1, 2]], '3 calls')
    t.same(results, [1, 2, 3, 2], '4 results')

    calls = []

    parallel(tasks, (err, results) => {
      t.ifError(err, 'no error')
      t.same(calls, [], 'no new calls')
      t.same(results, [1, 2, 3, 2], '4 results')
    })
  })
})

test('arguments with objects', function (t) {
  t.plan(6)

  let calls = []

  const f = memoize(function (...args) {
    const callback = args.pop()
    calls.push(args)
    callback(null, calls.length)
  })

  const tasks = [
    f.bind(null, {}),
    f.bind(null, null),
    f.bind(null, { a: 1 }),
    f.bind(null, {}),
    f.bind(null, [0, 0]),
    f.bind(null, [0, 0]),
    f.bind(null, [0, 1]),
    f.bind(null, [0, 0], false)
  ]

  parallel(tasks, (err, results) => {
    t.ifError(err, 'no error')

    t.same(calls, [
      [{}],
      [null],
      [{ a: 1 }],
      [[0, 0]],
      [[0, 1]],
      [[0, 0], false]
    ], '6 calls')

    t.same(results, [1, 2, 3, 1, 4, 4, 5, 6], '8 results')

    calls = []

    parallel(tasks, (err, results) => {
      t.ifError(err, 'no error')
      t.same(calls, [], 'no new calls')
      t.same(results, [1, 2, 3, 1, 4, 4, 5, 6], '8 results')
    })
  })
})

test('error is not cached', function (t) {
  t.plan(2)

  const calls = []
  const f = memoize(function (...args) {
    const callback = args.pop()
    calls.push(args)
    callback(new Error())
  })

  parallel([f, f], (err) => {
    t.ok(err, 'got error')
    t.same(calls, [[], []], '2 calls')
  })
})

test('custom stringify', function (t) {
  t.plan(2)

  const calls = []
  const f = memoize(function (...args) {
    const callback = args.pop()
    calls.push(args)
    callback()
  }, function stringify (args) {
    return 'same'
  })

  parallel([f.bind(null, 1), f.bind(null, 2)], (err) => {
    t.ifError(err, 'no error')
    t.same(calls, [[1]], '1 call')
  })
})
