qStringRegex = /^\s*q=([01](?:\.\d+))\s*$/;

function parseQString(qString) {
    var d = qStringRegex.exec(qString);
    if (!d) {
        return 1;
    }
    return Number(d[1]);
}

function sortQArrayString(content) {
    var entries = content.split(','),
        sortData = [];
    entries.forEach(function(rec) {
                var s = rec.split(';');
                sortData.push({
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
                return rec.key.trim();
            });
}

function buildScanner(header, property) {
    return function(req, res, next) {
        if (req) {
            var data = req.headers[header];
            if (data) {
                req[property] = sortQArrayString(data);
            }
        }
        if (next) next();
    };
}

module.exports = {
    language: buildScanner('accept-language', 'languages'),
    acceptedTypes: buildScanner('accept', 'acceptableTypes'),
    charsets: buildScanner('accept-charset', 'charsets'),
    custom: buildScanner
}
