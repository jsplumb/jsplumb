
/*========== DEPENDENCIES ==========*/

var nodeExtend = require('node.extend');
var colors = require('colors');

var DOM = require('./dom.js').DOM;
var htmlEscape = require('./dom.js').htmlEscape;

var doc_utils = require('./doc_utils.js');


/*========== PRIVATE VARIABLES AND METHODS ==========*/

var globalID = 0;
var NEW_LINE = /\n\r?/;
var ISDOC = /^(doc|doc-\S+)/i;
var HASGROUPSECTION = /^[^\.\:]{1,}\/(.*){1,}/i;

var docId_patterns =  {
    module : '^([^\\.\\:]{1,})',
    section : '^[^\\.\\:]{1,}\\.([^\\.\\:]{1,})',
    item : '^[^\\.\\:]{1,}\\.[^\\.\\:]{1,}\\:([^\\.]{1,})',
    subItem: '^[^\\.\\:]{1,}\\.[^\\.\\:]{1,}\\:[^\\.]{1,}\\.(.*)$'
};

var COMPARE_ORDER = function (a, b) {
    var val = 'order';
    if (a[val] < b[val]) {
        return -1;
    } else if (a[val] > b[val]) {
        return 1;
    } else {
        return 0;
    }
};

/*========== Doc CLASS DEFINITION ==========*/

/**
 * [Doc description]
 * @param {[type]} configs_in [description]
 */
var Doc = function (configs_in) {

    var defaults = {

        //file information
        text: '',
        file: '',
        line: '',

        //category information
        group: 'main',
        section: 'section',

        //types
        requires: [],
        param: [],
        properties: [],
        methods: [],
        events: [],
        links: [],

        //what doc_api are we using?
        doc_api_extensions: {}
    };

    //merge in the defaults and configs
    nodeExtend(this, defaults, configs_in);

    if(!this.doc_api_extensions) {
        console.log("No doc_api extensions provided".red);
    }
};


Doc.METADATA_IGNORE = (function() {
  var words = require('fs').readFileSync(__dirname + '/ignore.words', 'utf8');
  return words.toString().split(/[,\s\n\r]+/gm);
})();


