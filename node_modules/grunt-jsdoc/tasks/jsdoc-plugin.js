/**
 * @fileoverview This task helps you to run jsdoc3 to generate doc in your Grunt build sequence
 * @copyright Bertrand Chevrier 2012
 * @author Bertrand Chevrier <chevrier.bertrand@gmail.com>
 * @license MIT
 *
 * @module tasks/jsdoc-plugin
 */

/**
 * Register the jsdoc task and helpers to Grunt
 * @type GruntTask
 * @constructor
 * @param {Object} grunt - the grunt context
 */
module.exports = function jsDocTask(grunt) {
	'use strict';

	var util = require('util'),
			errorCode = {
			generic : 1,
			task	: 3
		};

	/**
	 * Register the jsdoc task to Grunt
	 */
	function registerJsdocTask() {
		var fs				= require('fs'),
			path			= require('path'),
			exec			= require('./lib/exec'),
			options			= grunt.task.current.options({'private': true}),
			done			= grunt.task.current.async(),
			srcs			= grunt.task.current.filesSrc,
			javaHome		= process.env.JAVA_HOME,
			jsDocPath		= grunt.task.current.data.jsdoc,
			jsDocNpmPath	= 'node_modules/jsdoc/jsdoc',
			timeout			= 60000,	//todo implement and move in options
			cliFlags = ['recurse', 'private', 'lenient', 'explain', 'help', 'version', 'test', 'verbose', 'nocolor', 'template', 'configure', 'destination', 'encoding', 'tutorials'],
			jsDoc;

		//validate options
		
		if (!options.destination) {
			// Support for old syntax where destination was provided through 'dest' key
			options.destination = grunt.task.current.files[0].dest || 'doc';
		}

		//legacy configs
		if(options.config){
			options.configure = options.config;
		}

		// Compute JSDoc flags from options
		for(var optionName in options){
			var option = options[optionName];
			if(!grunt.util._.contains(cliFlags, optionName) || !option){
				delete options[optionName];
			}
		}

		grunt.log.debug(util.inspect(options));


		if(jsDocPath && grunt.file.exists(jsDocPath) && grunt.file.isFile(jsDocPath)){
			//use the given jsdoc path if set
			jsDoc = jsDocPath;
		} else {
			//lookup jsdoc
			jsDoc = exec.lookup(grunt, jsDocNpmPath, ['node_modules/grunt-jsdoc/']);
		}

        // convert jsdoc path to relative path
        jsDoc = path.relative('.', jsDoc);//, path.resolve('.'));

		//check if java is set
		if(!javaHome){
			grunt.log.error("JAVA_HOME is not set. Jsdoc requires Java to run.");
		} else {
			grunt.log.debug("JAVA_HOME : " + javaHome);
		}

		//check if jsdoc npm module is installedz
		if(jsDoc === undefined){
			grunt.log.error('Unable to locate jsdoc');
			grunt.fail.warn('Wrong installation/environnement', errorCode.generic);
		} else {
			grunt.log.debug("jsdoc found at : " + jsDoc);
		}

		//check if there is sources to generate the doc for
		if(srcs.length === 0){
			grunt.log.error('No source files defined');
			grunt.fail.warn('Wrong configuration', errorCode.generic);
		}

		//check if jsdoc config file path is provided and does exist
		if (options.configure && !fs.existsSync(options.configure)){
			grunt.log.error('jsdoc config file path does not exist');
			grunt.fail.warn('Wrong configuration', errorCode.generic);
		}
		
		fs.exists(options.destination, function(exists){
			//if the destination don't exists, we create it
			if(!exists){
				grunt.file.mkdir(options.destination);
				grunt.log.debug('create destination : ' + options.destination);
			}

			//execution of the jsdoc command
			var child = exec.buildSpawned(grunt, jsDoc, srcs, options);
			child.stdout.on('data', function (data) {
				grunt.log.debug('jsdoc output : ' + data);
			});
			child.stderr.on('data', function (data) {
				grunt.log.error('An error occurs in jsdoc process:\n' + data);
				grunt.fail.warn('jsdoc failure', errorCode.task);
			});
			child.on('exit', function(code){
				if(code === 0){
					grunt.log.write('Documentation generated to ' + path.resolve(options.destination));
					done(true);
				} else {
					grunt.log.error('jsdoc terminated');
					grunt.fail.warn('jsdoc failure', errorCode.task);
				}
			});
		});
	}

	//bind the task to the grunt context
	grunt.registerMultiTask('jsdoc', 'Generates source documentation using jsdoc', registerJsdocTask);
};
