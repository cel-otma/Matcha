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

exports.CreateConf = async (Data) => {
    var values = [
        [Data.con_key, Data.user_id, Data.con_type]
    ];
    var sql = 'INSERT INTO `confirm` (`con_key`, `user_id`, `con_type`) VALUES ?';
    await query(sql, [values]);
    return ({success : true, error : false});
}

exports.getConfWhere = async (Where, vars) => {
    var sql = 'SELECT * FROM `confirm` WHERE ' + Where;
    var data = await query(sql, vars);
    return ({success : true, error : false, data : data});
}

exports.dropConf = async (con_id) => {
    var sql = 'DELETE FROM `confirm` WHERE `con_id` = ?';
    await query(sql, [con_id]);
    return ({success : true, error : false});
}