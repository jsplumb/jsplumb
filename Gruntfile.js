
var package = require('./package.json'),
    BUILD = require("./build.json"),
    get = function(name) {
        if (BUILD.includes[name].p) {
            // the new way, with libs from npm
            return BUILD.includes[name].p;
        } else {
            return "lib/" + BUILD.includes[name].f + "-" + BUILD.includes[name].v + ".js";
        }
    },
    objects = {
        common:[
            'util.js', 'browser-util.js', 'jsPlumb.js', 'dom-adapter.js', 'overlay-component.js', 'endpoint.js', 'connection.js', 'anchors.js', 'defaults.js', 'base-library-adapter.js', 'group.js'
        ]
    },
    optionList = function(grunt, type) {
        return grunt.option(type) && grunt.option(type).split(",") || [];
    },
    getOutputFilename = function(grunt, suffix) {
        var suffix2 = grunt.option('outputSuffix') ? ('.' + grunt.option("outputSuffix")) : '';
        return 'dist/js/jsplumb' + suffix2 + suffix + '.js';
    },
    filter = function(l, v, t, o) {
        if (l.length === 0 || l.indexOf(v) != -1)
            o.push("src/" + t + "-" + v + ".js");
    },
    getList = function(grunt, type) {
        var ol = optionList(grunt, type), l = BUILD[type], out = [];
        for (var i = 0; i < l.length; i++)
            filter(ol, l[i], type, out);

        return out;
    },
    getSources = function(grunt) {
        var sources =  BUILD.coreLibs.map(get);

        sources.push.apply(sources, BUILD.browserLibs.map(get));

        sources.push.apply(sources, objects.common.map(function(v) { return "src/" + v; }));
        sources.push.apply(sources, getList(grunt, "connectors"));
        //sources.push.apply(sources, ["svg"]);
        sources.push.apply(sources, getList(grunt, "renderers"));
        sources.push("src/dom.jsPlumb.js");
        return sources;
    },
    help = "\nBuilding jsPlumb\n" +
           "-----------------\n" +
           "To build jsPlumb, execute the 'build' task:\n\n" +
           "--> grunt build\n\n" +
           "this will, by default, build a version of jsPlumb with all the available connectors.\n\n" +
           "You can build a custom version of jsPlumb by specifying a list of connectors and/or renderers on the command line, for example:\n\n" +
           "--> grunt build --connectors=flowchart,statemachine\n\n";

module.exports = function(grunt) {

    grunt.registerTask('help', 'Help with the jsPlumb build', function(arg1, arg2) {
        grunt.log.write(help);
    });

    grunt.registerTask('info', 'dumps info about what will be built', function(arg1, arg2) {
        grunt.log.write('Build jsPlumb');
    });


    var fileLists = function(suffix) {
        suffix = suffix || "";
        return {
            "dom":{
                src:getSources(grunt),
                dest:getOutputFilename(grunt, suffix)
            }
        };
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: fileLists(),
        uglify: fileLists(".min"),
        qunit: {
            all: {
                options: {
                    urls:[
                        'http://localhost:3333/tests/unit/index.html'
                    ]
                }
            }
        },
        connect: {
            server: {
                options: {
                    port: 3333,
                    base: '.'
                }
            }
        },
        clean:{
            options:{
                force:true
            },
            dist:["dist"]
        },
        jshint: {
            options: {
                  eqnull: true,
                  loopfunc:true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                  '-W018':true, // confusing use of '!'
				  '-W055':true,  // a constructor name should start with an uppercase letter.
                  '-W032':true,  // unnecessary semicolon.
                    '-W068':true, // Wrapping non-IIFE function literals in parens is unnecessary. (rollup does this. it isnt a problem)
                '-W030':true,   // rollup header issue
                '-W103':true, // the __proto__ property is deprecated
                globals:{
                    window:true,
                    Biltong:true,
                    exports:true,
                    console:true,
                    Image:true,
                    setTimeout:true,
                    document:true,
                    setInterval:true,
                    jsPlumb:true,
                    jsPlumbUtil:true,
                    getComputedStyle:true,
                    define:true
                }
            },
            files:{
                src: [ 'src/anchors.js', 'src/base-library-adapter.js', 'src/browser-util.js', 'src/connection.js', 'src/connectors-bezier.js', 'src/connectors-flowchart.js', 'src/connectors-statemachine.js', 'src/connectors-straight.js', 'src/defaults.js', 'src/dom.jsPlumb.js', 'src/dom-adapter.js', 'src/endpoint.js', 'src/group.js', 'src/jsPlumb.js', 'src/overlay-component.js', 'src/renderers-svg.js', 'src/util.js' ]
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build-src']
            }
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'doc/api/',
                    themedir: 'doc/yuitheme/',
                    outdir: 'dist/apidocs/',
                    helpers:['doc/yuitheme/helpers.js']
                }
            }
        },
        exec:{
            "npmpack":{
                command:"npm pack;mv jsplumb-<%= pkg.version%>.tgz jsplumb.tgz"
            }
        }
    });

    // Load the plugin that provides the "docular" tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-qunit-junit');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-exec');





    grunt.registerTask('insertVersion', function() {
        var src = grunt.file.read("dist/js/jsplumb.js");
        grunt.file.write("dist/js/jsplumb.js", src.replace("<% pkg.version %>", package.version));
        src = grunt.file.read("dist/js/jsplumb.min.js");
        grunt.file.write("dist/js/jsplumb.min.js", src.replace("<% pkg.version %>", package.version));
    });


    grunt.registerTask("build", [ 'build-src', 'yuidoc', 'exec:npmpack' ]);
    grunt.registerTask('build-src', ['clean', 'jshint', 'concat', 'uglify', 'insertVersion' ]);
    grunt.registerTask('default', ['help']);
    grunt.registerTask('build-all', ['qunit', 'build']);

    var _replace = function(cwd, pattern, oldV, newV, exclusions) {
        exclusions = exclusions || [];
        var _one = function(f) {
            if (exclusions.indexOf(f) == -1) {
                if (!grunt.file.isDir(cwd + "/" + f)) {
                    var c = grunt.file.read(cwd + "/" + f);
                    grunt.file.write(cwd + "/" + f, c.replace(oldV, newV));
                }
            }
        };
        var sources = grunt.file.expand({ cwd:cwd }, pattern);
        for (var i = 0; i < sources.length; i++)
            _one(sources[i]);
    };

    grunt.registerTask('update', function() {
        var newV = grunt.option("newver");
        if (newV == null) {
            grunt.log.error("You must provide the new version: grunt update --newver=X.X.X");
        }
        else {
            var oldV = new RegExp(grunt.config("pkg").version, "g");
            // now update version number in all demos and src files etc
            _replace("src", "*.js", oldV, newV);
            _replace("demo", "**/*.html", oldV, newV);
            _replace(".", "package.json", oldV, newV);
            _replace(".", "README.md", oldV, newV);
        }

    });

    grunt.registerTask("test", ["connect:server", "qunit_junit", "qunit"]);

};
