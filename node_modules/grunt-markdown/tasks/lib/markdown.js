/*
 * grunt-markdown
 * https://github.com/treasonx/grunt-markdown
 *
 * Copyright (c) 2012 James Morrin
 * Licensed under the MIT license.
 */

'use strict';

// external libs
var markdown = require('marked');
var hljs = require('highlight.js');
var _ = require('lodash');

exports.init = function(grunt) {
  var exports = {};

  exports.markdown = function(src, options, template) {

    var html = null;
    var codeLines = options.codeLines;
    var shouldWrap = codeLines && codeLines.before && codeLines.after;

    function wrapLines(code) {
      var out = [];
      var before = codeLines.before;
      var after = codeLines.after;
      code = code.split('\n');
      code.forEach(function(line) {
        out.push(before+line+after);
        });
      return out.join('\n');
    }

    if(typeof options.highlight === 'string') {
      if(options.highlight === 'auto') {
        options.highlight = function(code) {
          var out = hljs.highlightAuto(code).value;
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      } else if (options.highlight === 'manual') {
        options.highlight = function(code, lang) {
          var out = code;
          try {
            out = hljs.highlight(lang, code).value;
          } catch(e) {
            out = hljs.highlightAuto(code).value;
          }
          if(shouldWrap) {
            out = wrapLines(out);
          }
          return out;
        };
      }

    }

    markdown.setOptions(options);

    grunt.verbose.write('Marking down...');

    html = markdown(src);

    return _.template(template, {content:html});

  };

  return exports;
};

