const State = require('./baseState')

/**
 * 错误： 返回错误或执行出错
 */
class Err extends State {
  constructor(ctx, ...args) {
    super(ctx, ...args)
    this.name = 'error'
  }

  enter(error) {
    console.log(error.message, ' <--in error state')
    this.ctx.error(error)
  }
}

module.exports = Err