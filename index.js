const path = require('path')
const Init = require('./lib/initState')
const AWS = require('aws-sdk')

global.ssm = new AWS.SSM({region: 'cn-north-1'})

ssm.getParameters({ Names: ['rds', 'rds-test'] }, (err, data) => {
  // console.log(err, data)
  if (err || data.Parameters.length !== 2) throw new Error('get rds parameters error')
  new Release(data.Parameters)
})

class Release {
  constructor(rds) {
    this.rds = rds
    this.tmpPath = path.join(process.cwd(), 'tmp')
    this.filePath = ''
    this.sha256 = ''
    this.url = ''
    this.state = null
    new Init(this)
  }

  error() {

  }

  finish() {

  }
}

