const mysql = require('mysql');
require('dotenv').config();

exports.connect = async (req, res, next) => {
    const conn = mysql.createConnection({
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASSWD,
        database : process.env.DB_NAME
    });

    conn.connect((err) => {
        if (err)
            return res.status(200).json({
                error : true,
                success : false,
                message : 'Something going wrong while connecting to db ' + err
            });
        next();
    });
    return ;
}