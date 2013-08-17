
var Q = require('qq');

[
    ['undefined', function () {}],
    ['null', function () {return null}],
    ['number', function () {return 0}],
    ['boolean', function () {return false}],
    ['date', function () {return new Date()}],
].forEach(function (pair) {
    exports['test ' + pair[0]] = function (ASSERT, done) {
        var value1 = pair[1]();
        Q.when(Q.deep(value1), function (value2) {
            ASSERT.strictEqual(value1, value2, 'shallow ' + pair[0]);
            done();
        }, function (reason) {
            ASSERT.ok(false, reason);
            done();
        });
    }
});

exports['test deep'] = function (ASSERT, done) {
    var before = [{"a": Q.ref(10)}, Q.ref(20)];
    Q.when(Q.deep(before), function (after) {
        ASSERT.ok(before === after, 'array modified in place');
        ASSERT.ok(before[0] === after[0], 'object modified in place');
        ASSERT.deepEqual(after, [{"a": 10}, 20], 'deeply equal afterward');
    }).then(done, done);
};

if (module == require.main)
    require('test').run(exports)

