"use strict";

/*=========== DEPENDENCIES =============*/

var Example = require('./resources/example.js').Example;


/*=========== PRIVATE VARIABLES AND METHODS ===========*/

var DOCS_PATH = /^\/(documentation)/;
var INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;
var GLOBALS = /^angular\.([^\.]+)$/;
var MODULE = /^((?:(?!^angular\.)[^\.])+)$/;
var MODULE_MOCK = /^angular\.mock\.([^\.]+)$/;
var MODULE_DIRECTIVE = /^((?:(?!^angular\.)[^\.])+)\.directive:([^\.]+)$/;
var MODULE_DIRECTIVE_INPUT = /^((?:(?!^angular\.)[^\.])+)\.directive:input\.([^\.]+)$/;
var MODULE_FILTER = /^((?:(?!^angular\.)[^\.])+)\.filter:([^\.]+)$/;
var MODULE_SERVICE = /^((?:(?!^angular\.)[^\.])+)\.\$([^\.]+?)(Provider)?$/;
var MODULE_TYPE = /^((?:(?!^angular\.)[^\.])+)\..+\.([A-Z][^\.]+)$/;

var DASH_CASE_REGEXP = /[A-Z]/g;
var BOOLEAN_ATTR = {
    'multiple': true,
    'selected': true,
    'checked': true,
    'disabled': true,
    'readOnly': true,
    'required': true
};

var dashCase = function (name){
    return name.replace(DASH_CASE_REGEXP, function(letter, pos) {
        return (pos ? '-' : '') + letter.toLowerCase();
    });
};

var trim = function (text) {
    var MAX_INDENT = 9999;
    var empty = RegExp.prototype.test.bind(/^\s*$/);
    var lines = text.split('\n');
    var minIndent = MAX_INDENT;
    var indentRegExp;
    var ignoreLine = (lines[0][0] != ' '  && lines.length > 1);
    // ignore first line if it has no indentation and there is more than one line

    lines.forEach(function(line){
        if (ignoreLine) {
            ignoreLine = false;
            return;
        }

        var indent = line.match(/^\s*/)[0].length;
        if (indent > 0 || minIndent == MAX_INDENT) {
            minIndent = Math.min(minIndent, indent);
        }
    });

    indentRegExp = new RegExp('^\\s{0,' + minIndent + '}');

    for ( var i = 0; i < lines.length; i++) {
        lines[i] = lines[i].replace(indentRegExp, '');
    }

    // remove leading lines
    while (empty(lines[0])) {
        lines.shift();
    }

    // remove trailing
    while (empty(lines[lines.length - 1])) {
        lines.pop();
    }
    return lines.join('\n');
};

/*============ EXPORT THE DOC API CONFIGURATION ============*/

