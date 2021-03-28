function loginisValide(login) {
    if (/[^a-zA-Z0-9]+/.test(login))
        return (1);
    if (login.length < 4)
        return (1);
    return (0);
}

function KeyIsValide(key) {
    if (!/[A-Za-z0-9]+/.test(key)) {
        return (1);
    }
    return (0);
}

exports.confirm = async (req, res, next) => {
    const {login, key} = req.query;

    if (login == undefined || key == undefined)
        return (res.status(200).json({
            success : false,
            error : true,
            message : 'missing vars'
        }));
    if (KeyIsValide(key))
        return (res.status(200).json({
            success : false,
            error : true,
            message : 'Key is invalid'
        }));
    if (loginisValide(login))
        return (res.status(200).json({
            success : false,
            error : true,
            message : 'login is invalid'
        }));
    next();
}