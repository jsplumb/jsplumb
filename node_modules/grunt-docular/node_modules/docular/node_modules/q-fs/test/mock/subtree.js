"use strict";

var Q = require("q");
var FS = require("../../q-fs");
var Root = require("../../q-fs").Root;
var Mock = require("../../q-fs").Mock;
var ASSERT = require("assert");

exports['test mock'] = function (ASSERT, done) {

    // constructs a mock file-system API object
    var mock = Mock({
        "a/b/1": 10,
        "a/b/2": 20,
        "a/b/3": 30,
        "a/b/c": Mock({
            "d/e/f": "abcdef",
            "1/2/3": "abc123"
        }).getNode()
    });

    mock.listTree("").then(function (list) {
        ASSERT.deepEqual(list.sort(), [
            ".",
            "a",
            "a/b",
            "a/b/1",
            "a/b/2",
            "a/b/3",
            "a/b/c",
            "a/b/c/d",
            "a/b/c/d/e",
            "a/b/c/d/e/f",
            "a/b/c/1",
            "a/b/c/1/2",
            "a/b/c/1/2/3"
        ].sort(), "subtree list");
    })
    .fin(done)
    .done()

};

if (require.main === module) {
    require("test").run(exports);
}

