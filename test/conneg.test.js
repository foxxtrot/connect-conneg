var conneg = require('../index'),
    YUITest = YUITest || require('yuitest');

YUITest.Node.CLI.XUnit();

YUITest.TestRunner.add(new YUITest.TestCase({
    name: "Languages Tests",

    init: function() {
        this.handler = conneg.language();
    },

    "with no q-values results should be identity": function()
    {
        var req = {
            headers: {
                "Accept-Languages": "en-us, en, it"
            }
        }, expected = ['en-us', 'en', 'it'];

        this.handler(req, {});

        YUITest.ArrayAssert.itemsAreSame(req.languages, expected);
    },

    "default q-value is 1": function() {
        var req = {
            headers: {
                "Accept-Languages": 'en; q=0.6, en-us'
            }
        }, expected = ['en-us', 'en'];

        this.handler(req, {});

        YUITest.ArrayAssert.itemsAreSame(req.languages, expected);
    },

    "values are sorted correctly by q-value": function() {
        var req = {
            headers: {
                "Accept-Languages": "it; q=0.4, es; q=0.6, en-uk, en; q=0.7"
            }
        }, expected = [ 'en-uk', 'en', 'es', 'it' ];

        this.handler(req, {});

        YUITest.ArrayAssert.itemsAreSame(req.languages, expected);
    }
}));

YUITest.TestRunner.run();
