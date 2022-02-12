
const mysql = require('mysql');
const {util} = require('./util.js')
// 建立链接
let pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'blog'
})

exports.query = ( sql, values ) => {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
              resolve( util.formatResult(err,false) )
            } else {
                connection.query(sql, values, ( err, fields) => {
                    if ( err )   resolve( util.formatResult(err,false) )
                    else  resolve( util.formatResult(fields,true) )
                    connection.release();
                })
            }
        })
    })
}

