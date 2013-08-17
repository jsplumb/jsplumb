/**
 * Provides utility methods to execute a command
 * @module exec
 */
module.exports = {

	/**
	 * Build and execute a child process using the spawn function
	 * @param {Object} grunt - the grunt context
	 * @param {String} script - the script to run
	 * @param {Array} sources - the list of sources files
	 * @param {Object} options - the list of cli flags
	 * @return {ChildProcess} from the spawn
	 */
	buildSpawned : function(grunt, script, sources, options){
		'use strict';
	
		var util = require('util'),
			isWin = process.platform === 'win32',
			cmd = (isWin) ? 'cmd' : script,
			args = (isWin) ? ['/c', script] : [],
			spawn = require('child_process').spawn;

		// Compute JSDoc options
		for (var optionName in options) {
			var option = options[optionName];
			grunt.log.debug("Reading option: " + optionName);
			args.push('--' + optionName);
			if (options.hasOwnProperty(optionName) && typeof(option) === 'string') {
				grunt.log.debug("                > " + option);
				args.push(option);
			}
		}

		if(!util.isArray(sources)){
			sources = [sources];
		}
		args.push.apply(args, sources);

		// handle paths that contain spaces
		if (isWin) {
			// Windows: quote paths that have spaces
			args = args.map(function(item){ 
				if (item.indexOf(' ')>=0) {
				    return '"' + item + '"';
                } else {
                    return item;
                }
			});
		} else {
            // Unix: escape spaces in paths
            args = args.map(function(item){
                return item.replace(' ', '\\ ');
            });
        }
		grunt.log.debug("Running : "+ cmd + " " + args.join(' '));

		return spawn(cmd, args, {
            windowsVerbatimArguments: isWin // documentation PR is pending: https://github.com/joyent/node/pull/4259
        });
	},

	/**
	 * Lookup file or path into node modules
	 * @param {Object} grunt - the grunt context
	 * @param {String} base - the file or path to lookup 
	 * @param {String|Array} extPath - additionnal pathes to lookup
	 * @returns {String} the first matching resolved path
	 */
	lookup : function(grunt, base, extPath){
		'use strict';

		var paths		= [],
			fs			= require('fs'),
			path		= require('path'),
			nodePath	= process.env.NODE_PATH || '',
			_			= grunt.util._;

		//check first the base path into the cwd
		paths.push(base);

		if(!extPath){
			extPath = [];
		} else if(typeof extPaths === 'string'){
			extPath = [extPath];
		}
		
		grunt.log.debug('nodePath' + nodePath);
		_.map(extPath.concat(nodePath.split(path.delimiter)), function(p){
			if(!/\/$/.test(p)){
				p += '/';
			}
			paths.push(p);
			paths.push(p + base);
		});

		for(var i in paths){
			grunt.log.debug('look up ' + base + ' at ' + paths[i]);
			if(fs.existsSync(paths[i]) && fs.statSync(paths[i]).isFile() === true ){
				//get the absolute path
				return path.resolve(paths[i]);
			}
		}

		return;
	}
};
