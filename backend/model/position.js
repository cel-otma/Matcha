const mysql = require('mysql');
const util = require('util');
const { use } = require('../router/tags');
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

exports.setposition = async (userid, lat, lon) => {
    let sqlup = 'UPDATE `gps_position` SET `latitude`=?, `longitude`=?, `modified_dat`=CURRENT_TIMESTAMP WHERE `user_id` = ?';
    let sqlins = 'INSERT INTO `gps_position` (`user_id`, `latitude`, `longitude`) VALUES ?';
    let data = await query('SELECT NULL FROM `gps_position` WHERE `user_id` = ?', [userid]);
    if (!data.length)
        await query(sqlins, [[[userid, lat, lon]]]);
    else
        await query(sqlup, [lat, lon, userid]);
    return true;
}

exports.getposition = async (userid) => {
    let sql = 'SELECT * from `gps_position` where `user_id` = ?';

    return await query(sql, [userid]);
}

exports.delposition = async (userid) => {
    let sql = 'DELETE FROM `gps_positions` where `user_id` = ?';

    return await query(sql, [userid]);
}