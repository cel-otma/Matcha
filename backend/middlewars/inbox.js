exports.postmsg = async (req, res, next) => {
    if (req.body.msg == undefined || req.body.login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'missing request data'
        });
    req.body.msg = req.body.msg.trim();
    if (req.body.msg == '')
        return res.status(200).json({
            error : true,
            success : false,
            message : 'you can\'t send empty message'
        });
    if (/[^\w]+/.test(req.body.login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexsitent login ' + req.body.login
        });
    next();
}

exports.usersinbox = (req, res, next) => {
    next();
}

exports.getMessages = async (req, res, next) => {
    const {user_id} = req.query;

    if (user_id == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'must assign a userid'
        });
    next();
}



