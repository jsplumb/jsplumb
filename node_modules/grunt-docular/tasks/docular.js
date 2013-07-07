"use strict";

/*
 * grunt-docular
 * Copyright (c) 2013 John Martin
 * Licensed under the MIT license.
 */
var colors = require('colors');

module.exports = function(grunt) {

    var sys = require('sys');
    var exec = require('child_process').exec;

    // ==========================================================================
    // TASKS : That can be used and configured in the intiConfigs
    // ==========================================================================

    /**
    * The main docular task
    * @return {[type]}
    */
    grunt.registerTask('docular', 'Configurable setup to generate AngularJS and other class based documentation.', function() {

        var docular = require('docular');
        var options = grunt.config('docular');

        //Run the gen-docs script
        var process_gen_docs_done = this.async();
        docular.genDocs(options, function(){

            //make good on the async promise
            process_gen_docs_done();
        });

    });


    /**
     * Launch a simple nodeJS web server for documentation
     * @param  {[type]} ) {}          [description]
     * @return {[type]}   [description]
     */
    grunt.registerTask('docular-server', 'Start a simple NodeJS server so you can view the documentation.', function() {

        var port = 8000;

        var docular = require('docular');

        //Notify the user
        console.log("");
        console.log("Documentation server running at ".yellow + ('http://127.0.0.1:' + port + '/').green);

        //Grab a new async promise
        var process_server_done = this.async();
        docular.server(port, function(){
            process_server_done();
        });

    });

};