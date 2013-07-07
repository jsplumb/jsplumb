"use strict";
/**
 * THIS IS THE DEFAULT CONFIGURATION FOR DOCUMENTATION
 * !!! MODIFYING THIS MODIFIES ALL DOCUMENTATION GENERATION AS THESE ARE INHERITED DURING ANY DOCUMENTATION GENERATION !!!
 */

/*========== DEPENDENCIES ==========*/

var Showdown = require('showdown');


/*========== PRIVATE VARIABLES AND METHODS ==========*/

var GLOBALS = /^angular\.([^\.]+)$/;

var property = function (name) {
    return function(value){
        return value[name];
    };
};

var count = 0;

var returnsFunction = function (text) {
    var self = this;
    var match = text.match(/^\{([^}=]+)\}\s+(.*)/);
    if (!match) {
        throw new Error("Not a valid 'returns' format: " + text + ' in ' + self.file + ':' + self.line);
    }
    self.returns = {
        type: match[1],
        description: self.markdown(text.replace(match[0], match[2]))
    };
};

var methodFunction = function(dom){
    var self = this;
    var htmlMethods = self.doc_api_extensions.html;
    var name = self.name.match(/^angular(\.mock)?\.(\w+)$/) ? self.name : self.name.split(/\./).pop();

    htmlMethods.parameters.call(self, dom);
    htmlMethods.returns.call(self, dom);
    htmlMethods.method_properties_events.call(self, dom);
};

/*========== EXPORT THE DOC API ==========*/

// module.exports = {
//     layout:{}
//     ui_resources:{},
//     parse: {},
//     markdown: {},
//     html: {},
//     heading: {},
//     render: {}
// };

