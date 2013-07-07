
var Q = require('qq');

exports['test Lazy'] = function (ASSERT, done) {
    var inputs = [1,2,3];
    var proxy = Q.Lazy(Array, Q.delay(1, inputs));
    var results = [];
    var ready = proxy.forEach(function (n) {
        results.push(n);
    });
    Q.when(ready, function () {
        ASSERT.deepEqual(results, inputs, 'forEach on Lazied Array');
    }).then(done, function () {
        ASSERT.ok(false);
        done();
    });;
};

if (module == require.main)
    require('test').run(exports)

