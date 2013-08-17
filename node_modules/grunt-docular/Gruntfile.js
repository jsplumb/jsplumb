/*
 * grunt-docular
 * http://johndavidfive.com/docular/
 *
 * Copyright (c) 2013 John Martin
 * Licensed under the MIT, CC_by_3.0 licenses.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // We use the docular dependency and pass it the configs it needs to generate documentation
    docular: {
        baseUrl: 'http://localhost:8000',
        showAngularDocs: true, //generate and show angular documentation
        showDocularDocs: true, //generate and show the docs for Docular
        docAPIOrder : ['doc', 'angular'], //when ui resources are loaded they follow this order
        groups: []
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'docular', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'docular']);

};
