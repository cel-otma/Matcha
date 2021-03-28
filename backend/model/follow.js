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

exports.postFollow = async (from_uid, to_uid) => {
    var sql_insert = 'INSERT INTO `followers` (`from_uid`, `to_uid`) VALUES ?';
    var sql_select = 'SELECT * FROM `followers` WHERE `from_uid` = ? AND `to_uid` = ?';
    var sql_delete = 'DELETE FROM `followers` WHERE `from_uid` = ? AND `to_uid` = ?';

    let data = await query(sql_select, [from_uid, to_uid]);
    if (data.length)
        await query(sql_delete, [from_uid, to_uid]);
    else
        await query(sql_insert, [[[from_uid, to_uid]]]);
    return (true);
}

exports.getAllFollowers = async (to_uid) => {
    var sql_select = 'SELECT * FROM `followers` WHERE `to_uid` = ?';

    let data = await query(sql_select, [to_uid]);
    return {error : false, success : true, data : data};
}

exports.getFollowersWhere = async (where, vars) => {
    var sql = 'SELECT * FROM `followers` WHERE ' + where;

    let data = await query(sql, vars);
    return {error : false, success : true, data : data};
}