
var Q = require("q");
var FS = require("q-fs");

exports["test write/remove"] = function (assert, done) {
    var fileName = FS.join(module.directory || __dirname, "fixture.txt");

    FS.write(fileName, "1234")
    .then(function (data) {
        assert.equal(data, undefined, 'written');
        return FS.remove(fileName).then(function (data) {
            assert.equal(data, undefined, 'removed');
            return FS.isFile(fileName).then(function (isFile) {
                assert.equal(isFile, false, 'confirmed removal');
            });
       });
    })
    .fin(done)
    .end()

};

if (require.main === module)
    require("test").run(exports);

