const EventEmitter = require('events').EventEmitter
const debug = require('debug')('state')

class State {
  constructor(ctx, ...args) {
    this.ctx = ctx
    this.ctx.state = this
    debug(`enter state : ${this.constructor.name}`)
    this.enter(...args)
  }

  setState(NextState, ...args) {
    this.exit()
    new NextState(this.ctx, ...args)
  }

  enter() { }

  exit() { }
}

module.exports = State 
