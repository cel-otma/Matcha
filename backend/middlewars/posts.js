function    checktags(tags) {
    try {
        JSON.parse(tags);
    } catch (e) {
        return 1;
    }
    return (0);
}


let validationData = (req) => {
    if (req.query.minAge == undefined || /[^0-9]+/.test(req.query.minAge))
        req.query.minAge = 0;
    else
        req.query.minAge = parseInt(req.query.minAge);
    if (req.query.maxAge == undefined || /[^0-9]+/.test(req.query.maxAge))
        req.query.maxAge = 100;
    else
        req.query.maxAge = parseInt(req.query.maxAge);
    if (req.query.minLoc == undefined || /[^0-9]+/.test(req.query.minLoc))
        req.query.minLoc = 0;
    else
        req.query.minLoc = parseInt(req.query.minLoc);
    if (req.query.maxLoc == undefined || /[^0-9]+/.test(req.query.maxLoc))
        req.query.maxLoc = 12700;
    else
        req.query.maxLoc = parseInt(req.query.maxLoc);
    if (req.query.minCtags == undefined || /[^0-9]+/.test(req.query.minCtags))
        req.query.minCtags = 0;
    else
        req.query.minCtags = parseInt(req.query.minCtags);
    if (req.query.maxCtags == undefined || /[^0-9]+/.test(req.query.maxCtags))
        req.query.maxCtags = 100;
    else
        req.query.maxCtags = parseInt(req.query.maxCtags);
    if (req.query.minFameRat == undefined || /[^0-9]+/.test(req.query.minFameRat)
    || req.query.minFameRat < 0 || req.query.minFameRat > 5)
        req.query.minFameRat = 0;
    else
        req.query.minFameRat = parseInt(req.query.minFameRat);
    if (req.query.maxFameRat == undefined || /[^0-9]+/.test(req.query.maxFameRat)
    || req.query.maxFameRat < 0 || req.query.maxFameRat > 5)
        req.query.maxFameRat = 5;
    else
        req.query.maxFameRat = parseInt(req.query.maxFameRat);
    if (req.query.intereststags == undefined || checktags(req.query.intereststags))
        req.query.intereststags = '[]';
    if (req.query.sortType == undefined || req.query.sortType > 4 || req.query.sortType <= 0)
        req.query.sortType = 4;
    else
        req.query.sortType = parseInt(req.query.sortType);
}

exports.getPosts = async (req, res, next) => {
    let arr = [
        '`age`', '`fameRat` DESC', '`commontags` DESC', '`awaykm`'
    ]
    validationData(req);
    if (req.query.searchString == undefined)
        req.query.searchString = '';
    req.query.sortType = arr[req.query.sortType - 1];
    next();
}