module.exports =  {

    identifier: "doc", //matches @doc our default
    title: "Default Documentation Handling",


    /*============ WHAT DOES "MODULE" MEAN FOR THIS TYPE OF CODE? WHAT SECTIONS DO PARENT LEVEL TYPES FALL INTO? ===========*/

    // the module title and definition help users understand how code is grouped at the highest level of code organization
    // the title gets used in the UI so the highest level of grouping would be called whatever the title is

    layout: {
        module: {
            title: "module",
            getModule: function (id, module) {
                return module;
            }
        },
        sections: {
            "class" : {
                order: 0,
                title: "classes",
                match: function (id, module, section, item, subItem) {
                    return section == "class";
                }
            },
            "global": {
                order: 1,
                title: "globals",
                match: function (id, module, section, item, subItem) {
                    return section == "global";
                }
            }
        }
    },


    /*============ UI RESOURCES TO INJECT IN ORDER (from the base of this doc api plugin) ===========*/

    ui_resources : {
        js : [],
        css : ['resources/ui/api_ui_styles.css']
    },


    /*============ HERE WE SETUP CUSTOM KEY VALUE PARSING METHODS ===========*/

    // each method will recieve (self, text, Doc), where self is a Doc instance, the text value of the pararm, and reference to the Doc class
    // the reference to the Doc class is in case you want to create a new Doc instance and nest it within another categor (example properties)
    // by default if no parse method is found it will attach the key value pair directly to the Doc object

    parse : {

        //params need to be added to the params bucket
        'param' : function (text) {
            var self = this;
            var match = text.match(/^\{([^}=]+)(=)?\}\s+(([^\s=]+)|\[(\S+)=([^\]]+)\])\s+(.*)/);
                             //  1      12 2      34       4   5   5 6      6  3   7  7
            if (!match) { throw new Error("Not a valid 'param' format: " + text); }
            var param = {
                name: match[5] || match[4],
                description:self.markdown(text.replace(match[0], match[7])),
                type: match[1],
                optional: !!match[2],
                'default':match[6]
            };
            self.param.push(param);
        },


        //returns should just be added as a property (there should only be one)
        'returns' : returnsFunction,
        'return' : returnsFunction,

        //requires should be added to the requires bucket
        'requires' : function (text) {
            var self = this;
            var match = text.match(/^([^\s]*)\s*([\S\s]*)/);
            self.requires.push({
                name: match[1],
                text: self.markdown(match[2])
            });
        },


        //properties should be added to the properties bucket but generated as a new Doc object
        'property' : function (text, Doc) {
            var self = this;
            var match = text.match(/^\{(\S+)\}\s+(\S+)(\s+(.*))?/);
            if (!match) {
                throw new Error("Not a valid 'property' format: " + text);
            }
            var property = new Doc({
                type: match[1],
                name: match[2],
                shortName: match[2],
                description: self.markdown(text.replace(match[0], match[4])),
                file: self.file,
                line: self.line,
                doc_api_extensions: self.doc_api_extensions
            });
            self.properties.push(property);
        },


        //eventType should propogate two properties, the type and target
        'eventType' : function (text) {
            var self = this;
            var match = text.match(/^([^\s]*)\s+on\s+([\S\s]*)/);
            //console.log("EVENT TYPE: ", text, " : ", match[1], match[2]); //this one is super custom... maybe just for angular?
            self.type = match[1];
            self.target = match[2];
        }

    },


    /*============ ADD ADDITIONAL MARKDOWN METHODS TO FIND AND REPLACE YOUR OWN SPECIAL MARKDOWN PATTERNS ===========*/

    //here we provide as many methods as we wish to find and replace markdown within the text
    //by default we provide some handy markdown replacements that are interactive within the angular UI
    //we also run it through Showdown to provide some of the basic markdown replacements

    markdown : {

        'default' : {

            order: 1, //this should typically be run first to add in the default markdown behavior
            markdown: function (text, placeholder) {

                /*============== PRIVATE VARIABLES/METHODS ===========*/

                var self = this;

                var IS_URL = /^(https?:\/\/|ftps?:\/\/|mailto:|\.|\/)/;
                var IS_ANGULAR = /^(api\/)?(angular|ng|AUTO)\./;
                var IS_HASH = /^#/;


                /*============== LET'S replace DIVS, PRE tags and INTERNAL LINKS ==========*/

                //DIV cleanup? Not sure what this does.  TODO: figure out what this does
                text = text.replace(/<div([^>]*)><\/div>/, '<div$1>\n<\/div>')

                //follow github's approach to code blocks using ```
                .replace(/```([^\n]+)\n(([^`]|`[^``]|``[^`])*)```/mgi, function(_all, codeType, code) {
                    return placeholder(
                        '<pre class="prettyprint linenums">' + code + '</pre>');
                })

                //Let's make ```text`` into <code></code>. This way there is a difference between ``text`` and `text`
                .replace(/``([^`]{1,})``/gmi, function(_, content){ return placeholder(' <code>' + content + '</code> ');})

                //Let's make `text` into <code class="plain"></code>. This way there is a difference between ``text`` and `text`
                .replace(/`([^`]{1,})`/gmi, function(_, content){ return placeholder(' <code class="plain">' + content + '</code> ');})

                //Example PRE text for pretty print
                .replace(/<pre>([\s\S]*?)<\/pre>/gmi, function(_, content){
                    return placeholder(
                        '<pre class="prettyprint linenums">' +
                            content.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                        '</pre>');
                })

                //Replace INTERNAL documentation links with an actual a tag
                .replace(/{@link\s+([^\s}]+)\s*([^}]*?)\s*}/g, function(_all, url, title){
                    var isFullUrl = url.match(IS_URL),
                        isAngular = url.match(IS_ANGULAR),
                        isHash = url.match(IS_HASH),
                        absUrl = isHash ? (self.group + '/' + self.section + '/' + url)
                            : (isFullUrl ? url : self.convertUrlToAbsolute(url));

                    if (!isFullUrl) self.links.push(absUrl);

                    return '<a href="' + absUrl + '">' +
                        (isAngular ? '<code>' : '') +
                        (title || url).replace(/^#/g, '').replace(/\n/g, ' ') +
                        (isAngular ? '</code>' : '') +
                        '</a>';
                });

                return text;
            }
        },

        'showdown' : {

            order: 10, // this typically should be run last
            markdown: function (text) {

                //Currently we use Showdown a node.js implementation of markdown
                return new Showdown.converter({ extensions : ['table'] }).makeHtml(text);
            }
        }

    },


    /*============ THIS FUNCTION WILL DETERMINE HOW THE TITLE APPEARS AT THE TOP OF THE PAGE ============*/

    heading: function (dom) {
        var self = this;
        if(self.docType == "module" || !self.shortName || self.name == "index" || (self.id && self.id == "index") ) {return false;}

        var moduleInfo = self.getModuleInfo();
        var name = self.shortName;

        if(moduleInfo.item) {
            name = moduleInfo.item;
            if(moduleInfo.subItem) {
                name = name + " [" + moduleInfo.subItem + "] ";
            }
        }

        return function() {
            this.tag('code', name);
            this.tag('span', { class: 'hint'}, function() {
              if (moduleInfo.section && self.docType != "overview") {
                this.text('( ');
                this.text(moduleInfo.section);
                this.text(' in module ');
                this.tag('code', moduleInfo.module);
                this.text(' )');
              }
            });
        };
    },


    /*============ CUSTOM RENDER METHODS FOR USING ALL THE DOC ATTRIBUTES TO SPIT OUT HTML FOR THE PARTIALS ===========*/

    html : {

        parameters: function(dom) {
            var self = this;
            dom.h('Parameters', this.param, function(param){
                dom.tag('code', { class: 'plain'}, function() {
                    dom.text(param.name);
                    if (param.optional) {
                        dom.tag('i', function() {
                            dom.text('(optional');
                            if(param['default']) {
                                dom.text('=' + param['default']);
                            }
                            dom.text(')');
                        });
                    }
                    dom.text(' – {');
                    dom.text(param.type);
                    if (param.optional) {
                        dom.text('=');
                    }
                    dom.text('} – ');
                });
                dom.html(param.description);
            });
        },


        returns: function(dom) {
            var self = this;
            if (self.returns) {
                dom.h('Returns', function() {
                    dom.tag('code', { class: 'plain'}, '{' + self.returns.type + '}');
                    dom.text('– ');
                    dom.html(self.returns.description);
                });
            }
        },


        this: function(dom) {
            var self = this;
            if (self['this']) {
                dom.h(function(dom){
                    dom.html("Method's <code class='plain'>this</code>");
                }, function(dom){
                    dom.html(self['this']);
                });
            }
        },


        function: methodFunction,
        method: methodFunction,


        property: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            dom.h('Usage', function() {
                dom.code({ class: 'plain'}, function() {
                    dom.text(self.name);
                });

                htmlMethods.returns.call(self, dom);
            });
        },


        overview: function(dom){
            var self = this;
            dom.html(self.description);
        },


        module: function(dom){
            var self = this;
            var desc = self.description;
            var name = self.name;
            dom.tag('div', {class:"hero-unit center"}, function(){
                dom.tag('h1', function(){
                    dom.text('Module: ');
                    dom.tag('span', {style:'color:#08C;'}, name);
                });
            });

            dom.html(desc);
        },


        interface: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;

            if (self.param.length) {
                dom.h('Usage', function() {
                    dom.code(function() {
                        dom.text(self.name.split('.').pop());
                        dom.text('(');
                        htmlMethods.parameterParse.call(self, dom, ', ');
                        dom.text(');');
                    });

                    htmlMethods.parameters.call(self, dom);
                    htmlMethods.this.call(self, dom);
                    htmlMethods.returns.call(self, dom);
                });
            }
            htmlMethods.method_properties_events.call(self, dom);
        },


        object: function(dom) {
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            htmlMethods.interface.call(self, dom);
        },


        /*============= THE FOLLOWING GENERATE HTML BUT ARE NOT CALLED DIRECTLY AS DOC TYPES : THEY ARE HELPERS =============*/

        method_properties_events : function(dom) {
            var self = this;

            if (self.methods.length) {
                dom.div({class:'member method'}, function(){
                    dom.h('Methods', self.methods, function(method){
                            var signature = (method.param || []).map(property('name'));
                            dom.h(method.shortName + '(' + signature.join(', ') + ')', method, function() {
                            dom.html(method.description);

                            method.doc_api_extensions.html.parameters.call(method, dom);
                            self.doc_api_extensions.html.this.call(self, dom);
                            method.doc_api_extensions.html.returns.call(method, dom);

                            dom.h('Example', method.example, dom.html);
                        });
                    });
                });
            }
            if (self.properties.length) {
                dom.div({class:'member property'}, function(){
                    dom.h('Properties', self.properties, function(property){
                        dom.h(property.shortName, function() {
                            dom.html(property.description);
                            property.doc_api_extensions.html.returns.call(property, dom);
                            dom.h('Example', property.example, dom.html);
                        });
                    });
                });
            }
            if (self.events.length) {
                dom.div({class:'member event'}, function(){
                    dom.h('Events', self.events, function(event){
                        dom.h(event.shortName, event, function() {
                            dom.html(event.description);
                            if (event.type == 'listen') {
                                dom.tag('div', {class:'inline'}, function() {
                                    dom.h('Listen on:', event.target);
                                });
                            } else {
                                dom.tag('div', {class:'inline'}, function() {
                                    dom.h('Type:', event.type);
                                });
                                dom.tag('div', {class:'inline'}, function() {
                                    dom.h('Target:', event.target);
                                });
                            }

                            event.doc_api_extensions.html.parameters.call(event, dom);
                            self.doc_api_extensions.html.this.call(self, dom);

                            dom.h('Example', event.example, dom.html);
                        });
                    });
                });
            }
        },

        parameterParse : function(dom, separator, skipFirst, prefix) {

            var sep = prefix ? separator : '';
            (this.param||[]).forEach(function(param, i){
                if (!(skipFirst && i==0)) {
                    if (param.optional) {
                        dom.text('[' + sep + param.name + ']');
                    } else {
                        dom.text(sep + param.name);
                    }
                }
                sep = separator;
            });
        }

    },

    // All the default rendering is stored in the Doc.js class. Use this in a new api to
    // Build upon those defaults
    render : {}

};