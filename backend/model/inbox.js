const mysql = require('mysql');
const util = require('util');
require('dotenv').config();

let con = mysql.createConnection({
    'host' : process.env.DB_HOST,
    'port' : process.env.DB_PORT,
    'database' : process.env.DB_NAME,
    'user' : process.env.DB_USER,
    'password' : process.env.DB_PASSWD,
    connectionLimit: 1000000
});

con.connect((err) => {
});

const query = util.promisify(con.query).bind(con);

exports.postmsg = async (user_id, to_id, message) => {
    let sql = 'INSERT INTO `inboxs` (`user_id`, `to_id`, `message`) VALUES ?';

    await query(sql, [[[user_id, to_id, message]]]);
    return true;
}

exports.run_query = async (sql, vars) => {
    let data = await query(sql, vars);
    return (data);
}

exports.getMsgsWhere = async (where, vars) => {
    let sql = 'SELECT * FROM `inboxs` WHERE ' + where;

    data = await query(sql, vars);
    return data;
}