exports.setposition = async (req, res, next) => {
    // The latitude must be a number between -90 and 90 and the longitude between -180 and 180.
    const {lat, lon} = req.body;

    if (lat == undefined || lon == undefined)
        return res.status(200).json({
                error : true, 
                success : false,
                message : 'missing data'
        });
    if (/[^0-9\-\.]+/.test(lat) || /[^0-9\-\.]+/.test(lon))
        return res.status(200).json({
            error : true, 
            success : false,
            message : 'latitude and longitude must be a numbers'
        });
    if (lat > 90 || lat < -90)
        return res.status(200).json({
            error : true, 
            success : false,
            message : 'latitude must be a number between 90 and -90.'
        });
    if (lon > 180 || lon < -180)
        return res.status(200).json({
            error : true, 
            success : false,
            message : 'longitude must be a number between 180 and -180.'
        });
    next();
}