Doc.prototype = {

    /**
     * THIS PROTOTYPE METHOD EXTACTS RELEVANT KEYWORDS FOR SEARCHING IN THE TEXT AND DESCRIPTION FIELDS
     * @return {[type]} [description]
     */
    keywords: function keywords() {

        var kwords = {};
        var words = [];
        Doc.METADATA_IGNORE.forEach(function(ignore){ kwords[ignore] = true; });

        function extractWords(text) {
            var tokens = text.toLowerCase().split(/[\.\s,`'"#]+/mg);
            tokens.forEach(function(key){
                var match = key.match(/^((ng:|[\$_a-z])[\w\-_]+)/);
                if (match){
                    key = match[1];
                    if (!kwords[key]) {
                        kwords[key] = true;
                        words.push(key);
                    }
                }
            });
        }

        extractWords(this.text);
        this.properties.forEach(function(prop) {
          extractWords(prop.text || prop.description || '');
        });
        this.methods.forEach(function(method) {
          extractWords(method.text || method.description || '');
        });
        words.sort();
        return words.join(' ');
    },

    getModuleInfo: function () {
        var self = this;

        var str = self.id;
        var results = {};

        for(var pat in docId_patterns) {
            var reg = new RegExp(docId_patterns[pat]);
            var match;
            if(match = str.match(reg)){
                results[pat] = match[1];
            }
        }

        var args = [self.id, results.module || '', results.section || '', results.item || '', results.subItem || ''];

        // by default we just use the naming split to determine module and section
        var moduleInfo = {module: args[1], section: args[2], item: args[3], subItem: args[4]};

        var layout = self.doc_api_extensions.layout;

        // test to see if the doc_api wants to set a different module
        if(layout.module.getModule){
            moduleInfo.module = layout.module.getModule.apply(self, args);
        }

        // now we test the doc_api to see if there are special instructions for setting the section
        for (var sect in layout.sections) {
            if(layout.sections.hasOwnProperty(sect) && layout.sections[sect].match) {
                if(layout.sections[sect].match.apply(self, args)){
                    moduleInfo.section = sect;
                    return moduleInfo;
                }
            }
        }

        // no sections modifications made so just return the default
        return moduleInfo;
    },

    /**
    * Converts relative urls (without section) into absolute
    * Absolute url means url with group and section (to mirror folder structure for partials)
    */
    convertUrlToAbsolute: function(url) {

        //if it is at the root level
        if (url.substr(-1) == '/') return 'documentation/' + this.group + '/' + url + 'index';

        //if it is not at the root
        if (url.match(/\//)) return 'documentation/' + this.group + '/' + url;

        //only legacy angular documentation will need this because it assumes that no directory means stick it in api
        return 'documentation/' + this.group + '/' + this.section + '/' + url;
    },


    /**
     * This accepts text and manipulates it using provided functions in the doc_api_extensions
     */
    markdown: function (text) {

        var self = this;
        var mDown;

        var seq = 0;
        var placeholderMap = {};
        function placeholder(text_in) {
            var id = 'REPLACEME' + (seq++);
            placeholderMap[id] = text_in;
            return id;
        }

        //if there is no text, there isn't anything to markdown
        if(!text) { return; }

        var markdownList = [];
        for (var markdownId in self.doc_api_extensions.markdown) {
            markdownList.push({
                id: markdownId,
                order: self.doc_api_extensions.markdown[markdownId].order || 9999,
                markdown: self.doc_api_extensions.markdown[markdownId].markdown
            });
        }

        //sort the markdownList by rank and apply the render function
        markdownList.sort(COMPARE_ORDER);
        for(var i=0; i < markdownList.length; i++) {
            try {
                text = markdownList[i].markdown.call(self, text, placeholder);
            } catch (e) { console.log("ERROR: ".red + 'Markdown error for doc: ' + (self.id + '').red + ' in markdown function ' + (markdownList[i].id + '').red, e); }
        }

        //put back in our markup what was protected
        text = text.replace(/(?:<p>)?(REPLACEME\d+)(?:<\/p>)?/g, function(_, id) {
            return placeholderMap[id];
        });

        return text;
    },


    /**
     * [parse description]
     * @return {[type]} [description]
     */
    parse: function() {

        /*=========== PRIVATE VARIABLES AND METHODS =============*/

        var self = this;

        //Given a @name and text to go along with it, parse it into key value pairs on the object
        var processKeyValuePair = function (atKey, atValue) {

            var match;
            var text = doc_utils.trim(atValue.join('\n'));

            //for backwards compatability, first check to see if this an angular doctype
            if(atKey == "ngdoc") {
                self['docType'] = atValue[0];
                return;
            }

            //check if it is any other kind of doc-type
            if(match = atKey.match(ISDOC)) {
                self['docType'] = atValue[0];
                return;
            }

            //otherwise just use the doc_api_extension to see if there is some custom preprocessing of the key value pair
            if(self.doc_api_extensions.parse && self.doc_api_extensions.parse[atKey]){

                //call the extensions parse in the context of this doc and pass it the text
                //it can choose to add new attributes to the self or add to its own bucket etc....
                self.doc_api_extensions.parse[atKey].call(self, text, Doc);

            } else {

                //the absolute default is if there is no registered parse method in the api
                self[atKey] = text;
            }
        };


        /*=========== FIRST WE PARSE EACH LINE AND EXTRACT KEY VALUE PAIRS TO BE PRE PROCESSED =============*/

        var parseKey;
        var parseValue;
        var match;

        //for each NEW_LINE scan for key value pairs proccess each key value pair
        self.text.split(NEW_LINE).forEach(function(line){

            // we found @parsekey...
            if ((match = line.match(/^\s*@(\w+)(\s+(.*))?/))) {

                // then we have collected all attributes from the previous element so flush it
                if(parseKey){
                    processKeyValuePair(parseKey, parseValue);
                }

                // store the name of the attribute
                parseKey = match[1];

                // clear the atText
                parseValue = [];

                // if a value was generated in line push it into the atText
                if(match[3]) parseValue.push(match[3]);

            } else {
                if (parseKey) {
                    // this whole line is a part of this keys value
                    parseValue.push(line);
                }
            }
        });

        // since there shouldn't be another grouping after the last @doc- group, then we flush the last one out
        processKeyValuePair(parseKey, parseValue);


        /*=========== NOW WE SET SET OR ALTER A MANDAOTRY SET OF KEY VALUE PAIRS WE NEED FOR WRITING / RENDERING =============*/

        // give it a shortName
        this.shortName = this.name.split(/[\.:#]/).pop().trim();

        // give it an id (based on the file or the name)
        this.id = this.id || // if we have an id just use it
          ((( doc_utils.normalizeFile(this.file) || '').match(/.*\/([^\/]*)\.ngdoc/)||{})[1]) || // try to extract it from file name
          this.name; // default to name

        // set the description by generating markdown for the description
        this.description = this.markdown(this.description);

        // if there is a this attribute mark it down
        this['this'] = this.markdown(this['this']);

        // we are done parsing and collecting attributes
        return this;
    },


    html: function() {

        var dom = new DOM();
        var self = this;

        var notice = function (name, legend, msg){
            if (self[name] === undefined) return;
            dom.tag('fieldset', {'class':name}, function(dom){
                dom.tag('legend', legend);
                dom.text(msg);
            });
        };

        //first start with the title and then move on to other sections
        dom.h(self.doc_api_extensions.heading.call(self, dom), function() {


            /*============ RENDER - DEPRICATED ============*/
            notice('deprecated', 'Deprecated API', self.deprecated);


            /*============ RENDER - DESCRIPTION ============*/
            if (self.docType != 'overview' && self.docType != 'module') {
                dom.h('Description', self.description, dom.html);
            }


            /*============ RENDER - DEPENDENCIES ============*/
            dom.h('Dependencies', self.requires, function(require){
                dom.tag('code', function() {

                    //we allow requires to link across group sections, although it is probably best to keep requires within the same section
                    if(require.name.match(HASGROUPSECTION)){
                        dom.tag('a', {href: 'documentation/' + self.group + '/' + require.name}, require.name);
                    } else {
                        dom.tag('a', {href: 'documentation/' + self.group + '/' + self.section + '/' + require.name}, require.name);
                    }

                });
                dom.html(require.text);
            });


            /*============ RENDER - DOC MAIN DOC TYPE HTML ============*/

            try{
                (self.doc_api_extensions.html[self.docType] || function() {
                    throw new Error("Don't know how to format docType: ".yellow + "'" + (self.docType || "undfined") + "'");
                }).call(self, dom);
            } catch (e) {console.log("WARNING: ".yellow + " doc_api html method failure for '"+ (self.docType || "undefined").red + "' in doc_api: " + self.doc_api_extensions.identifier.red ,e); }


            /*============ RENDER - DOC TYPE SPECIFIC RENDER FUNCTIONS - ORDER BY RANK ============*/

            var renderList = [];
            for (var renderId in self.doc_api_extensions.render) {
                renderList.push({
                    id: renderId,
                    order: self.doc_api_extensions.render[renderId].order || 0,
                    render: self.doc_api_extensions.render[renderId].render
                });
            }

            //sort the renderList by rank and apply the render function
            renderList.sort(COMPARE_ORDER);
            for(var i=0; i < renderList.length; i++) {
                try {
                    renderList[i].render.call(self, dom);
                } catch (e) { console.log("WARNING: ".yellow + " Error rendering expanded render method '" + enderList[i].id + "' ", e); }
            }


        });

        return dom.toString();
    }

};


/*========== EXPORT JUST THE DOC OBJECT/CLASS ==========*/

module.exports = Doc;

