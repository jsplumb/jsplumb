"use strict";

var Q = require("q");
var FS = require("../../q-fs");
var Root = require("../../q-fs").Root;
var Mock = require("../../q-fs").Mock;
var ASSERT = require("assert");

exports['test merge'] = function (ASSERT, done) {

    var input = {
        "a": 10,
        "b": 20
    };
    var output = Mock(input).toObject();
    Q.when(output, function (output) {
        ASSERT.deepEqual(output, input, 'toObject');
    })
    .fin(done)
    .done()

};

if (require.main === module) {
    require("test").run(exports);
}


