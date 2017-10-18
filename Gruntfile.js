
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

    grunt.registerTask('prepare', function() {
        grunt.file.delete("dist");
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
        copy:{
            site:{
                files:[
                    { expand:true, cwd:"css", src:"*.*", dest:"jekyll/css" },
                    { expand:true, cwd:"demo/font", src:"*.*", dest:"jekyll/css" },
                    { expand:true, cwd:"img", src:"*.*", dest:"jekyll/img" },
                    { expand:true, cwd:"demo", src:["**/*.jpg", "**/*.png" ], dest:"dist/demo/"}
                ]
            },
            demos:{
                files:[
                    { expand: true, cwd:"demo", src:"demo-list.js", dest:"jekyll/js"}
                ]
            },
            tests:{
              files:[
                { expand:true, cwd:"tests", src:[ "*.css", "qunit-*.js", "*.js", "loadtest-template.html"  ], dest:"jekyll/tests" }
              ]
            },
            js:{
                files:[
                    { expand:true, cwd:"dist/js", src:"*.js", dest:"jekyll/js" }
                ]
            },
            dist:{
                files:[
                    { expand:true, cwd:"jekyll/_site", src:"**/*.*", dest:"dist" }
                ]
            },
            external:{
                files:[
                    { expand:true, cwd:"external", src:"*.*", dest:"jekyll/external" },
                    { expand:true, cwd:"css/external", src:"*.*", dest:"dist/css/external" }
                ]
            }
        },
        clean:{
            options:{
                force:true
            },
            dist:["dist"],
            stage:[ "jekyll/doc", "jekyll/apidocs", "jekyll/demo", "jekyll/tests", "jekyll/css", "jekyll/js", "jekyll/img", "jekyll/external" ],
            site: [ 'jekyll/_site' ]
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
                    getComputedStyle:true
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
		jekyll: {
    		options: {
				src:'jekyll'
    		},
			dist:{
				options:{
					dest:"jekyll/_site",
					config:'jekyll/_config.yml'
				}
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
                    themedir: 'jekyll/yuitheme/',
                    outdir: 'jekyll/apidocs/',
                    helpers:['jekyll/yuitheme/helpers.js']
                }
            },
            tests:{
                name: '<%= pkg.name %> - Test Coverage',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: 'tests/',
                    themedir: 'jekyll/yuitheme/',
                    outdir: 'jekyll/test-apidocs/',
                    helpers:['jekyll/yuitheme/helpers.js']
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-exec');


// ------------------------- prepare jekyll site task --------------------------------------------------------

    var support = require("./build-support.js");
    var demoList = BUILD.demos;

    var _createDemos = function() {
        for (var i = 0; i < demoList.length; i++) {
            var d = demoList[i].id,
                js = grunt.file.read("demo/" + d + "/demo.js"),
                css = grunt.file.read("demo/" + d + "/demo.css");

            grunt.file.mkdir("jekyll/demo/" + d);
            //for (var j = 0; j < libraries.length; j++) {
                var html = grunt.file.read("demo/" + d + "/dom.html"),
                    m = html.match(/(<!-- demo.*>.*\n)(.*\n)*(.*\/demo -->)/),
                    t = demoList[i].name;

                grunt.file.write("jekyll/demo/" + d + "/demo.js", js);
                grunt.file.write("jekyll/demo/" + d + "/demo.css", css);
                var fm = support.createFrontMatter({
                    layout:"demo",
                    date:support.timestamp(),
                    categories:"demo",
                    title:t,
                    base:"../..",
                    demo:d
                });
                grunt.file.write("jekyll/demo/" + demoList[i].id + "/dom.html", fm + m[0]);
           // }
        }
    };



    //
    //  creates qunit test pages: we only need to create markdown files here; the jekyll layout fills in the rest.
    //
    var _createTests = function() {
        // unit tests


            var frontMatter = support.createFrontMatter({
                layout:"test",
                date:support.timestamp(),
                categories:"test",
                renderer:"svg",
                base:".."
            });
            grunt.file.write("jekyll/tests/qunit-svg-dom-instance.html", frontMatter);


        // load tests
        var lt = grunt.file.read("tests/loadtest-template.html");

        var frontMatter = support.createFrontMatter({
            layout:"loadtest",
            date:support.timestamp(),
            categories:"test",
            base:".."
        });
        grunt.file.write("jekyll/tests/loadtest-dom.html", frontMatter + lt);

        // now create index page
        var ip = grunt.file.read("tests/index.html"),
            m  = ip.match(/(<!-- content.*>.*\n)(.*\n)*(.*\/content -->)/),
            fm = support.createFrontMatter({
                layout:"default",
                date:support.timestamp(),
                base:".."
            });

        grunt.file.write("jekyll/tests/index.html", fm + m[0]);
    };

    var _prepareSite = function() {
        // exclusions from input doc dir
        var exclusions = ["node_modules", "ff.htl"],
            docOutput = "jekyll/doc";

        // 1. create directories for docs.
        grunt.file.mkdir(docOutput);

        // 2. copy files from markdown directory into 'doc', and then give each one some front matter.
        var sources = grunt.file.expand({ cwd:"doc/wiki" }, "*");
        for (var i = 0; i < sources.length; i++) {
            if (exclusions.indexOf(sources[i]) == -1) {
                var layout = sources[i] == "contents.md" ? "plain" : "doc";
                support.processMarkdownFile(grunt, "doc/wiki", sources[i], layout, "..", docOutput);
            }
        }
    };

    grunt.registerTask('writeIndex', function() {
        // write an index file to the root of the dist dir (redirects to main "Vanilla" demo)
        grunt.file.write("jekyll/index.html", "<!doctype html><html><head><meta http-equiv='refresh' content='0;url=demo/flowchart/dom.html'/></head></html>");
        // and to the demo directory root
        grunt.file.write("jekyll/demo/index.html", "<!doctype html><html><head><meta http-equiv='refresh' content='0;url=flowchart/dom.html'/></head></html>");
        // write an index file to the root of the docs dir (redirects to 'home')
        grunt.file.write("jekyll/doc/index.html", "<!doctype html><html><head><meta http-equiv='refresh' content='0;url=home.html'/></head></html>");
    });



    grunt.registerTask('insertVersion', function() {
        var src = grunt.file.read("dist/js/jsplumb.js");
        grunt.file.write("dist/js/jsplumb.js", src.replace("<% pkg.version %>", package.version));
        src = grunt.file.read("dist/js/jsplumb.min.js");
        grunt.file.write("dist/js/jsplumb.min.js", src.replace("<% pkg.version %>", package.version));
    });

    grunt.registerTask('createTests', _createTests);
    grunt.registerTask('createDemos', _createDemos);
    grunt.registerTask('prepare', _prepareSite);
    grunt.registerTask("build", [ 'build-src', 'clean:stage', 'prepare', 'copy:site', 'copy:tests', 'copy:js', 'copy:demos', 'copy:external', 'yuidoc', 'createTests', 'createDemos',  'writeIndex', 'jekyll', 'copy:dist', 'clean:stage', 'clean:site', 'exec:npmpack' ]);
    grunt.registerTask('build-src', ['clean', 'jshint', 'prepare', 'concat', 'uglify', 'insertVersion' ]);
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
            _replace("jekyll", "**/*.*", oldV, newV);
        }

    });

    grunt.registerTask("test", ["connect:server", "qunit_junit", "qunit"]);

};
