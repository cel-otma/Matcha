const usermodel = require('../model/users');
const imagesmodel = require('../model/images');
const positionmodel = require('../model/position');
const ratmodel = require('../model/rating');
const util = require('util');
const mysql = require('mysql');
const rp = require('request-promise');
const publicIp = require('public-ip');

require('dotenv').config();

let conn = mysql.createConnection({
    'host' : process.env.DB_HOST,
    'port' : process.env.DB_PORT,
    'database' : process.env.DB_NAME,
    'user' : process.env.DB_USER,
    'password' : process.env.DB_PASSWD
});

conn.connect((err) => {
});


const query = util.promisify(conn.query).bind(conn);


let getUimg = async (userid) => {
    let dt = await imagesmodel.getImgsWhere('`user_id` = ? ORDER BY `created_dat` DESC LIMIT 1', [userid]);
    return (dt.data.length) ? dt.data[0].image_path : undefined;
}

let getUinfos = async (userid) => {
    let sql = 'SELECT `us`.`login`, `us`.`first_name`, `us`.`last_name`, ' + 
    '`ui`.`city`, `ui`.`desc`, `ui`.`birthday`, `ui`.`gendre` ' + 
    'FROM `users` AS us, `users_infos` as ui WHERE ' +
    '`us`.`user_id` = ? AND `us`.`user_id` = `ui`.`user_id` LIMIT 1';
    return await query(sql, [userid]);
}

let isCompletedProfil = async (userid) => {
    let sql = 'SELECT NULL FROM `users_infos` , `users_tags` WHERE (`users_infos`.`user_id` = ? AND `users_tags`.`user_id` = ?)';

    let data = await query(sql, [userid, userid]);
    if (!data.length)
        return 1;
    return 0;
}

let makeTagsFilterQuery = async (tags) => {
    let arr_tags = JSON.parse(tags);
    let columns = '(SELECT COUNT(*) FROM `users_tags` WHERE (`user_id` = `users`.`user_id` ';
    let sql_tags = 'SELECT `tags_id` FROM `alltags` WHERE `tag` LIKE ? LIMIT 1';
    let i = 0, flag = 0;
    while (i < arr_tags.length) {
        if (!i)
            columns += 'AND (';
        let data = await query(sql_tags, [arr_tags[i]]);
        let tags_id = (data.length) ? data[0].tags_id : 999999999;
        if (i)
            columns += ' OR ';
        columns += '(`tags_id` = ' + tags_id + ' AND `state` = 1)';
        flag = 1;
        i++;
        if (i == arr_tags.length)
            columns += ')';
    }
    columns += ')) AS `interstags`';
    return columns;
}