module.exports =  {

    identifier: "ngdoc",
    title: "Angular Documentation",
    layout: {
        module:{
            title: "module",
            link: "documentation/angular/guide/module",
            getModule: function (id, module) {
                if(id == 'angular.Module'){
                    return "ng";
                } else if (id.match(MODULE_MOCK)) {
                    return "ngMock";
                } else if (id.match(GLOBALS)){
                    return "ng";
                } else {
                    return module;
                }
            }
        },
        sections:{
            "directive":{
                order: 1,
                title: "directive",
                link: "documentation/angular/guide/directive",
                match: function (id, module, section, item, subItem) {
                    return (!id.match(MODULE_TYPE)) && section == "directive";
                }
            },
            "service": {
                order: 2,
                title: "service",
                link: "documentation/angular/guide/dev_guide.services",
                match: function (id, module, section, item, subItem) {
                    return id.match(MODULE_SERVICE);
                }
            },
            "filter":{
                order: 3,
                title: "filter",
                link: "documentation/angular/guide/dev_guide.templates.filters",
                match: function (id, module, section, item, subItem) {
                    return id.match(MODULE_FILTER);
                }
            },
            "type":{
                order: 4,
                title: "Types",
                link:"documentation/angular/guide/types",
                match: function (id, module, section, item, subItem) {
                    return id.match(MODULE_TYPE) || id == "angular.IModule";
                }
            },
            "global": {
                order: 5,
                title: "global APIs",
                match: function (id, module, section, item, subItem) {
                    return (id.match(GLOBALS) || id.match(MODULE_MOCK));
                }
            }
        }
    },


    ui_resources : {
        js : ['resources/ui/api_ui_behavior.js'],
        css : ['resources/ui/api_ui_styles.css']
    },


    parse : {

        //we need to run it through our special markdown functions
        'example' : function (text) {
            var self = this;
            self.example = self.markdown(text);
        }

    },


    markdown : {

        /*=========== ANGULAR PROVIDES SPECIAL MARKDOWN SETUP FOR EXAMPLES ==========*/

        'angular' : {

            order: 2,
            markdown : function (text, placeholder) {

                /*=========== PRIVATE PROPERTIES / METHODS ==========*/

                var self = this;

                //now we split thet text into an array of parts, parts that are equal to the matches below and parts with no matches with the parts below
                var parts = trim(text).split(/(<doc:example(\S*).*?>[\s\S]*?<\/doc:example>|<example[^>]*>[\s\S]*?<\/example>)/);

                parts.forEach(function(text, i) {

                    parts[i] = (text || '')

                    //Example version 1
                    .replace(/<example(?:\s+module="([^"]*)")?(?:\s+deps="([^"]*)")?>([\s\S]*?)<\/example>/gmi, function(_, module, deps, content) {

                        var example = new Example(self.scenarios);

                        example.setModule(module);
                        example.addDeps(deps);
                        content.replace(/<file\s+name="([^"]*)"\s*>([\s\S]*?)<\/file>/gmi, function(_, name, content) {
                            example.addSource(name, content);
                        });
                        return placeholder(example.toHtml());
                    })

                    //Example version 2
                    .replace(/^<doc:example(\s+[^>]*)?>([\s\S]*)<\/doc:example>/mi, function(_, attrs, content) {

                        var html, script, scenario,
                        example = new Example(self.scenarios);

                        example.setModule((attrs||'module=""').match(/^\s*module=["'](.*)["']\s*$/)[1]);
                        content.
                            replace(/<doc:source(\s+[^>]*)?>([\s\S]*)<\/doc:source>/mi, function(_, attrs, content) {
                                example.addSource('index.html', content.
                                    replace(/<script>([\s\S]*)<\/script>/mi, function(_, script) {
                                        example.addSource('script.js', script);
                                        return '';
                                    }).
                                    replace(/<style>([\s\S]*)<\/style>/mi, function(_, style) {
                                        example.addSource('style.css', style);
                                        return '';
                                    })
                                );
                            }).
                            replace(/(<doc:scenario>)([\s\S]*)(<\/doc:scenario>)/mi, function(_, before, content){
                                example.addSource('scenario.js', content);
                            });

                        return placeholder(example.toHtml());
                    });

                });

                //rejoin the text
                text = parts.join('');

                return text;
            }
        }

    },


    /*============ THIS FUNCTION WILL DETERMINE HOW THE TITLE APPEARS AT THE TOP OF THE PAGE ============*/

    //heading : function (dom) {}  Let's use the one provided by the default api


    /*============ CUSTOM RENDER METHODS FOR USING ALL THE DOC ATTRIBUTES TO SPIT OUT HTML FOR THE PARTIALS ===========*/

    html : {

        function: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            var name = self.name.match(/^angular(\.mock)?\.(\w+)$/) ? self.name : self.name.split(/\./).pop();

            dom.h('Usage', function() {
                dom.code(function() {
                    dom.text(name);
                    dom.text('(');
                    htmlMethods.parameterParse.call(self, dom, ', ');
                    dom.text(');');
                });

                htmlMethods.parameters.call(self, dom);
                htmlMethods.this.call(self, dom);
                htmlMethods.returns.call(self, dom);
            });
            htmlMethods.method_properties_events.call(self, dom);
        },


        directive: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;

            dom.h('Usage', function() {
                var restrict = self.restrict || 'AC';
                if (restrict.match(/E/)) {
                    dom.text('as element (see ');
                    dom.tag('a', {href:'guide/ie'}, 'IE restrictions');
                    dom.text(')');
                    dom.code(function() {
                        dom.text('<');
                        dom.text(dashCase(self.shortName));
                        renderParams('\n       ', '="', '"');
                        dom.text('>\n</');
                        dom.text(dashCase(self.shortName));
                        dom.text('>');
                    });
                }
                if (restrict.match(/A/)) {
                    var element = self.element || 'ANY';
                    dom.text('as attribute');
                    dom.code(function() {
                        dom.text('<' + element + ' ');
                        dom.text(dashCase(self.shortName));
                        renderParams('\n     ', '="', '"', true);
                        dom.text('>\n   ...\n');
                        dom.text('</' + element + '>');
                    });
                }
                if (restrict.match(/C/)) {
                    dom.text('as class');
                    var element = self.element || 'ANY';
                    dom.code(function() {
                        dom.text('<' + element + ' class="');
                        dom.text(dashCase(self.shortName));
                        renderParams(' ', ': ', ';', true);
                        dom.text('">\n   ...\n');
                        dom.text('</' + element + '>');
                    });
                }
                htmlMethods.directiveInfo.call(self, dom);
                htmlMethods.parameters.call(self, dom);
            });

            //use the inherited method_properties_events method
            htmlMethods.method_properties_events.call(self, dom);

            function renderParams(prefix, infix, suffix, skipSelf) {
                (self.param||[]).forEach(function(param) {
                    var skip = skipSelf && (param.name == self.shortName || param.name.indexOf(self.shortName + '|') === 0);
                    if (!skip) {
                        dom.text(prefix);
                        dom.text(param.optional ? '[' : '');
                        var parts = param.name.split('|');
                        dom.text(parts[skipSelf ? 0 : 1] || parts[0]);
                    }

                    if (BOOLEAN_ATTR[param.name]) {
                        dom.text(param.optional ? ']' : '');
                    } else {
                        dom.text(BOOLEAN_ATTR[param.name] ? '' : infix );
                        dom.text(('{' + param.type + '}').replace(/^\{\'(.*)\'\}$/, '$1'));
                        dom.text(suffix);
                        dom.text(param.optional && !skip ? ']' : '');
                    }
                });
            }
        },


        filter: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            dom.h('Usage', function() {
                dom.h('In HTML Template Binding', function() {
                    dom.tag('code', function() {
                        if (self.usage) {
                            dom.text(self.usage);
                        } else {
                            dom.text('{{ ');
                            dom.text(self.shortName);
                            dom.text('_expression | ');
                            dom.text(self.shortName);

                            //let's use the inherited parameterParse from the default api
                            htmlMethods.parameterParse.call(self, dom, ':', true);

                            dom.text(' }}');
                        }
                    });
                });

                dom.h('In JavaScript', function() {
                    dom.tag('code', function() {
                        dom.text('$filter(\'');
                        dom.text(self.shortName);
                        dom.text('\')(');

                        //use the inherited parameter parse method
                        htmlMethods.parameterParse.call(self, dom, ', ');

                        dom.text(')');
                    });
                });

                htmlMethods.parameters.call(self, dom);
                htmlMethods.this.call(self, dom);
                htmlMethods.returns.call(self, dom);
            });
        },


        service: function(dom) {
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            htmlMethods.interface.call(self,dom);
        },


        inputType: function(dom){
            var self = this;
            var htmlMethods = self.doc_api_extensions.html;
            dom.h('Usage', function() {
                dom.code(function() {
                    dom.text('<input type="' + self.shortName + '"');
                    (self.param||[]).forEach(function(param){
                        dom.text('\n      ');
                        dom.text(param.optional ? ' [' : ' ');
                        dom.text(dashCase(param.name));
                        dom.text(BOOLEAN_ATTR[param.name] ? '' : '="{' + param.type + '}"');
                        dom.text(param.optional ? ']' : '');
                    });
                    dom.text('>');
                });
                htmlMethods.parameters.call(self, dom);
            });
        },


        directiveInfo: function(dom) {
            var self = this;
            var list = [];

            if (self.scope !== undefined) {
                list.push('This directive creates new scope.');
            }
            if (self.priority !== undefined) {
                list.push('This directive executes at priority level ' + self.priority + '.');
            }

            if (list.length) {
                dom.h('Directive info', function() {
                    dom.ul(list);
                });
            }
        }

    },


    render : {

        // lets add another section in the partial called 'example' that adds any example
        'example' : {
            order: 1, // you can specify an order here
            render: function (dom) {
                var self = this;
                dom.h('Example', self.example, dom.html);
            }
        }

    }


};