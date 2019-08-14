
const State = require('./baseState')
const query = require('./query')
const debug = require('debug')('insert')
const { spawnSync } = require('child_process')



class Insert extends State {
  constructor(ctx, ...args) {
    super(ctx, ...args)
  }

  async enter(latest) {
    for(let i = 0; i < this.ctx.rds.length; i++) {
      let item = this.ctx.rds[i]
      if (!item.insert) break
      let { host, user, password, dbname} = JSON.parse(item.Value)
      let { tag_name } = latest

      let url = this.ctx.url
      let hash = spawnSync('sha256sum', [this.ctx.filePath], { encoding: 'utf8'}).stdout.split(' ')[0]
      let tag = tag_name.split('-')[0]
      if (tag.includes('v')) {
        tag = tag.substr(1)
      }

      debug(tag, hash, url)
      let sql = `INSERT INTO upgrade(tag, hash, url)
      VALUES('${tag}', '${hash}', '${url}')`

      await query(host, user, password, dbname, sql)
    }
  }

}

module.exports = Insert