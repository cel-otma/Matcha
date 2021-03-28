const mysql = require('mysql');
const randomString = require('randomstring');
const rp = require('request-promise');
const usersmodel = require('../model/users');
const usersinfosmodel = require('../model/uinfos');
const imgsmodel = require('../model/images');
const tagsmodel = require('../model/tags');
const fs = require('fs')
const publicIp = require('public-ip');

var conn = mysql.createConnection({
    'host' : process.env.DB_HOST,
    'port' : process.env.DB_PORT,
    'database' : process.env.DB_NAME,
    'user' : process.env.DB_USER,
    'password' : process.env.DB_PASSWD,
});

let cities = [
    'Khouribga',
    'Marrakech',
    'Essaouira',
    'Tan-Tan',
    'Nador',
    'Guercif',
    'Rabat',
    'Casablanca',
    'Agadir',
    'Safi',
    'Temara',
    'Mohammedia',
    'Taza',
    'Tangier',
    'Tetouan',
    'Berrechid',
    'Errachidia',
    'Sidi Kacem',
    'Taroudant',
    'Sefrou',
    'Ben Guerir',
    'Azrou',
    'Azemour',
    'Azilal',
    'El Hajeb',
    'Bouznika',
    'Aourir'
];

let tags = [
    'Sport',
    'Swimming',
    'reading',
    'crazy',
    '1337',
    'studing',
    'coding',
    'Authenticity',
    'Followback',
    'loving',
    'football',
    'basketball',
    'fighting',
    'playing',
    'games',
    'challenger',
    'monster',
    'rien',
    'Girl',
    'Boy',
    'Friend',
    'Searching'
]

let gendres = [
    1,
    2
]

let sexpref = [
    1, 2, 3
];

let positionbyip = async (userid) => {
    let clientip = await publicIp.v4();

    let data = await rp.get({
        uri : "http://www.geoplugin.net/json.gp?ip=" + clientip,
        json : true
    }).then(async (result) => {
        await require('../model/position').
        setposition(userid, result.geoplugin_latitude, result.geoplugin_longitude);
    });
}

let Changelocation = async (userid, city) => {
    await rp.get({
        uri : 'http://api.positionstack.com/v1/forward?access_key=d696007b4568b87117e5caa046366e5e&query=' + city,
        json: true
    }).then(async (result) => {
        if (result.data != undefined && result.data.length
        && result.data[0].longitude != null && result.data[0].latitude != null) {
            await require('../model/position').
            setposition(userid, result.data[0].latitude, result.data[0].longitude);
        }
        else
            await positionbyip(userid);
    }).catch((err) => {
        console.log(err);
    })
}


(async () => {
    await conn.connect(async (err) => {
        if (!err) {
            let login, dt, city, infos, utags, j, path;
            let i = 0;
            await tagsmodel.Insert_inexistenttags(tags);
            while (i <400) {
                while (1) {
                    login = randomString.generate({
                        length : 7,
                        charset : 'alphanumeric'
                    });
                    dt = await usersmodel.getUsersWhere('`login` like ? LIMIT 1', 'NULL', [login]);
                    if (!dt.data.length)
                        break ;
                }
                city = cities[Math.floor(Math.random() * cities.length)];
                result = await usersmodel.InsertUsers({
                    login : login,
                    fname : login,
                    lname : login, 
                    email : login + '@' + login + '.com',
                    passwd : login + '@Ob1337'
                });
                infos = {
                    user_id : result.data[0].user_id,
                    city : city,
                    desc : 'Hello i am from ' + city,
                    birthday : (Math.floor(2021 - (Math.random() * 50))) + '/01/01',
                    gendre : gendres[(Math.floor(Math.random() * 2))],
                    sexpref : sexpref[(Math.floor(Math.random() * 3))]
                }
                await usersinfosmodel.insert_uinfos(infos);
                j = 0;
                utags = [];
                while (j < 8) {
                    utags.push(tags[(Math.floor(Math.random() * tags.length))]);
                    j++;
                }
                await tagsmodel.linktags(utags, result.data[0].user_id);
                path = (infos.gendre == 1) ? 'women' : 'men';
                fs.readFile('./config/fakeusersimgs/' + path + '/' + (Math.floor(Math.random() * 9)) + '.jpg', async (err, data) => {
                    if (!err) {
                        let imgname = login + randomString.generate({length : 7, charset : 'alphanumeric'}) + '.jpg';
                        fs.writeFile('./public/users_imgs/' + imgname, data, async (err) => {
                            if (err) throw err;
                            else
                                await imgsmodel.insert_img(infos.user_id, imgname);
                        });
                    }
                    else
                        console.log(err);
                });
                await require('../model/status').setstatus(2, result.data[0].user_id);
                Changelocation(infos.user_id, infos.city);
                i++;
            }
        }else 
            process.exit(1);
        process.exit(0);
    });
})();