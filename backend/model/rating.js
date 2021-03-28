const mysql = require('mysql');
const util = require('util');
const { closeSync } = require('fs');
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

exports.postrating = async (to_id, from_id, rat) => {
    let sql = 'INSERT INTO `rating` (`from_uid`, `to_uid`, `rat_nbr`) VALUES ?';

    await query(sql, [[[from_id, to_id, parseInt(rat)]]]);
    return true;
}


exports.calc_rating = async (to_id) => {
    let sql = 'select (SUM(`rat_nbr`) / COUNT(*)) AS rating FROM `rating` WHERE `to_uid` = ?';

    let data = await query(sql, [to_id]);
    return data;
}


exports.get_rating = async (where, columns, vars) => {
    let sql = 'select ' + columns + ' FROM `rating` WHERE ' + where;

    let data = await query(sql, vars);
    return data;
}


exports.delrating = async (rating_id) => {
    let sql = 'DELETE FROM `rating` where `rat_id` = ?';

    await query(sql, [rating_id]);
    return true;
}

exports.uprating = async (columns, where, vars) => {
    let sql = 'UPDATE `rating` set ' + columns  + ', `modified_dat`=CURRENT_TIMESTAMP where ' + where;

    await query(sql, vars);
    return true;
}