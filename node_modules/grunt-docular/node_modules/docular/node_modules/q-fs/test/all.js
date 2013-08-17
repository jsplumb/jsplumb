'use strict'

exports['test mock/merge'] = require('./mock/merge');
exports['test mock/read'] = require('./mock/read');
exports['test mock/subtree'] = require('./mock/subtree');
exports['test root mock'] = require('./root');
exports['test partial'] = require("./partial");

if (module == require.main)
    require('test').run(exports)

