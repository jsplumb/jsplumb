
var FS = require("../q-fs");

module.exports = function (ASSERT, done) {

    var name = FS.join(
        module.directory || __dirname,
        "fixtures", "1234.txt"
    );
    FS.open(name, {
        begin: 1,
        end: 3
    })
    .invoke('read')
    .then(function (content) {
        ASSERT.equal(content, "23", "partial read");
    })
    .fin(done)
    .done()

};

if (module == require.main)
    require('test').run(module.exports)

