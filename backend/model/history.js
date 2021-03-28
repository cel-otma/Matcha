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

exports.inserttoHistory = async (user_id, message) => {
    let sql = 'INSERT INTO `history` (`user_id`, `message`) VALUES ?';

    await query(sql, [[[user_id, message]]]);
    return true;
}

exports.getHistoryWhere = async (where, columns, vars) => {
    let sql = 'SELECT ' + columns + ' FROM `history` WHERE ' + where;

    let data = await query(sql, vars);
    return data;
}

exports.deleteHistory = async (history_id) => {
    let sql = 'DELETE FROM `history` WHERE `history_id` = ?';

    await query(sql, [history_id]);
    return true;
}