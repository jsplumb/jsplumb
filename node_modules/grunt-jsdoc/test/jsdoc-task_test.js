/**
 * @fileoverview NodeUnit test 
 * @copyright Bertrand Chevrier 2012
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 * 
 * @module test/jsdoc-task_test
 */

var fs = require('fs');
var destination = 'doc';
var expectedFiles = ['index.html', 'jsdoc-plugin.html', 'jsdoc-plugin.js.html'];

/**
 * NodeUnit group of test that check the result once the task has been launched
 * 
 * @see https://github.com/caolan/nodeunit/
 * 
 * @class JsdocTaskTest
 */
exports.JsdocTaskTest = {
	
	/**
	 * Check the destination directory exists
	 * @memberOf JsdociTaskTest
	 * @param {Object} test - the node unit test context
	 */
	'destination check' : function(test){
		'use strict';	

        test.expect(1);

        fs.exists(destination, function(result){
            test.ok(result === true, 'The documentation destination should exists');
            test.done();
        });
	}, 
    
    /**
     * Check the documentation content
	 * @memberOf JsdociTaskTest
	 * @param {Object} test - the node unit test context
	 */
    'content check' : function(test){
        
        var base = destination + '/';
        
        test.expect(expectedFiles.length);
        
        expectedFiles.forEach(function(file){
            test.ok(fs.existsSync(base + file), 'The file ' + base + file + ' should exists');
        });
        test.done();
    }

};
