const { captureRejectionSymbol } = require("nodemailer/lib/mailer");

exports.insert_img = async (req, res, next) => {
    if (req.body.img == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request'
        });
    req.body.data = req.body.img.split(';')[1];
    req.body.type = req.body.img.split(';')[0].split(':')[1];
    let type = req.body.type.split('/');
    if (type[0] != 'image' || !/^(bmp|jpeg|jpg|gif|png|eps)$/.test(type[1]))
        return res.status(200).json({
            error : true,
            success : false,
            message : 'unsupported type of file you\'re sending'
        });
    next();
}

exports.delete_img = async (req, res, next) => {
    if (req.body.name == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'incomplete request'
        });
    next();
}