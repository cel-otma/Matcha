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

exports.insert_img = async (user_id, img_path) => {
    let sql = "INSERT INTO `users_imgs` (`user_id`, `image_path`) VALUES ?";
    await query(sql, [[[user_id, img_path]]]);
    return (true);
}

exports.getImgsWhere = async (where, vars) => {
    let sql = 'SELECT * FROM `users_imgs` WHERE ' + where;
    let data = await query(sql, vars);
    return ({'success' : true, 'error' : false, 'data' : data});
}

exports.delete_img = async (user_id, img_path) => {
    sql = 'DELETE FROM `users_imgs` WHERE (`user_id` = ? AND `image_path` = ?)';
    await query(sql, [user_id, img_path]);
    return (true);
}