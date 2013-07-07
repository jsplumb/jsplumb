// Nodeunit-based Functionality Tests
// tests require an active internet connection
var childProcess = require('child_process')
var fs = require('fs')
var path = require('path')

fs.existsSync = fs.existsSync || path.existsSync

var binPath = require('../lib/phantomjs').path

module.exports = {
  testDownload: function(test) {
    test.expect(1)

    var value = fs.existsSync(binPath)

    test.ok(value, 'should download and extract proper binary')

    test.done()
  },
  testExecFile: function(test) {
    test.expect(1)

    var childArgs = [
      path.join(__dirname, 'loadspeed.js'),
      'http://www.google.com/'
    ]

    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
      var value = (stdout.indexOf('msec') !== -1)

      test.ok(value, 'should execute and return time to load page')

      test.done()
    })
  }
}