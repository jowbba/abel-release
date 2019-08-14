const fs = require('fs')
const path = require('path')
const request = require('request')
const State = require('./baseState')
const Upload = require('./uploadState')
const debug = require('debug')('download')

/**
 * 下载： 从github拉取最新镜像
 */
class Download extends State {
  constructor(ctx, latest) {
    super(ctx, latest)
    this.name = 'downloading'
  }

  enter(latest) {
    // console.log(latest)
    let { assets, tag_name } = latest
    let zst = assets.filter(item => item.name.includes('rootfs.tar.zst'))[0]
    if (!zst) throw new Error('could not found zst')
    let { browser_download_url } = zst
    // console.log(this.ctx)
    let timer
    let filePath = path.join(this.ctx.tmpPath, `${tag_name}.tar.zst`)
    let writeStream = fs.createWriteStream(filePath)
    writeStream.on('finish', () => {
      clearInterval(timer)
      this.ctx.filePath = filePath
      this.setState(Upload, latest)
    })
    // console.log(url)
    let size = 0
    // let browser_download_url = 'http://www.aidingnan.com/files/wisnuc-v1.3.4-release.apk'
    request.get(browser_download_url, { headers: {"User-Agent": "other"}})
      .on('data', chunk => size += chunk.length)
      .on('error', err => { throw err })
      .pipe(writeStream)
    
    timer = setInterval(() => {
      debug(`${(size / 1024 / 1024).toFixed(2)} Mb`)
    }, 2000)
    // console.log(req)
  }
}

module.exports = Download