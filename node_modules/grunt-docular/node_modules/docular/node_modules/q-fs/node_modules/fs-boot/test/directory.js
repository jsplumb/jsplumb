
var FS = require("fs-boot");

[
    {
        "from": "foo",
        "to": ""
    },
    {
        "from": "",
        "to": ".."
    },
    {
        "from": ".",
        "to": ".."
    },
    {
        "from": "..",
        "to": "../.."
    },
    {
        "from": "../foo",
        "to": ".."
    },
    {
        "from": "/foo/bar",
        "to": "/foo"
    },
    {
        "from": "/foo",
        "to": "/"
    },
    {
        "from": "/",
        "to": "/"
    }
].forEach(function (test) {
    exports['test ' + test.from] = function (assert) {
        assert.equal(FS.directory(test.from), test.to, 'ok');
    };
});

if (require.main == module)
    require("test").run(exports);

