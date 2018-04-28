'use strict'

const thunky = require('thunky')
const sigmund = require('sigmund')

module.exports = function (work, stringify) {
  stringify = stringify || sigmund

  return function (...args) {
    const callback = args.pop()
    const key = args.length === 0 ? '' : stringify(args)

    let thunk = this[key]

    if (thunk === undefined) {
      thunk = thunky(work.bind(null, ...args))
      this[key] = thunk
    }

    thunk(callback)
  }.bind({})
}
