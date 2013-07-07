
var Q = require("q");
var FS = require("../q-fs");

exports['test lazy list mock'] = function (ASSERT, done) {
    var fs = FS.Mock({
        "a": 1,
        "a/b": 2,
        "a/b/c": 3
    });
    var tree = fs.listTree("");
    ASSERT.ok(Q.isPromise(tree), 'tree is promise');
    var results = [".", "a", "a/b", "a/b/c"];
    fs.listTree("").forEach(function (name, i) {
        ASSERT.equal(name, results.shift(), 'tree is lazy array: ' + i);
    })
    .fin(done)
    .done()
};

exports['test lazy stat'] = function (ASSERT, done) {
    // the isFile should not throw an exception
    FS.stat(__filename)
    .isFile()
    .fin(done)
    .done()
};

if (require.main === module) {
    require("test").run(exports);
}

