const State = require('./baseState')
const Insert = require('./insertState')
const AWS = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const debug = require('debug')('upload')

const s3 = new AWS.S3({
  region: 'cn-north-1'
})

/**
 * 上传 上传镜像至S3
 */
class Upload extends State {
  constructor(ctx, ...args) {
    super(ctx, ...args)
    this.name = 'Upload'
  }

  enter(latest) {
    let fileName = path.basename(this.ctx.filePath)
    console.log(fileName)
    let rs = fs.createReadStream(this.ctx.filePath)
    let a = s3.upload({
      Bucket: 'dingnan-upgrade', Key: `beta/backus/${fileName}`, Body: rs, ACL: 'public-read'
    }, (err, data) => {
      if (err) throw err
      this.ctx.url = data.Location
      this.setState(Insert, latest)
    }).on('httpUploadProgress', (pro) => {
      console.log('httpUploadProgress', pro)
      debug(pro.loaded)

    })

    // setInterval(() => {
    //   console.log(a)
      
    // }, 1000)
  }
}

module.exports = Upload