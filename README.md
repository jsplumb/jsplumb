# jsPlumb

jsPlumb provides a means for a developer to visually connect elements on their web pages. It uses SVG and runs on all browsers
from IE9 and later. 

The final version of jsPlumb to support IE8 was 1.7.10. You can still get 1.7.10 from a tag, if you need it. 

If you're new to jsPlumb, please do take the time to read the [documentation](http://jsplumb.github.io/jsplumb/). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project.
Issues reported for the Toolkit edition in this issue tracker will be deleted.

## Documentation

For the Community edition the documentation can now be found here:

[http://jsplumb.github.io/jsplumb/](http://jsplumb.github.io/jsplumb/)

## Changelog

Can be found at [http://jsplumb.github.io/jsplumb/changelog.html](http://jsplumb.github.io/jsplumb/changelog.html)

## Installation

```
npm install jsplumb
```

NOTE: jsPlumb does not follow strict semantic versioning.  It is not at all recommended that you use wildcards when 
specifying a dependency on jsPlumb.  The given command will install jsPlumb version using a caret for wildcard, eg `^2.9.0` - you 
might want to take off the caret.

jsPlumb does not follow strict semantic versioning largely because of the stipulation that breaking changes must 
result in the major version being bumped. A major version implies something fundamental has occurred. The bump from 
1.7.10 to 2.0.0 in jsPlumb was caused by the removal of the VML renderer, meaning IE6 and IE8 were no longer supported. You may 
say, a-ha! A breaking change! And you would be right; that was a breaking change. But a new major version might also occur 
when a new capability is added that doesn't affect existing functionality. And not every breaking change constitutes a fundamental 
change in the library itself. This note about semver was added to jsPlumb, for example, due to a discussion about how the `stop` 
event behaviour in the underlying drag library - Katavorio - had changed. Semver would say that the major version should have 
been bumped. But the change was not something fundamental. No capabilities had been added or removed...just some variables had been 
shuffled around.

Maybe you agree with this viewpoint. Maybe you don't.


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
jsPlumb uses GitHub's issue tracker for enhancements and bugs.  A losing battle was fought against the usage of Github 
for questions; now it seems to be the default, and the Google group is no longer in use.

## Requirements

No external dependencies.

## jsPlumb in action

Links to various demonstrations can be found [here](https://jsplumbtoolkit.com).

## jsPlumb Helper Projects

- Bezier curve functions:

[https://github.com/jsplumb/jsBezier](https://github.com/jsplumb/jsBezier)

- Simple geometry functions:

[https://github.com/jsplumb/biltong](https://github.com/jsplumb/biltong)

- Drag+drop:

[https://github.com/jsplumb/katavorio](https://github.com/jsplumb/katavorio)

- Events:

[https://github.com/jsplumb/mottle](https://github.com/jsplumb/mottle)

## Tests
There is a full suite of unit tests checked in to the `test` and `dist/test` directories.

## Twitter

Please don't.

## Mailing List
Sign up for the jsPlumb announcements mailing list [here](http://eepurl.com/bMuD9).

## License
All 1.x.x and 2.x.x versions of jsPlumb Community edition are dual-licensed under both MIT and GPLv2. 
