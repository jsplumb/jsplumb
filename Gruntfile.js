
var versions = {
        JS_BEZIER : { f:"jsBezier", v:"0.6" },
        BILTONG : { f:"biltong", v:"0.2" },
        MOTTLE : {f:"mottle", v:"0.3" },
        KATAVORIO : {f:"katavorio", v:"0.3" }
    },
    get = function(name) { return "lib/" + versions[name].f + "-" + versions[name].v + ".js"; },

    libraries = [ "jquery", "mootools", "yui", "dom" ],
    libraryNames = [ "jQuery", "MooTools", "YUI3", "Vanilla" ],
    renderers = [ "svg", "vml" ],
    demos = [
        [ "home", "Kitchen Sink" ],
        [ "flowchart", "Flowchart" ],
        [ "statemachine", "State Machine" ],
        [ "draggableConnectors", "Drag and Drop"],
        [ "perimeterAnchors", "Perimeter Anchors"],
        [ "chart", "Hierarchical Chart" ],
        [ "sourcesAndTargets", "Sources and Targets" ],
        [ "dynamicAnchors", "Dynamic Anchors" ],
        [ "animation", "Animation" ]
    ],
    extraLibraries = {
        jquery:[],
        mootools:[],
        yui:[],
        dom:[ get("MOTTLE"), get("KATAVORIO") ]
    }
    objects = {
        connectors : [
            "flowchart", "statemachine", "bezier", "straight"
        ],
        renderers : [
            "svg", "vml"
        ],
        common:[
            'util.js', 'browser-util.js', 'dom-adapter.js', 'jsPlumb.js', 'endpoint.js', 'connection.js', 'anchors.js', 'defaults.js'
        ]
    },
    optionList = function(grunt, type) {
        return grunt.option(type) && grunt.option(type).split(",") || [];
    },
    getOutputFilename = function(grunt, lib, suffix) {
        var suffix2 = grunt.option('outputSuffix') ? ('-' + grunt.option("outputSuffix")) : '';
        return 'dist/js/' + lib + '.jsPlumb' + suffix2 + '-<%= pkg.version%>' + suffix + '.js';
    },
    filter = function(l, v, t, o) {
        if (l.length === 0 || l.indexOf(v) != -1)
            o.push("src/" + t + "-" + v + ".js");
    },
    getList = function(grunt, type) {
        var ol = optionList(grunt, type), l = objects[type], out = [];
        for (var i = 0; i < l.length; i++)
            filter(ol, l[i], type, out);

        return out;
    },
    getSources = function(grunt, lib) {
        var sources = [ get("JS_BEZIER"), get("BILTONG") ];
        sources.push.apply(sources, extraLibraries[lib]);
        sources.push.apply(sources, objects.common.map(function(v) { return "src/" + v; }));
        sources.push.apply(sources, getList(grunt, "connectors"));
        sources.push.apply(sources, getList(grunt, "renderers"));
        sources.push("src/" + lib + ".jsPlumb.js");
        console.dir(sources);
        return sources;
    },
    help = "\nBuilding jsPlumb\n" +
           "-----------------\n" +
           "To build jsPlumb, execute the 'build' task:\n\n" +
           "--> grunt build\n\n" +
           "this will, by default, build a version of jsPlumb with all the available connectors and renderers (SVG and VML).\n\n" +
           "You can build a custom version of jsPlumb by specifying a list of connectors and/or renderers on the command line, for example:\n\n" +
           "--> grunt build --connectors=flowchart,statemachine --renderers=svg,vml\n\n";

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
        var o = {};
        libraries.forEach(function(l) {
            o[l] = {
                src:getSources(grunt, l),
                dest:getOutputFilename(grunt, l, suffix)
            };
        });
        return o;
    };

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: fileLists(),
        uglify: fileLists("-min"),
        qunit:{
            target: {
                src: [ 'tests/qunit-*.html' ]
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
                    { expand:true, cwd:"external", src:"*.*", dest:"jekyll/external" }
                ]
            }
        },
        clean:{
            options:{
                force:true
            },
            stage:[ "jekyll/doc", "jekyll/apidocs", "jekyll/demo", "jekyll/tests", "jekyll/css", "jekyll/js", "jekyll/img", "jekyll/external" ],
            site: [ 'jekyll/_site' ]
        },
        jshint: {
            options: {
                  eqnull: true,
                  loopfunc:true,
                  '-W099': true,
                  '-W018':true,
                  '-W038':true,
				  '-W044':true,
				  '-W053':true,
				  '-W055':true
                },
            files:{
                src: ['src/anchors.js', 'src/util.js', 'src/browser-util.js', 'src/connection.js', 'src/connectors-bezier.js', 'src/connectors-flowchart.js', 'src/connectors-statemachine.js', 'src/defaults.js', 'src/dom-adapter.js', 'src/endpoint.js', 'src/dom.jsPlumb.js', 'src/jquery.jsPlumb.js', 'src/mootools.jsPlumb.js', 'src/renderers-svg.js', 'src/renderers-vml.js', 'src/yui.jsPlumb.js', 'src/jsPlumb.js']
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

            }
        }
    });

    // Load the plugin that provides the "docular" tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jekyll');



