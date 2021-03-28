const mysql = require('mysql');
const util = require('util');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
dotenv.config();

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

exports.getAllUsers = async (columns) => {
    var sql = 'SELECT ' + columns + ' FROM `users`';
    var data = await query(sql);
    return ({'success' : true, 'error' : false, 'data' : data});
}

exports.getUsersWhere = async (Where, columns, vars) => {
    var sql = 'SELECT ' + columns + ' FROM `users` WHERE ' + Where;
    var data = await query(sql, vars);
    return ({'success' : true, 'error' : false, 'data' : data});
}

exports.InsertUsers = async (Data) => {
    var Value = [
        [Data.fname, Data.lname, Data.login, Data.email, bcrypt.hashSync(Data.passwd, 10)]
    ];

    var sql = 'INSERT INTO `users` (`first_name`, `last_name`, `login`, `email`, `passwd`) VALUES ?';
    result = await query(sql, [Value]);
    var sql = 'SELECT `user_id` FROM `users` WHERE `login` LIKE ? LIMIT 1';
    result = await query(sql, [Data.login]);
    return ({'success' : true, 'error' : false, 'data' : result});
}

exports.updateAccount = async (columns, vars) => {
    let sql = 'UPDATE `users` SET ' + columns + ', `modified_dat`=CURRENT_TIMESTAMP WHERE `user_id` = ?';
    await query(sql, vars);
    return (true);
}