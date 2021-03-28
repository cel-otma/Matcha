const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

let conn = mysql.createConnection({
    'host' : process.env.DB_HOST,
    'port' : process.env.DB_PORT,
    'database' : process.env.DB_NAME,
    'user' : process.env.DB_USER,
    'password' : process.env.DB_PASSWD,
    connectionLimit: 1000000
});

conn.connect((err) => {
});

const query = util.promisify(conn.query).bind(conn);

exports.setstatus = async (status, userid) => {
    let sql = 'SELECT * from `status` WHERE `user_id` = ?';
    let data = await query(sql, userid);
    if (!data.length) {
        await query('INSERT INTO `status` (`user_id`, `status`) VALUES ?', [[[userid, status]]]);
    }else
        await query('UPDATE `status` SET `status`=?, `modified_dat`=CURRENT_TIMESTAMP WHERE `user_id` = ?', [status, userid]);
    return true;
}

exports.getstatus = async (userid) => {
    let sql = 'SELECT * FROM `status` where `user_id` = ?';

    return await query(sql, [userid]);
}