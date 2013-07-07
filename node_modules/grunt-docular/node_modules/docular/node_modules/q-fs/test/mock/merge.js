"use strict";

var Q = require("q");
var FS = require("../../q-fs");
var Root = require("../../q-fs").Root;
var Mock = require("../../q-fs").Mock;
var ASSERT = require("assert");

exports['test merge'] = function (ASSERT, done) {

    var merged = FS.merge([
        Mock({
            "a": 10,
            "b": 20,
            "1/2/3": "123"
        }),
        Mock({
            "a": 20,
            "c": 30
        }),
        Mock({
            "a": 30,
            "d": 40
        }),
    ])

    Q.when(merged, function (merged) {
        return Q.when(merged.listTree(), function (list) {
            ASSERT.deepEqual(list.sort(), [
                ".", "a", "b", "c", "d", "1", "1/2", "1/2/3"
            ].sort(), 'listTree');
        }).then(function () {
            return Q.when(merged.read("a", "rb"), function (a) {
                ASSERT.deepEqual(a, 30, 'read overridden');
            });
        }).then(function () {
            return Q.when(merged.read("b", "rb"), function (a) {
                ASSERT.deepEqual(a, 20, 'read non-overridden');
            });
        });
    })
    .fin(done)
    .done()

};

if (require.main === module) {
    require("test").run(exports);
}


