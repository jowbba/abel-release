const fs = require('fs')
const path = require('path')
const request = require('request')
const State = require('./baseState')
const Upload = require('./uploadState')
const debug = require('debug')('download')
const { execSync } = require('child_process')

/**
 * 下载： 从github拉取最新镜像
 */
class Download extends State {
  constructor(ctx, latest) {
    super(ctx, latest)
    this.name = 'downloading'
  }

  enter(latest) {
    let { assets, tag_name } = latest
    let zst = assets.filter(item => item.name.includes('rootfs.tar.zst'))[0]
    if (!zst) throw new Error('could not found zst')
    let { browser_download_url } = zst
    let filePath = path.join(this.ctx.tmpPath, `${tag_name}.tar.zst`)

    ssm.getParameters({ Names: ['hk'] }, (err, data) => {
      if (err || data.Parameters.length !== 1) throw new Error('get hk params error')
      let { host, password } = JSON.parse(data.Parameters[0].Value)
      execSync(`sshpass -p ${password} ssh root@${host} curl -L ${browser_download_url} -o - > ${filePath}`)

    let stat = fs.statSync(filePath)
    if(zst.size == stat.size) {
      this.ctx.filePath = filePath
      this.setState(Upload, latest)
    } else throw new Error('size not match')
      
    })

    

  }
}

module.exports = Download