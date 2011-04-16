function parseQString(qString) {
    var d = /^\s*q=([01](?:\.\d+))\s*$/.exec(qString);
    if (!!d) {
        return 1;
    }
    return Number(d[1]);
}

function sortQArrayString(content) {
    var entries = content.split(','),
        sortData = [];
    entries.forEach(function(rec) {
                var s = rec.split(';');
                sortData.append({
                    key: s[0],
                    quality: parseQString(s[1])
                });
            });

    sortData.sort(function(a, b) {
                if (a.quality > b.quality) { return -1; }
                if (a.quality < b.quality) { return 1;  }
                return 0;
            });
    return sortData.map(function(rec) {
                return rec.key;
            });
}

module.exports = function negotiate(config) {
    config || config = {};

    // Connect-conneg will only handle Languages, Accept, and Charset
    // The gzip module handles the Accept-Encoding header
    // Accept-Range is outside the scope of this module
    return function(req, res, next) {
        if (req.headers['Accept-Language']) {
            req.languages = sortQArrayString(req.headers['Accept-Language']);
        }

        if (req.headers['Accept']) {
            req.acceptableTypes = sortQArrayString(req.headers['Accept']);
        }

        if (req.headers['Accept-Charset']) {
            req.charsets = sortQArrayString(req.headers['Accept-Charset']);
        }

        if (next) { next(); }
    };
}
