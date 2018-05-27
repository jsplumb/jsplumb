# jsPlumb

jsPlumb provides a means for a developer to visually connect elements on their web pages. It uses SVG and runs on all browsers
from IE9 and later. 

The final version of jsPlumb to support IE8 was 1.7.10. You can still get 1.7.10 from a tag, if you need it. 

If you're new to jsPlumb, please do take the time to read the [documentation](https://jsplumbtoolkit.com/docs.html). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project.
Issues reported for the Toolkit edition in this issue tracker will be cleared.

## Installation

```
npm install jsplumb
```

We package the following files:

```javascript
"files": [
    "index.d.ts",
    "dist/js/jsplumb.js",
    "dist/js/jsplumb.min.js",
    "css/jsplumbtoolkit-defaults.css"
  ],
```

We recommend including the `jsplumbtoolkit-defaults.css` file to begin with, as it provides some sane default values.


## Typescript
An `index.d.ts` is included in the npm package.

## Issues
jsPlumb uses GitHub's issue tracker for enhancements and bugs.  But please do check the 
[Google Group](https://groups.google.com/forum/?fromgroups#!forum/jsplumb) before posting an issue, particularly if 
you're just asking a question.

## Requirements

No external dependencies.

## jsPlumb in action

Links to various demonstrations can be found [here](https://jsplumbtoolkit.com).

## Documentation

Documentation can be found in the doc folder of the project, or you can view it online 
[here](https://jsplumbtoolkit.com/community/doc/home.html).

API documentation is in the apidoc folder of the project, and online [here](https://jsplumbtoolkit.com/community/apidocs/index.html).

## jsPlumb Helper Projects

- Bezier curve functions:

[https://github.com/jsplumb/jsBezier](https://github.com/sporritt/jsBezier)

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
All 1.x.x and 2.x.x versions of jsPlumb Community edition are dual-licensed under both MIT and GPLv2. 
