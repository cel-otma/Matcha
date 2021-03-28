exports.deleteNtfs = async (req, res, next) => {
    if (req.body.nts_id == undefined)
        return res.status(200).json({
            error : true,
            success : false,
            message : 'missing body !!'
        });
    next();
}