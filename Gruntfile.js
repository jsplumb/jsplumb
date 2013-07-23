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

// angular  docs:
//  http://grunt-docular.com/ 

// also to checkout:
// https://github.com/ModelN/grunt-blanket-qunit


var JS_BEZIER = "0.6", // current js bezier version
    getJsBezier = function() { return "lib/jsBezier-" + JS_BEZIER + ".js"; },
    libraries = [ "jquery", "mootools", "yui" ],
    runtimeLibraries = {
        jquery:"<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js'></script><script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js'></script><script type='text/javascript' src='../js/jquery.ui.touch-punch.min.js'></script>",
        mootools:"<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/mootools/1.3.2/mootools-yui-compressed.js'></script>",
        yui:""
    }
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
        return (grunt.option(type) || "").split(",");
    },
    filter = function(l, v, t, o) {
        if (l.length == 0 || l.indexOf(v) != -1)
            o.push("src/" + t + "-" + v + ".js"); 
    },
    getList = function(grunt, type) {
        var ol = optionList(grunt, type), l = objects[type], out = [];
        for (var i = 0; i < l.length; i++)
            filter(ol, l[i], type, out);
        return out;
    },
    getSources = function(grunt, lib) {
        var sources = [ getJsBezier() ];
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


    var fileLists = function(suffix) {
        suffix = suffix || "";
        var o = {};
        libraries.forEach(function(l) {
            o[l] = {
                src:getSources(grunt, l),
                dest:'dist/js/' + l + '.jsPlumb-<%= pkg.version%>' + suffix + '.js'
            };
        });
        return o;
    };

    var makeReplacements = function() {
        var o = {};
        libraries.forEach(function(l) {
            o[l] = {
                src: ['dist/demo/' + l + '/*.html'],
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
                    }
                ]
            }    
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
                src: ['tests/qunit-svg*.html', 'tests/qunit-canvas*.html' ]
            }
        },
        copy:{
            demos:{
                files:[
                    { expand:true, src:"demo/**/*", dest:"dist" }                                                                                                 
                ]
            },
            requirejs:{
                files:[
                    { 
                        expand:true, 
                        cwd:"dist/js/", 
                        src:"jquery.jsPlumb-<%=pkg.version%>.js", 
                        //dest:"dist/demo/requirejs/scripts/",
                        rename:function() {                             
                            return "dist/demo/requirejs/scripts/jsplumb.js" 
                        } 
                    }
                ]
            },
            jsplumb_to_demo:{
                files:[
                    { expand:true, cwd:"dist/js/", src:"*.js", dest:"dist/demo/js/"}
                ]
            },
            tests:{
                files:[
                    { expand:true, src:"tests/jsPlumb-tests.js", dest:"dist/"}
                ]
            }
        },
        "regex-replace": makeReplacements(),
        // TODO: use a template in the markdown plugin
        // https://github.com/treasonx/grunt-markdown
        markdown: {
            all: {
                files: [{
                    expand: true,
                    src: '../jsPlumb.wiki/*.md',
                    dest: 'dist/docs/html/',
                    ext: '.html'
                }]
            }
        },
        docular: {
            groups: [{
                groupTitle: 'jsPlumb apidoc',
                groupId: 'apidoc',
                groupIcon: 'icon-beer',
                sections: [{
                    id: "classes",
                    title: "Classes",
                    scripts: [
                        "src/jsPlumb.js", "src/endpoint.js", "doc/api/overlaycomponent.js", "doc/api/uicomponent.js"
                    ],
                    docs: [],
                    rank : {}
                }]
            }],
            showDocularDocs: false,
            showAngularDocs: false
        }   
    });
   
    // Load the plugin that provides the "docular" tasks.
    grunt.loadNpmTasks('grunt-docular');
    grunt.loadNpmTasks('grunt-contrib-concat');   
    grunt.loadNpmTasks('grunt-contrib-uglify'); 
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-regex-replace');
    grunt.loadNpmTasks('grunt-markdown');

    // the current build:
    // - generates apidocs and massages the resulting files a little (docular to the rescue)
    // - generates a concatenated and minified jsplumb for each supported library (done)
    // - copies demos into the build dir (done)
    // - copies built jsplumb versions into demo dir (done)
    // - copies a jsplumb version into the requirejs demo in the build dir (done)
    // - replaces dev imports in the demos in the build dir with refs to concatenated files (done)
    // - copies tests, font and libs into the build dir

    // the wiki documentation is handled in the jsplumb.org project. but i would like to somehow
    // build it into the grunt build.
   
    // Default task(s).
    grunt.registerTask('build', ['qunit', 'concat', 'uglify', 'copy', 'regex-replace', 'markdown', 'docular', 'info']);
    grunt.registerTask('default', ['help']);
};
