/**
 * @doc function
 * @name docular.class.reader
 * @description This class does the heavy lifting of parsing documentation elements out of given files
 * @requires docular.class.Doc
 */

/*============ EXPORTS ============*/

exports.collect = collect;


/*============ DEPENDENCIES ============*/

var Doc = require('./Doc.js');


/*============ PRIVATE VARIABLES / METHODS ============*/

var Q = require('qq'),
    qfs = require('q-fs'),
    fs = require('fs'),
    colors = require('colors'),
    path = require('path'),
    writer = require('./writer.js');

var NEW_LINE = /\n\r?/;
var pattern_docAPI = new RegExp("^@doc-(\\S+)",'gi');
var pattern_docFile_angular = new RegExp("^.*\\.(ngdoc)$", 'i');
var pattern_docFile_default = new RegExp("[\\.]doc$",'i');
var pattern_docFile_readme = new RegExp("[\\.]md$",'i');

var count = 0;

var doc_apis = {};

//setup relative paths to the current working directory
var ABS_SCRIPTS = __dirname;
var ABS_LIB = path.resolve(ABS_SCRIPTS + '/..');
var ABS_WEBAPP = ABS_LIB + '/webapp';
var REL_WEBAPP = path.relative(process.cwd(), ABS_WEBAPP);

