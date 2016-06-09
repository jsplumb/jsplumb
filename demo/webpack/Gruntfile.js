module.exports = function(grunt) {

    var webpackConfig = require("./webpack.config.js");

    grunt.loadNpmTasks("grunt-webpack");

    grunt.initConfig({
        webpack: {
            options: webpackConfig,
            build: {}
        }
    });

    grunt.registerTask("build", ["webpack:build"]);
};


