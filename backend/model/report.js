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

exports.insertreport = async (vars) => {
    let sql = 'INSERT INTO `reports` (`user_id`, `to_id`, `report_type`) VALUES ?';
    await query(sql, vars);
    return true;
}

exports.getreportWhere = async (where, columns, vars) => {
    let sql = 'SELECT ' + columns + ' FROM `reports` WHERE ' + where;
    data = await query(sql, vars);
    return data;
}

exports.deletereport = async (rep_id) => {
    let sql = 'DELETE FROM `reports` WHERE `rep_id` = ?';

    await query(sql, [rep_id]);
    return true;
}