let filterbyString = (searchString) => {
    searchString = searchString.trim();
    searchString = searchString.replace(/[\']+/, ' ');
    let arrString = searchString.split(/[\s]+/);
    if (!arrString.length)
        return '';
    let condition = 'AND (';
    let i = 0;
    while (arrString.length > i) {
        if (i)
            condition += ' OR ';
        condition += '(`users`.`login` LIKE \'%' + arrString[i] + '%\') OR ' + 
'(`users`.`first_name` LIKE \'%' + arrString[i] + '%\') OR ' +
'(`users`.`last_name` LIKE \'%' + arrString[i] + '%\') OR ' +
'(`users_infos`.`desc` LIKE \'%' + arrString[i] + '%\') ';
        i++;
    }
    condition += ') ';
    return condition;
}

let sendposition = async (userid) => {
    let clientip = await publicIp.v4();

    let data = await rp.get({
        uri : "http://www.geoplugin.net/json.gp?ip=" + clientip,
        json : true
    }).then(async (result) => {
        await require('../model/position').
        setposition(userid, result.geoplugin_latitude, result.geoplugin_longitude);
    });
}

exports.getPosts = async (req, res) => {
    let {minAge, maxAge, minLoc,
maxLoc, minCtags, maxCtags,
minFameRat, maxFameRat, sortType, intereststags, limit, searchString
    } = req.query;
    
    if (await isCompletedProfil(req.jwt.user_id))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'You\'ve to complete your infos before visiting this page'
        });
    let data = await positionmodel.getposition(req.jwt.user_id);
    if (!data.length)
        await sendposition(req.jwt.user_id);
    data = await positionmodel.getposition(req.jwt.user_id);
    let userlat = data[0].latitude, userlong = data[0].longitude;
    if (limit == undefined || /[^0-9]+/.test(limit))
        limit = 0;
    let query_filter =
    '`age` >= ' + minAge + ' AND `age` <= ' + maxAge + ' AND ' +
    '`awaykm` >= '  + minLoc + ' AND `awaykm` <= ' + maxLoc + ' AND ' +
    '`commontags` >= ' + minCtags + ' AND `commontags` <= ' + maxCtags + ' AND ' +
    '`fameRat` >= ' + minFameRat + ' AND `fameRat` <= ' + maxFameRat + ' ';
    let interstags_query = await makeTagsFilterQuery(intereststags);
    let sql = 
'SELECT `users`.`user_id`, ' +
'(6371 * (2 * atan2(sqrt((POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`latitude`)) / 2), 2) ' +
'+ (COS(RADIANS(?)) * COS(RADIANS(`gps_position`.`latitude`)) ' +
'* POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`longitude`)) / 2), 2)))), ' +
' sqrt(1 - (POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`latitude`)) / 2), 2) ' +
' + (COS(RADIANS(?)) * COS(RADIANS(`gps_position`.`latitude`)) ' +
' * POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`longitude`)) / 2), 2)))))) ' +
' ) AS awaykm, ' +
interstags_query + ', ' + 
'(select (count(`rating`.`rat_id`)) from `rating` WHERE `users`.`user_id` = `to_uid`) as `totalRat`,' + 
'(select COALESCE((sum(`rat_nbr`)/count(`rat_id`)), 0) from `rating` WHERE `users`.`user_id` = `to_uid`) as `fameRat`, ' +
'(YEAR(CURDATE()) - YEAR(`users_infos`.`birthday`)) as `age` ' +
',' +
'(SELECT COUNT(*) FROM `users_tags` as `ut_a` WHERE (`user_id` = ? AND `state` = 1) ' +
'AND EXISTS (SELECT NULL FROM `users_tags` ' +
'WHERE (`user_id` = `users`.`user_id` ' + 
'AND `tags_id` = `ut_a`.`tags_id` AND `state` = 1))) as `commontags`' +
'FROM `users`, `gps_position`, `users_infos` ' + 
'WHERE NOT EXISTS ' +
'(SELECT *  FROM `blocks` WHERE (`user_id` = ? AND `to_id` = `users`.`user_id`) LIMIT 1) ' +
'AND `users`.`user_id` != ? ' +
'AND EXISTS (SELECT * FROM `users_infos` WHERE `user_id` = `users`.`user_id`) ' +
'AND EXISTS (SELECT * FROM `gps_position` WHERE `user_id` = `users`.`user_id` LIMIT 1) ' +
'AND `users`.`user_id` = `gps_position`.`user_id` ' +
'AND `users`.`user_id` = `users_infos`.`user_id` ' +
filterbyString(searchString) + 
'GROUP BY ' +
    '`user_id`, ' +
    '`awaykm`, '+
    '`age` ,' +
    '`fameRat` ,' +
    '`interstags`' +
'HAVING ' + query_filter + 'AND `interstags` >= ' + JSON.parse(intereststags).length +
' ORDER BY ' + sortType + ' LIMIT ' + limit + ', 20';

    let All_users = 
    'SELECT `users`.`user_id`, ' +
'(6371 * (2 * atan2(sqrt((POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`latitude`)) / 2), 2) ' +
'+ (COS(RADIANS(?)) * COS(RADIANS(`gps_position`.`latitude`)) ' +
'* POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`longitude`)) / 2), 2)))), ' +
' sqrt(1 - (POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`latitude`)) / 2), 2) ' +
' + (COS(RADIANS(?)) * COS(RADIANS(`gps_position`.`latitude`)) ' +
' * POW(SIN((RADIANS(?) - RADIANS(`gps_position`.`longitude`)) / 2), 2)))))) ' +
' ) AS awaykm, ' +
interstags_query + ', ' + 
'(select (count(`rating`.`rat_id`)) from `rating` WHERE `users`.`user_id` = `to_uid`) as `totalRat`,' + 
'(select COALESCE((sum(`rat_nbr`)/count(`rat_id`)), 0) from `rating` WHERE `users`.`user_id` = `to_uid`) as `fameRat`, ' +
'(YEAR(CURDATE()) - YEAR(`users_infos`.`birthday`)) as `age` ' +
',' +
'(SELECT COUNT(*) FROM `users_tags` as `ut_a` WHERE (`user_id` = ? AND `state` = 1) ' +
'AND EXISTS (SELECT NULL FROM `users_tags` ' +
'WHERE (`user_id` = `users`.`user_id` ' + 
'AND `tags_id` = `ut_a`.`tags_id` AND `state` = 1))) as `commontags`' +
'FROM `users`, `gps_position`, `users_infos` ' + 
'WHERE NOT EXISTS ' +
'(SELECT *  FROM `blocks` WHERE (`user_id` = ? AND `to_id` = `users`.`user_id`) LIMIT 1) ' +
'AND `users`.`user_id` != ? ' +
'AND EXISTS (SELECT * FROM `users_infos` WHERE `user_id` = `users`.`user_id`) ' +
'AND EXISTS (SELECT * FROM `gps_position` WHERE `user_id` = `users`.`user_id` LIMIT 1) ' +
'AND `users`.`user_id` = `gps_position`.`user_id` ' +
'AND `users`.`user_id` = `users_infos`.`user_id` ' +
filterbyString(searchString) +
'GROUP BY ' +
    '`user_id`, ' +
    '`awaykm`, '+
    '`age` ,' +
    '`fameRat` ,' +
    '`interstags`' +
'HAVING ' + query_filter + 'AND `interstags` >= ' + JSON.parse(intereststags).length +
' ORDER BY ' + sortType ;
    let values = [userlat, userlat, userlong, userlat, userlat, userlong,
    req.jwt.user_id, req.jwt.user_id, req.jwt.user_id];
    data = await query(sql, values);
    let Alldata = await query(All_users, values);
    let sexpref = await
    query('SELECT `sex_pref` FROM `users_infos` WHERE `user_id` = ? LIMIT 1', [req.jwt.user_id]);
    sexpref = sexpref[0].sex_pref;
    let i = 0;
    while (i < data.length) {
        data[i].infos = await getUinfos(data[i].user_id);
        data[i].image = await getUimg(data[i].user_id);
        data[i].intersting = (sexpref == 'both') ? 1 :
        ((sexpref == data[i].infos[0].gendre) ? 1 : 0); 
        i++;
    }
    return res.status(200).json({
        error : false,
        success : true,
        data : data,
        length : Alldata.length
    });
}