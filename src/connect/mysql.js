

// const mysql = require('mysql');
// const {util} = require('./util.js')
// // 建立链接
// let pool = mysql.createPool({
//     host: '139.196.155.67',
//     user: 'blog',
//     password: 'root',
//     database: 'blog'
// })
//
// exports.query = ( sql, values ) => {
//     return new Promise(( resolve, reject ) => {
//         pool.getConnection(function(err, connection) {
//             if (err) {
//               resolve( util.formatResult(err,false) )
//             } else {
//                 connection.query(sql, values, ( err, fields) => {
//                     if ( err )   resolve( util.formatResult(err,false) )
//                     else  resolve( util.formatResult(fields,true) )
//                     connection.release();
//                 })
//             }
//         })
//     })
// }
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('blog', 'blog', 'Nhp6Nh3HDYS7JJEi', {
    host: '139.196.155.67',
    dialect:'mysql' /* 选择 'mysql' | 'mariadb' | 'postgres' | 'mssql' 其一 */
});
// (async () => {
//   await sequelize.sync();
//   // 这里是代码
// })();
try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
module.exports = {
  sequelize
}