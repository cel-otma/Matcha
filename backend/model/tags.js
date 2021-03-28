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

exports.Insert_inexistenttags = async (tags) => {
    var i = 0;
    var sql_select = 'SELECT * from `alltags` WHERE `tag` LIKE ?';
    var sql_insert = 'INSERT INTO `alltags` (`tag`) VALUES ?';

    while (i < tags.length) {
        let res = await query(sql_select, [tags[i]]);
        if (!res.length)
            await query(sql_insert, [[[tags[i]]]]);
        i++;
    }
    return (true);
}
exports.linktags = async (tags, userid) =>  {
    var sql_select = 'SELECT `tags_id` FROM `alltags` WHERE `tag` LIKE ?';
    var sql_select2 = 'SELECT * FROM `users_tags` WHERE (`user_id` = ? AND `tags_id` = ?)';
    var sql_insert = 'INSERT INTO `users_tags` (`user_id`, `tags_id`, `state`) VALUES ?';
    let update_stm = 'UPDATE `users_tags` set `state`=1, `modified_dat`=CURRENT_TIMESTAMP WHERE (`utags_id` = ?)';

    var i = 0;
    await query('UPDATE `users_tags` set `state`=2 WHERE `user_id` = ?', [userid]);
    while (i < tags.length) {
        let res = await query(sql_select, tags[i]);
        let res2 = await query(sql_select2, [userid, res[0].tags_id]);
        if (!res2.length) {
            await query(sql_insert, [[[userid, res[0].tags_id, 1]]]);
        }else {
            await query(update_stm, [res2[0].utags_id]);
        }
        i++;
    }
    return (true);
}
// var sql = 'select * from `users_tags`, `alltags` WHERE (`users_tags`.`user_id` = 2 AND `alltags`.`tags_id` = `users_tags`.`tags_id`);';

exports.gettags_where = async (where, columns, vars) => {
    var sql = 'SELECT ' + columns + ' FROM `users_tags`, `alltags` WHERE ' + where;

    let data = await query(sql, vars);
    return ({'success' : true, 'error' : false, 'data' : data});
}