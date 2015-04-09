# jsPlumb
jsPlumb provides a means for a developer to visually connect elements on their web pages. It uses SVG or 
Canvas in modern browsers, and VML on IE 8 and below. The latest version is 1.7.6; this will be the final version 
(apart from bugfix releases in 1.7.x) to support IE8. The next major release will be 2.0.0, and this will work only
 in modern browsers that support SVG. 

**Note** It is recommended that you use vanilla jsPlumb wherever possible: it's faster than the jQuery version, it offers 
more features (multiple element dragging, multiple scopes), and since the event handling and drag/drop code are also projects 
managed by jsPlumb, you're more likely to get a feature request for those sorts of things to happen. Plus the jQuery version may
well disappear at some stage in the future.

If you're new to jsPlumb, please do take the time to read the [documentation](http://jsplumb.org/doc). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

## Project Structure
At any time there is a built version in the `dist` directory, which contains the concatenated and minified files, as well as a full set of demos and tests, and there is a version under development in `src`.  If taking something that is working and adapting it for your needs is what you want to do, use the files in the `dist` directory.  If you need to work directly with the version in development - maybe there's a bug fix you need or whatever - you need the files in the `src` directory.

Note that the demos in the `demos` directory are always pointing at the current development version, and therefore have a long list of imports.  

## Issues
jsPlumb uses GitHub's issue tracker for enhancements and bugs.  But please do check the [Google Group](https://groups.google.com/forum/?fromgroups#!forum/jsplumb) before posting an issue, particularly if you're just asking a question.

## Requirements
- Vanilla

Vanilla jsPlumb (`dom.jsPlumb-x.x.x.js`) has no external dependencies and offers support for touch devices out of the box. 
- jQuery:

jsPlumb requires jQuery 1.3.x or later; it has been tested on 1.3.2, 1.4.x, 1.5.x, 1.6.x, 1.7.x, 1.8.x and 1.9.x. To support dragging, you will need jQueryUI 1.7.x or 1.8.x. NOTE: jQuery 1.8.x only works with jQueryUI 1.8.22 and above.

__There is a bug in jQuery 1.6.x and 1.7.x's SVG support for IE9__ - see [this issue](http://bugs.jquery.com/ticket/10832). It means that mouse events do not get posted. There is another discussion of the issue [here](http://forum.jquery.com/topic/1.7.4-broke-svg-hover-events).
This issue is fixed in jQuery 1.8.


## jsPlumb in action
Links to various demonstrations can be found [here](http://jsplumb.org).

## Documentation
Documentation can be found in the doc folder of the project, or you can view it online [here](http://jsplumb.org/doc).

API documentation is in the apidoc folder of the project, and online [here](http://jsplumb.org/apidocs/).

## jsPlumb Helper Projects

- Bezier curve functions:

[https://github.com/sporritt/jsBezier](https://github.com/sporritt/jsBezier)

- Simple geometry functions:

[https://github.com/jsplumb/biltong](https://github.com/jsplumb/biltong)

- Drag+drop:

[https://github.com/jsplumb/katavorio](https://github.com/jsplumb/katavorio)

- Events:

[https://github.com/jsplumb/mottle](https://github.com/jsplumb/mottle)

## Tests
There is a full suite of unit tests checked in to the `test` and `dist/test` directories.

## Twitter
The Twitter account for this project is [jsplumblib](http://twitter.com/jsplumblib)

..but of course things fall through the cracks with Twitter. So maybe use this instead:

## Mailing List
Sign up for the jsPlumb announcements mailing list [here](http://eepurl.com/bMuD9).

## License
All 1.x.x versions of jsPlumb are dual-licensed under both MIT and GPLv2. 
