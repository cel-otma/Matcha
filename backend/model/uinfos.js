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
// `info_id` ,`user_id`,`city` ,`desc`,`bithday`,`gendre`

exports.insert_uinfos = async (infos) => {
    var sql = 'INSERT INTO `users_infos` (`user_id`, `city`, `desc`, `birthday`, `gendre`, `sex_pref`) VALUES ?';

    let result = await query(sql, [[[infos.user_id, infos.city, infos.desc, infos.birthday, infos.gendre, infos.sexpref]]]);
    return ({error : false, success : true, data : result});
}

exports.getUinfosWhere = async (Where, vars) => {
    var sql = "SELECT * FROM `users_infos` WHERE " + Where;
    var result = await query(sql, [vars]);
    return ({error : false, success : true, data : result});
}

exports.getUinfos = async (userid) => {
    var sql = 'SELECT * FROM `users_infos` WHERE `user_id` = ?';

    let result = await query(sql, [userid]);
    return ({error : false, success : true, data : result});
}

exports.updatUinfos = async (vars, ucolumns) => {
    var sql = 'UPDATE `users_infos` set ' + ucolumns + ', `modified_dat`=CURRENT_TIMESTAMP WHERE `user_id` = ?';
    result = await query(sql, vars);
    return ({error : false, success : true, data : result});
}