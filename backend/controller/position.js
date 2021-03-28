const posmodel = require('../model/position');

exports.setposition = async (req, res) => {
    // The latitude must be a number between -90 and 90 and the longitude between -180 and 180.
    const {lat, lon} = req.body;

    await posmodel.setposition(req.jwt.user_id, lat, lon);
    return res.status(200).json({
        error : false,
        success : true
    });
}

exports.getposition = async (req, res) => {
    let {login} = req.query;

    if (login == undefined || /[^a-zA-Z0-9]+/.test(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'invalid login'
        });    
    let data = await require('../model/users').
    getUsersWhere('`login` LIKE ? LIMIT 1', '`user_id`', [login]);
    if (!data.data.length)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inenxistent login'
        });
    data = await posmodel.getposition(data.data[0].user_id);
    return res.status(200).json({
        error : false,
        success : true,
        data : data
    });
}

exports.delposition = async (req, res) => {
    await posmodel.delposition(req.jwt.user_id);
    return res.status(200).json({
        error : false,
        success : true
    });
}