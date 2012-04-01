# jsPlumb
jsPlumb provides a means for a developer to visually connect elements on their web pages. It uses SVG or 
Canvas in modern browsers, and VML on IE 8 and below. The latest version is 1.3.8.

The project started out life on Google Code and has been hosted there for the last two years; from version 
1.3.4 onwards it also lives here on GitHub. The source repo is now being synchronised between the two.  I did
this because I didn't want to lose the project history (issues etc), and I know some people checkout the 
source from Google Code.

__All issues should be reported on Google Code until I can import everything from there at once. Thanks!__

For users upgrading from earlier versions to 1.3.x - there are a few minor backwards incompatibilities. Please see the changelog

if you're new to jsPlumb, please do take the time to read the [documentation](http://jsplumb.org/doc/usage.html). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

## Requirements
- jQuery:

jsPlumb requires jQuery 1.3.x or later; it has been tested on 1.3.2, 1.4.2, 1.4.3, 1.4.4, 1.5.0 and 1.6.0. To support dragging, you will need jQueryUI 1.7.x or 1.8.x. I've tested both.

__There is [a bug](http://bugs.jquery.com/ticket/10832) in jQuery 1.6.x and 1.7.x's SVG support for IE9__ which means that hover events do not get posted. This is quite a bummer since the default renderer for jsPlumb, from 1.3.4 onwards, is SVG, and I was hoping to encourage everyone to make use of the fact that you can use CSS with SVG to style your plumbing rather than rely on the old-skool paintStyle stuff. There is another discussion of the issue [here](http://forum.jquery.com/topic/1-6-2-broke-svg-hover-events)

- MooTools:

jsPlumb requires MooTools 1.3.x or 1.2.4 (tested on 1.3.2 and 1.2.4; it might work on other versions). To support
dragging in MooTools, you will need Drag.Move from MooTools More. jsPlumb has been tested with Drag.Move from MooTools 
More 1.3.2.1 and 1.2.4.4, but I would recommend using 1.3.2.1 as there were bugs on IE with the getPosition() 
function of MooTools, which the Drag.Move class uses.

__Firefox 11 and MooTools 1.3.x do not play well together in SVG mode__ - see [this issue](https://github.com/mootools/mootools-core/issues/2331)

- YUI3:

jsPlumb requires YUI 3.3.x (tested on 3.3.0; it actually might work on other versions). You do not need to 
include anything other than 'node' in your code that works with jsPlumb, but due to the asynchronous nature of 
module loading with YUI, you need to ensure you use jsPlumb's `ready` function to wrap your initialisation
code, or you cannot be sure that everything that is required is available:

    jsPlumb.ready(function() { 
      ...
    }); 

## jsPlumb in action
Links to various demonstrations can be found [here](http://jsplumb.org).

[TweetPlumb](http://tweetplumb.com) is a great Twitter visualisation built (I say it's great because I built it 
myself!) using jsPlumb.

## Documentation
Documentation can be found in the doc folder of the project, or you can view it online [here](http://jsplumb.org/doc/usage.html).

API documentation is in the apidoc folder of the project, and online [here](http://jsplumb.org/apidocs/).

The Bezier curve functions used by jsPlumb have been extracted to a separate project (which is also dual-hosted
between Google Code and GitHub):

[http://code.google.com/p/jsbezier](http://code.google.com/p/jsbezier)

[https://github.com/sporritt/jsBezier](https://github.com/sporritt/jsBezier)

## Tests
qUnit test suite can be found [here](http://jsplumb.org/tests/qunit-all.html)

## Twitter
The Twitter account I use for this project is [jsplumblib](http://twitter.com/jsplumblib)

..but of course things fall through the cracks with Twitter. So maybe use this instead:

## Mailing List
Sign up for the jsPlumb announcements mailing list [here](http://eepurl.com/bMuD9).

## License
All 1.x.x versions of jsPlumb are dual-licensed under both MIT and GPL version 2. 
