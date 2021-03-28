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


exports.insertblock = async (value) => {
    let sql = 'INSERT INTO `blocks` (`user_id`, `to_id`) VALUES ?';

    await query(sql, value);
    return true;
}

exports.getBlockedWhere = async (where, columns, vars) => {
    let sql = 'SELECT ' + columns + ' FROM `blocks` WHERE ' + where;
    let data = await query(sql, vars);
    return data;
}

exports.deleteblocks = async (where, vars) => {
    let sql = 'DELETE FROM `blocks` WHERE ' + where;

    await query(sql, vars);
    return true;
}