//main function that gets a list of sources to read
function collect(sources, docs_api_in) {

    /*============ PRIVATE VARIABLES / METHODS ============*/

    //should we copy the source file into a txt file that can be retrieved by the UI?
    var showSource = sources.showSource;

    //store a reference to the doc_apis
    var docs_api = docs_api_in;

    //a set of all promises AND all docs to be returned
    var docPromises = [];
    var allDocs = [];

    //method to copy content from source file to a text file for the UI
    var copySourceFile = function (file, content, group, section) {

        var newFile = file.replace(/\\/gi,'_').replace(/\//gi,'_');
        return writer.output(
            REL_WEBAPP + '/documentation/docular-source/' + group + '/' + section + '/' + newFile + '.txt',
            content.toString()
        );
    };

    //a list of script files gets passed in for processing
    var getJSFiles = function (files) {

        var done;
        //read all files in parallel.
        files.forEach(function(file) {
            var work;
            if(/\.js$/.test(file)) {
                work = Q.when(qfs.read(file, 'b'), function(content) {

                    processJsFile(content, file, sources.group, sources.section, docs_api, showSource).forEach (function(doc) {
                        allDocs.push(doc);
                    });

                    //do we need to copy this file so the UI can get it?
                    if(showSource){
                        return copySourceFile(file, content, sources.group, sources.section);
                    }

                });
            }
            done = Q.when(done, function() {
                return work;
            });
        });
        return done;
    };

    //a list of doc files gets passed in for processing
    var getDOCFiles = function(files){

        var done;
        files.forEach(function(file) {
            var work;
            if (
                file.match(pattern_docFile_angular) ||
                file.match(pattern_docFile_default) ||
                file.match(pattern_docFile_readme)
            ){// here we match on ngdoc to support angular, but we should just use .doc files
                work = Q.when(qfs.read(file, 'b'), function(content){
                    try{

                        processDocFile(content, file, sources.group, sources.section, docs_api, showSource).forEach (function(doc) {
                            allDocs.push(doc);
                        });

                        //do we need to copy this file so the UI can get it?
                        if(showSource){
                            return copySourceFile(file, content, sources.group, sources.section);
                        }

                    } catch (e) {
                        console.log("ERROR: ".red, "Could not parse doc file:", file, e);
                    }
                });
            }
            done = Q.when(done, function() {
                return work;
            });
        });
        return done;
    };

    var getStats = function (path) {
        return function (stats) {
            return {isDirectory: stats.isDirectory(), path: path};
        };
    };


    /*============ COLLECT ALL DOCS EMBEDDED IN COMMENTS IN JS FILES ============*/

    var js_paths = sources.scripts || [];
    for(var i=0; i < js_paths.length; i++){

        if(fs.existsSync(js_paths[i])){

            docPromises.push(

                Q.when(qfs.stat(js_paths[i]), getStats(js_paths[i])).then(function (statsInfo) {
                    if(statsInfo.isDirectory) {
                        return Q.when(qfs.listTree(statsInfo.path), getJSFiles);
                    } else {
                        return getJSFiles([statsInfo.path]);
                    }
                })

            );

        } else {
            console.log("WARNING: ".yellow + "Doc file '" + js_paths[i].yellow + "' not found.");
        }
    }


    /*============ COLLECT ALL DOCS CREATED IN DOC FILES (NOT WITHIN COMMENTS) ============*/

    var doc_paths = sources.docs || [];
    for(var i=0; i < doc_paths.length; i++){

        if(fs.existsSync(doc_paths[i])){

            docPromises.push(

                Q.when(qfs.stat(doc_paths[i]), getStats(doc_paths[i])).then(function (statsInfo) {
                    if(statsInfo.isDirectory) {
                        return Q.when(qfs.listTree(statsInfo.path), getDOCFiles);
                    } else {
                        return getDOCFiles([statsInfo.path]);
                    }
                })
            );

        } else {
            console.log("WARNING: ".yellow + "Doc file '" + doc_paths[i].grey + "' not found.");
        }
    }


    /*============ RETURN PROMISES FOR COMPLETION OF PARSING EACH FILE/DIRECTORY ============*/

    return Q.when(Q.deep(docPromises), function() {
        return allDocs;
    });

}

function processDocFile(content, file, group, section, docs_api, showSource) {

    var docs = [];
    var lines = content.toString().split(NEW_LINE);
    var text = [];
    var startingLine = 1;
    var match;
    var hasStarted = false;
    var showSource = showSource || false;

    //once a doc has been parsed out then we add it to the stack
    var flushDoc = function (lineEnd) {
        text = text.join('\n');
        text = text.replace(/^\n/, '');

        //determine which doc_api to pass in.
        var thisDocAPI = docs_api['doc'];

        //by default angular
        if(text.match(/(@ngdoc)/)){

            thisDocAPI = docs_api['angular'] || docs_api['doc'];

        } else if (text.match(pattern_docAPI) ){

            var docIdentifier = pattern_docAPI.exec(text);
            if(docIdentifier){
                thisDocAPI = docs_api[docIdentifier[1]];
            }

        }

        try {

            //Create a new Doc and push it into our list of docs
            docs.push(new Doc({
                group: group,
                section: section,
                text: text,
                file: file,
                codeBlocks : [{lineStart:startingLine, lineEnd:lineEnd-1}],
                doc_api_extensions: thisDocAPI,
                showSource: showSource
            }).parse());

        } catch (e) {
            console.log("ERROR:".red, " creating non-script doc", e);
        }

    };

    //Go through each line and group up documents
    lines.forEach(function(line, lineNumber){

        lineNumber++;

        // is the document starting?
        if(line.match(/^[\s]*(@ngdoc|@doc-|@doc\s{1})/)){

            //if we were already in a doc we need to close it up
            if(hasStarted) {
                flushDoc(lineNumber);
            }

            //Now start fresh with this new starting line
            text = [];
            text.push(line);
            startingLine = lineNumber;
            hasStarted = true;

        } else {

            if(hasStarted){
                text.push(line);
            }
        }
    });

    //the document will end at the end of the page so we need to push one more in
    if(hasStarted) {
        flushDoc(lines.length);
    }

    return docs;
}

function processJsFile(content, file, group, section, docs_api, showSource) {

    var docs = [];
    var lines = content.toString().split(NEW_LINE);
    var text;
    var startingLine;
    var match;
    var inDoc = false;
    var showSource = showSource || false;

    lines.forEach(function(line, lineNumber){

        lineNumber++;

        // is the comment starting?
        if (!inDoc && (match = line.match(/^\s*\/\*\*\s*(.*)$/))) {
            line = match[1];
            inDoc = true;
            text = [];
            startingLine = lineNumber;
        }

        // are we done?
        if (inDoc && line.match(/\*\//)) {
            text = text.join('\n');
            text = text.replace(/^\n/, '');
            if (text.match(/(@ngdoc|@doc)/)){

                //determine which doc_api to pass in.
                var thisDocAPI = docs_api['doc'];

                //by default angular
                if(text.match(/(@ngdoc)/)){

                    thisDocAPI = docs_api['angular'] || docs_api['doc'];

                } else {

                    var docIdentifier = pattern_docAPI.exec(text);
                    if(docIdentifier){
                        thisDocAPI = docs_api[docIdentifier[1]];
                    }

                }

                try {

                    //Create a new Doc and push it into our list of docs
                    docs.push(new Doc({
                        group: group,
                        section: section,
                        text: text,
                        file: file,
                        codeBlocks : [{lineStart:startingLine, lineEnd:lineNumber -1}],
                        doc_api_extensions: thisDocAPI,
                        showSource: showSource
                    }).parse());

                } catch (e) {
                    console.log("ERROR:".red, " creating script doc", e);
                }

            }
            doc = null;
            inDoc = false;
        }

        // is the comment add text
        if (inDoc){
            text.push(line.replace(/^\s*\*\s?/, ''));
        }
    });
    return docs;
}
