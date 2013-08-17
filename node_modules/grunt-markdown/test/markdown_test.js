'use strict';

var grunt = require('grunt');
var markdown = require('../tasks/lib/markdown').init(grunt);

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports['markdown'] = {
  setUp: function(done) {
    // setup here
    done();
  },
  'helper': function(test) {
    test.expect(1);
    // tests here
    var filepath = 'test/samples/javascript.md';
    var file = grunt.file.read(filepath);
    var options = {};
    var templatepath = 'tasks/template.html';
    var template = grunt.file.read(templatepath);
    var html = markdown.markdown(file, options, template);
    test.ok(html.match(/<body>/), "should have body");
    test.done();
  }
};
