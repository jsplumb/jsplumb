// Copyright 2013 The Obvious Corporation.

/**
 * @fileoverview Helpers made available via require('phantomjs') once package is
 * installed.
 */

var path = require('path')


/**
 * Where the phantom binary can be found.
 * @type {string}
 */
exports.path = process.platform === 'win32' ?
    path.join(__dirname, 'phantom', 'phantomjs.exe') :
    path.join(__dirname, 'phantom', 'bin' ,'phantomjs')


/**
 * The version of phantomjs installed by this package.
 * @type {number}
 */
exports.version = '1.9.1'
