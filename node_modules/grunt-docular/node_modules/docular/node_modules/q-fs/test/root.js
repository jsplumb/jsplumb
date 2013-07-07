"use strict";

var Q = require("q");
var FS = require("../q-fs");
var Root = FS.Root;
var Mock = FS.Mock;

exports['test root mock'] = function (ASSERT, done) {

    // constructs a mock file-system API object
    var mock = Mock({
        "a/b/1": 10,
        "a/b/2": 20,
        "a/b/3": 30
    });

    // constructs a "chrooted" file-system API object
    // around the mock file-system object.
    var chroot = Root(mock, "a/b");

    // grab the file trees of both
    return Q.spread(Q.all([
        mock.listTree(),
        Q.post(chroot, "listTree")
    ]), function (mock, chroot) {

        ASSERT.deepEqual(mock, [
            ".",
            "a",
            "a/b",
            "a/b/1",
            "a/b/2",
            "a/b/3"
        ], 'listTree of mock');

        ASSERT.deepEqual(chroot, [
            ".",
            "1",
            "2",
            "3"
        ], 'listTree of "chrooted" mock');

    })
    .fin(done)
    .done()

};

if (require.main === module) {
    require("test").run(exports);
}

