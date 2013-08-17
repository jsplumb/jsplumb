@doc overview
@name index
@description

# Docular Extensions

Docular can be extended in multiple way to customize the parsing, object creation, rendering, and behavior and styling of documentation. By default it ships with the "@doc" extension which provides basic parsing and rendering configurations. It also ships with the "@ngdoc" extension which extends the basics with AngularJS specific parsing and rendering functionality. Check out some of the details of the code here. This is a great place to start if you want to create your own extension.

<page-list></pager-list>


@doc overview
@name Default Doc API
@id defaultDocApi
@description

This is the skeleton of the "@doc" plugin without much of the main logic for the parsing and rendering methods. This gives you an idea of how documents are parsed, rendered, and grouped. For example, the "layout" configuration provides information for how non-overview documentation can be grouped within a module ('classes', 'globals').

<pre>
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
            ...
        },


        //returns should just be added as a property (there should only be one)
        'returns' : returnsFunction,
        'return' : returnsFunction,

        //requires should be added to the requires bucket
        'requires' : function (text) {
            ...
        },


        //properties should be added to the properties bucket but generated as a new Doc object
        'property' : function (text, Doc) {
            ...
        },


        //eventType should propogate two properties, the type and target
        'eventType' : function (text) {
            ...
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
                ...
            }
        },

        'showdown' : {

            order: 10, // this typically should be run last
            markdown: function (text) {
                ...
            }
        }

    },


    /*============ THIS FUNCTION WILL DETERMINE HOW THE TITLE APPEARS AT THE TOP OF THE PAGE ============*/

    heading: function (dom) {
        ...
    },


    /*============ CUSTOM RENDER METHODS FOR USING ALL THE DOC ATTRIBUTES TO SPIT OUT HTML FOR THE PARTIALS ===========*/

    html : {

        parameters: function(dom) {
            ...
        },


        returns: function(dom) {
            ...
        },


        this: function(dom) {
            ...
        },


        function: methodFunction,
        method: methodFunction,


        property: function(dom){
            ...
        },


        overview: function(dom){
            ...
        },


        module: function(dom){
            ...
        },


        interface: function(dom){
            ...
        },


        object: function(dom) {
            ...
        },


        /*============= THE FOLLOWING GENERATE HTML BUT ARE NOT CALLED DIRECTLY AS DOC TYPES : THEY ARE HELPERS =============*/

        method_properties_events : function(dom) {
            ...
        },

        parameterParse : function(dom, separator, skipFirst, prefix) {
            ...
        }

    },

    // All the default rendering is stored in the Doc.js class. Use this in a new api to
    // Build upon those defaults
    render : {}

};
</pre>


@doc overview
@name Angular Doc API
@id angularDocApi
@description

This is the skeleton of the "@ngdoc" plugin without much of the main logic for the parsing and rendering methods. This gives you an idea of how documents are parsed, rendered, and grouped. For example, the "layout" configuration provides information for how non-overview documentation can be grouped within a module ('directive', 'filter', 'service', 'type').

<pre>
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
    ...
};

var trim = function (text) {
    ...
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
                ...
            }
        }

    },


    /*============ THIS FUNCTION WILL DETERMINE HOW THE TITLE APPEARS AT THE TOP OF THE PAGE ============*/

    //heading : function (dom) {}  Let's use the one provided by the default api


    /*============ CUSTOM RENDER METHODS FOR USING ALL THE DOC ATTRIBUTES TO SPIT OUT HTML FOR THE PARTIALS ===========*/

    html : {

        function: function(dom){
            ...
        },


        directive: function(dom){
            ...
        },


        filter: function(dom){
            ...
        },


        service: function(dom) {
            ...
        },


        inputType: function(dom){
            ...
        },


        directiveInfo: function(dom) {
            ...
        }

    },


    render : {

        // lets add another section in the partial called 'example' that adds any example
        'example' : {
            order: 1, // you can specify an order here
            render: function (dom) {
                ...
            }
        }

    }


};
</pre>