// ------------------------- prepare jekyll site task --------------------------------------------------------

    var _createDemos = function() {
        for (var i = 0; i < demos.length; i++) {
            var d = demos[i][0],
                js = grunt.file.read("demo/" + d + "/demo.js"),
                css = grunt.file.read("demo/" + d + "/demo.css");

            grunt.file.mkdir("jekyll/demo/" + d);
            for (var j = 0; j < libraries.length; j++) {
                var html = grunt.file.read("demo/" + d + "/" + libraries[j] + ".html");
                    m = html.match(/(<!-- demo.*>.*\n)(.*\n)*(.*\/demo -->)/),
                    t = m[0].match(/<h4>(.*)<\/h4>/)[0];

                grunt.file.write("jekyll/demo/" + d + "/demo.js", js);
                grunt.file.write("jekyll/demo/" + d + "/demo.css", css);
                var fm = support.createFrontMatter({
                    layout:"demo",
                    date:support.timestamp(),
                    categories:"demo",
                    library:libraries[j],
                    libraryName:libraryNames[j],
                    title:t,
                    base:"../..",
                    demo:d
                });
                grunt.file.write("jekyll/demo/" + demos[i][0] + "/" + libraries[j] +  ".html", fm + m[0]);
            }
        }
    };

    var package = require('./package.json');
    var support = require("./build-support.js");

    //
    //  creates qunit test pages: we only need to create markdown files here; the jekyll layout fills in the rest.
    //
    var _createTests = function() {
        // unit tests
        for (var j = 0; j < renderers.length; j++) {
            for (var i = 0; i < libraries.length; i++) {
                var frontMatter = support.createFrontMatter({
                    layout:"test",
                    date:support.timestamp(),
                    categories:"test",
                    library:libraries[i],
                    renderer:renderers[j],
                    base:".."
                });
                grunt.file.write("jekyll/tests/qunit-" + renderers[j] + "-"  + libraries[i] + "-instance.html", frontMatter);
            }
        }

        // load tests
        var lt = grunt.file.read("tests/loadtest-template.html");
        for (var i = 0; i < libraries.length; i++) {
            var frontMatter = support.createFrontMatter({
                layout:"loadtest",
                date:support.timestamp(),
                categories:"test",
                library:libraries[i],
                libraryName:libraryNames[i],
                base:".."
            });
            grunt.file.write("jekyll/tests/loadtest-"  + libraries[i] + ".html", frontMatter + lt);
        }

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
        var sources = grunt.file.expand({ cwd:package.jsPlumbWiki }, "*");
        for (var i = 0; i < sources.length; i++) {
            if (exclusions.indexOf(sources[i]) == -1) {
                var layout = sources[i] == "contents.md" ? "plain" : "doc";
                support.processMarkdownFile(grunt, package.jsPlumbWiki, sources[i], layout, "..", docOutput);
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

    grunt.registerTask('createTests', _createTests);
    grunt.registerTask('createDemos', _createDemos);
    grunt.registerTask('prepare', _prepareSite);
    grunt.registerTask("build", [ 'build-src', 'clean:stage', 'prepare', 'copy:site', 'copy:tests', 'copy:js', 'copy:demos', 'copy:external', 'yuidoc', 'createTests', 'createDemos',  'writeIndex', 'jekyll', 'copy:dist', 'clean:stage', 'clean:site' ]);
    grunt.registerTask('build-src', ['clean', 'jshint', 'prepare', 'concat', 'uglify' ]);
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
        if (newV ===null) {
            grunt.log.error("You must provide the new version: grunt update --newver=X.X.X");
        }
        else {
            var oldV = new RegExp(grunt.config("pkg").version, "g");
            // now update version number in all demos and src files
            _replace("src", "*.js", oldV, newV);
            _replace("demo", "**/*.html", oldV, newV);
            _replace(".", "bower.json", oldV, newV);
            _replace(".", "package.json", oldV, newV);
            _replace(".", "README.md", oldV, newV);
            _replace("jekyll", "**/*.*", oldV, newV);
        }

    });

};
