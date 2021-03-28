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

exports.getAllNotifications = async (user_id) => {
    let sql = 'select `Notifications`.*, CONVERT_TZ(`Notifications`.`created_dat`, \'+00:00\', \'+01:00\') AS `creat_dat` ,`users`.`login` from `Notifications`, `users` WHERE `Notifications`.`user_id` = ? AND `Notifications`.`from_id` = `users`.`user_id` ORDER BY `Notifications`.`created_dat` DESC';

    data = await query(sql, [user_id]);
    return (data);
}

exports.deleteNtfs = async (nts_id) => {
    let sql = 'DELETE FROM `Notifications` WHERE `nts_id` = ?';
    await query(sql, [nts_id]);
    return (true);
}

exports.getntfs_where = async (where, vars, limit) => {
    let sql = 'select * , `created_dat` AS `creat_dat`  from `Notifications` WHERE ' + where + ' ORDER BY `Notifications`.`created_dat` DESC ';
    sql += (limit >= 0) ? ('LIMIT ' + limit + ', 10') : '';
    let data = await query(sql, vars);
    return (data);
}

exports.updatentfs = async (where, columns, vars) => {
    let sql = 'update `Notifications` SET ' + columns + ', `modified_dat`=CURRENT_TIMESTAMP Where ' + where;

    await query(sql, vars);
    return (true);
}

exports.insertntfs = async (userid, fromid, msg, nts_type) => {
    let sql = 'INSERT INTO `Notifications` (`user_id`, `from_id`, `message`, `nts_type`) VALUES ?';

    await query(sql, [[[userid, fromid, msg, nts_type]]]);
    return true;
}

exports.countntfs = async (userid) => {
    let sql = 'SELECT COUNT(*) AS length FROM `Notifications` WHERE `user_id` = ?';
    return await query(sql, [userid]);
}