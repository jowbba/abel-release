const mysql = require('mysql')

function query(host, user, password, database, sql) {
  return new Promise((resolve, reject) => {
    let connection = mysql.createConnection({ host, user, password, database })
    connection.connect()
    connection.query(sql, (err, result ) => {
      if (err) reject(err)
      else resolve(result)
    })
    connection.end()
  })
}

module.exports = query