
exports['test deep'] = require('./deep');
exports['test lazy'] = require('./lazy');

if (module == require.main)
    require('test').run(exports)

