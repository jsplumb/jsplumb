module.exports = function(grunt) {
	'use strict';

  // Project configuration.
  grunt.initConfig({
	clean : ['doc'],
    jsdoc : {
		dist: {
			src: ['tasks/**.js', 'tasks/lib/*.js'],
			options: {
				destination: 'doc'
			}
		},
        tmpl : {
            src: ['tasks/**.js', 'tasks/lib/*.js'],
            options:{
				destination: 'doc',
                template: "node_modules/ink-docstrap/template",
                configure: "node_modules/ink-docstrap/template/jsdoc.conf.json"
			}
        }
	},
	nodeunit : {
        unit : ['test/jsdoc-plugin_test.js'],
        int : ['test/jsdoc-task_test.js']
	},
	jshint : {
		files : ['Gruntfile.js', 'tasks/*.js', 'tasks/lib/*.js', 'test/*.js'],
		options: {
			node : true,
			smarttabs : true
		}
	}
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', ['jshint', 'nodeunit']);

  grunt.registerTask('test-dist', ['clean', 'jsdoc:dist', 'nodeunit:int']);
  grunt.registerTask('test-tmpl', ['clean', 'jsdoc:tmpl', 'nodeunit:int']);
  
  grunt.registerTask('test', ['nodeunit:unit', 'test-dist', 'test-tmpl']);
  
};
