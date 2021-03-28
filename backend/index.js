const express = require('express');
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');
// const fileupload = require('express-fileupload');
const http = require('http');
const app = express();
require('dotenv').config();
var cors = require('cors')

app.use(cors());
// app.use(fileupload());
app.use(cookieparser());
app.use(express.static(__dirname + '/public'));

app.use(bodyparser.json({limit: '10mb', extended: true}));

app.use(bodyparser.urlencoded({limit: '10mb', extended: true}));

app.use('/users', require('./router/users'));

app.use('/infos', require('./router/uinfos'));

app.use('/confirm', require('./router/confirm'));

app.use('/tags', require('./router/tags'));

app.use('/images', require('./router/images'));

app.use('/posts', require('./router/posts'));

app.use('/follow', require('./router/follow'));

app.use('/auth', require('./router/auth'));

app.use('/notifications', require('./router/notifications'));

app.use('/inbox', require('./router/inbox'));

app.use('/report', require('./router/report'));

app.use('/blocks', require('./router/blocks'));

app.use('/history', require('./router/history'));

app.use('/rating', require('./router/rating'));

app.use('/position', require('./router/position'));

app.all("/*", (req, res) => {
    res.send("Intercepting requests ..\n");
})

const Server = http.createServer(app);

const io = require('socket.io');
const { updatentfs } = require('./model/notifications');

const socketio = io(Server,  {
    cors: {
        origin : `http://${process.env.FRONT_HOST}:${process.env.FRONT_PORT}`
    }
});

socketio.on('connection', (socket) => {

    socket.on('Authorization', async (auth) => {
        if (auth != undefined || auth != null) {
            require('jsonwebtoken').verify(auth, process.env.TOKEN_SECRET, async (err, data) => {
                if (!err) {
                    let result = await
require('./model/users').getUsersWhere('(`user_id` = ? AND `login` = ? AND `first_name` = ? AND `last_name` = ? AND `email` = ?)', '`user_id`',
                    [data.user_id, data.login, data.first_name, data.last_name, data.email]);
                    if (result.data.length) {
                        socket.user_id = data.user_id;
                        await require('./model/status').setstatus(1, data.user_id);
                    }
                }
            });
        }
    });

    socket.on('upntfs', (msg) => {
        socket.broadcast.emit('upntfs', '');
        socket.broadcast.emit('upAll', '');
    });

    socket.on('msg', (msg) => {
        socket.broadcast.emit('updateMsg', '');
    })

    socket.on('disconnect', async (kk) => {
        if (socket.user_id) {
            await require('./model/status').setstatus(2, socket.user_id);
        }
    })
})

Server.listen(process.env.SERVER_PORT)
