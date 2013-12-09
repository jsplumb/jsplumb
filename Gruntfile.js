/**

    By default, jsPlumb's build incudes all of the connector types, endpoint types and render modes. But
    you can specify which of these you want via command line flags, eg:

    grunt --connectors=flowchart,bezier --renderers=svg,vml

    Connectors
    ----------
    flowchart
    statemachine
    bezier
    straight

    Endpoints
    ---------
    dot
    rectangle
    image

    Renderers
    ---------
    canvas
    svg
    vml


*/


// http://flippinawesome.org/2013/07/01/building-a-javascript-library-with-grunt-js/?utm_source=javascriptweekly&utm_medium=email

// also to checkout:
// https://github.com/ModelN/grunt-blanket-qunit


var JS_BEZIER = "0.6", // current js bezier version
    JS_PLUMB_GEOM = "0.1",
    getJsBezier = function() { return "lib/jsBezier-" + JS_BEZIER + ".js"; },
    getJsPlumbGeom = function() { return "lib/jsplumb-geom-" + JS_PLUMB_GEOM + ".js"; },
    libraries = [ "jquery", "mootools", "yui" ],
    runtimeLibraries = {
        jquery:"<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script><script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js'></script><script type='text/javascript' src='../../lib/jquery.ui.touch-punch.min.js'></script>",
        mootools:"<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools-yui-compressed.js'></script>",
        yui:""
    },
    version = "1.5.0",
    objects = {
        connectors : [
            "flowchart", "statemachine", "bezier", "straight"
        ],
        renderers : [
            "canvas", "svg", "vml"
        ],
        common:[
            'util.js', 'dom-adapter.js', 'jsPlumb.js', 'endpoint.js', 'connection.js', 'anchors.js', 'defaults.js'
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
        var sources = [ getJsBezier(), getJsPlumbGeom() ];
        sources.push.apply(sources, objects.common.map(function(v) { return "src/" + v; }));
        sources.push.apply(sources, getList(grunt, "connectors"));
        sources.push.apply(sources, getList(grunt, "renderers"));
        sources.push("src/" + lib + ".jsPlumb.js");
        return sources;
    },
    help = "\nBuilding jsPlumb\n" +
           "-----------------\n" +
           "To build jsPlumb, execute the 'build' task:\n\n" +
           "--> grunt build\n\n" +
           "this will, by default, build a version of jsPlumb with all the available connectors and renderers (SVG, Canvas and VML).\n\n" +
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

    var makeReplacements = function() {
        var o = {};
        // expand out lists of individual imports into concatenated versions for dist.
        // also replace link to docs
        libraries.forEach(function(l) {
            o[l] = {
                src: ['dist/demo/*/' + l + '.html', 'dist/tests/*.html', 'dist/demo/demo-all*.html' ],
                actions: [
                    {
                        name:"dep",
                        search:"(<!-- DEP.*>.*\n)(.*\n)*(.*/DEP -->)",
                        replace: runtimeLibraries[l],
                        flags: 'gm'
                    },
                    {
                        name:"js",
                        search:"(<!-- JS.*>.*\n)(.*\n)*(.*/JS -->)",
                        replace:"<script type='text/javascript' src='../js/" + l + ".jsPlumb-<%= pkg.version%>-min.js'></script>",
                        flags:'gm'
                    },
                    {
                        search:"<a href=\"http://localhost:4567\">",
                        replace:"<a href=\"../../doc/\">",
                        flags:"gm"
                    }
                ]
            };
        });

        // change media wiki style links into standard markdown links
        // [[Changes since version 1.4.0|changelog]]  -> [Changes since version 1.4.0](changelog)
        o["doc"] = {
            src:['jsPlumb.wiki/*.md'],
            actions:[
                {
                    name:"links",
                    search:"\\[\\[(.*)\\|(.*)\\]\\]",
                    replace:"[$1]($2)",
                    flags:"gm"
                }
            ]
        };

        return o;
    };

    //
    // this is a helper for the copy task, because the copy task is strange about the way it copies
    // things. basically the only way to get a file from some folder into another is to use a 'rename'
    // function! wtf.  anyway this is a helper for that.
    var moveFolder = function(toDir) {
        return function() {
            var idx = arguments[1].lastIndexOf("/"), _idx = idx < 0 ? 0 : idx;
            return toDir + "/" + arguments[1].substring(_idx);
        };
    };

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        concat: fileLists(),
        uglify: fileLists("-min"),
        qunit:{
            target: {
                src: ['tests/qunit-svg-jquery*.html'/*, 'tests/qunit-canvas-jquery*.html'*/ ]
            }
        },
        copy:{
            demos:{
                files:[
                    { expand:true, src:"demo/**/*", dest:"dist" },
                    { expand:true, cwd:"dist/js/", src:"*.js", dest:"dist/demo/js/"},
                    {
                        expand:true,
                        cwd:"dist/js/",
                        src:"jquery.jsPlumb-<%=pkg.version%>.js",
                        //dest:"dist/demo/requirejs/scripts/",
                        rename:function() {
                            return "dist/demo/requirejs/scripts/jsplumb.js";
                        }
                    },
                    {
                        expand:true,
                        cwd:"lib",
                        src:["mootools-1.3.2.1-more.js", "jquery-1.9.0.js", "jquery-ui-1.9.2-min.js", "jquery.ui.touch-punch.min.js"],
                        dest:"dist/lib/"
                    }
                ]
            },
            tests:{
                files:[
                    {
                        expand:true,
                        src:[ "tests/jsPlumb-tests.js", "tests/qunit-*.*", "tests/all-tests.html", "tests/loadTestHarness.js", "tests/loadTestHarness.html" ],
                        dest:"dist/"
                    }
                ]
            },
            doc:{
                files:[
                    {
                        expand:true,
                        src:[ "doc/gollum-template.css", "demo/demo-all.css", "demo/*.ttf", "demo/*.woff", "demo/logo_bw_44h.jpg" ],
                        rename:moveFolder("dist/doc")
                    }
                ]
            },
            // copy markdown to temp dir for pre-processing
            temp:{
                files:[
                    {
                        expand:true,
                        src:"../jsPlumb.wiki/*.md",
                        dest:"TEMPOUT/"
                    }
                ]
            },
            logo:{
                files:[
                    {
                        expand:false,
                        src:"./logo-bw.png",
                        dest:"dist/logo-bw.png"
                    }
                ]
            }
        },
        "regex-replace": makeReplacements(),
        markdown: {
            all: {
                files: [{
                    expand: true,
                    flatten:true,
                    src: 'jsPlumb.wiki/*.md',
                    dest: 'dist/doc/',
                    ext: '.html'
                }],
                options:{
                    template:'./doc/doc-template.html'
                }
            }
        },
        clean:{
            temp:"jsPlumb.wiki"
        },
        //http://www.kajabity.com/2012/02/how-i-introduced-jsdoc-into-a-javascript-project-and-found-my-eclipse-outline/
        jsdoc : {
            dist : {
                src:['doc/api/README.md', 'doc/api/util-api.js', 'doc/api/jsplumb-api.js', 'doc/api/uicomponent.js', 'doc/api/overlaycomponent.js', 'doc/api/endpoint-api.js', 'doc/api/connection-api.js', 'doc/api/connectors.js', 'doc/api/overlays-api.js'],
                options: {
                    destination: 'dist/apidocs/',
                    configure:'jsdoc.json',
                    "private":false
                }
            }
        },
        jshint: {
            options: {
                  eqnull: true,
                  loopfunc:true,
                  '-W099': true,
                  '-W018':true,
                  '-W038':true
                },
            files:{
                src: ['src/anchors.js', 'src/util.js', 'src/connection.js', 'src/connectors-bezier.js', 'src/connectors-flowchart.js', 'src/connectors-statemachine.js', 'src/defaults.js', 'src/dom-adapter.js', 'src/endpoint.js', 'src/jquery.jsPlumb.js', 'src/mootools.jsPlumb.js', 'src/renderers-canvas.js', 'src/renderers-svg.js', 'src/renderers-vml.js', 'src/yui.jsPlumb.js', 'src/jsPlumb.js']
            }
        },
        watch: {
            scripts: {
                files: ['src/*.js'],
                tasks: ['build-src']
            }
        }
    });

    // Load the plugin that provides the "docular" tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('writeIndex', function() {
        // write an index file to the root of the dist dir (redirects to main jquery demo)
        grunt.file.write("dist/index.html", "<!doctype html><html><head><meta http-equiv='refresh' content='0;url=demo/home/jquery.html'/></head></html>");
        // write an index file to the root of the docs dir (redirects to 'home')
        grunt.file.write("dist/doc/index.html", "<!doctype html><html><head><meta http-equiv='refresh' content='0;url=home'/></head></html>");
    });

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
        }

    });

    // reads the contents of home.html (the docs index), and writes it into all of the other files.
    grunt.registerTask("docIndex", function() {
        var f = grunt.file.read("dist/doc/contents.html"),
            re = /(<!-- BODY.*>.*\n)(.*\n)*(.*\/BODY -->)/,
            idx = f.match(re);

        _replace("dist/doc", "*.html", /<\!-- NAV -->/, idx[0], ["contents.html"]);
    });

    /*

    <target name="upgrade-jsbezier" depends="old,new">
        <!-- replace refs to old version in demo html to new version -->
        <replace dir="demo/jquery" token="jsBezier-${old}.js" value="jsBezier-${new}.js"/>
        <replace dir="demo/yui3" token="jsBezier-${old}.js" value="jsBezier-${new}.js"/>
        <replace dir="demo/mootools" token="jsBezier-${old}.js" value="jsBezier-${new}.js"/>
    </target>

    // also add one for jsplumb-geom

    */

    grunt.registerTask('build-src', ['prepare', 'concat', 'uglify' ]);
    grunt.registerTask('build', [/*'qunit', */'build-src', 'copy:temp', 'copy:demos', 'copy:tests', 'copy:doc', 'copy:logo', 'regex-replace', 'markdown', 'docIndex', 'jsdoc', 'info', 'clean', 'writeIndex']);
    grunt.registerTask('default', ['help']);
    grunt.registerTask('build-all', ['qunit', 'build']);

   /* grunt.registerTask("build-all", function() {
        grunt.task.run("build")
    })*/
};
