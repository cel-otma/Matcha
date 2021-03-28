

function loginisValide(login) {
    if (/[^a-zA-Z0-9]+/.test(login))
        return (1);
    if (login.length < 4)
        return (2);
    return (0);
}

exports.postFollow = async (req, res, next) => {
    const {to_login} = req.body;

    if (to_login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request !!'
        });
    if (loginisValide(to_login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    next();
}

exports.getAllFollowers = async (req, res, next) => {
    const {login} = req.query;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request !!'
        });
    if (loginisValide(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    next();
}

exports.getFollowersWhere = async (req, res, next) => {
    const {to_login} = req.query;

    if (to_login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request !!'
        });
    if (loginisValide(to_login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    next();
}

exports.getFollowing = async (req, res, next) => {
    const {login} = req.query;

    if (login == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request !!'
        });
    if (loginisValide(login))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'inexistent user'
        });
    next();
}