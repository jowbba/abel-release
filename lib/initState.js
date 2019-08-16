const path = require('path')
const State = require('./baseState')
const Download = require('./downloadState')
const Err = require('./errorState')
const query = require('./query')
const compareVersion = require('./compareVersion')
const mkdirp = require('mkdirp')
const rimraf = require('rimraf')
const config = require('config')
const request = require('request')
const debug = require('debug')('app')

const sql = `SELECT * FROM upgrade ORDER BY createdAt DESC LIMIT 1`
/**
 * 查询release信息
 */
class Init extends State {
  constructor(ctx) {
    super(ctx)
    this.name = 'init'
  }

  async enter() {
    // 创建临时下载目录
    let tmpPath = this.ctx.tmpPath
    rimraf.sync(tmpPath)
    mkdirp.sync(tmpPath)
    // 拉取数据库最新release版本

    for(let i = 0; i < this.ctx.rds.length; i++) {
      let item = this.ctx.rds[i]
      let {host, user, password, dbname } = JSON.parse(item.Value)
      let result = (await query(host, user, password, dbname, sql))[0]
      item.tag = result? result.tag: undefined
    }

    // 拉取release列表
    let url = config.get('url')
    request.defaults({proxy: 'http://localhost:8100'}).get(url, { headers: {"User-Agent": "other"}}, (err, res, body) => {
      
      if (err) this.setState(Err, err)
      else {
        let result = JSON.parse(body)
        let publishs = result.filter(item => item.name == 'publish')
        if (publishs.length == 0) throw new Error('not found publish release')
        let { tag_name } = publishs[0]
        
        this.ctx.rds.forEach(item => {
          if (!item.tag || compareVersion(tag_name, item.tag)) item.insert = true
          else item.insert = false

        })
        if (this.ctx.rds.filter(item => item.insert == true).length > 0) this.setState(Download, publishs[0])
        else throw new Error('not need to update')        
      }
    })
    
  }


}

module.exports = Init