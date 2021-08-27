# jsPlumb

If you're new to jsPlumb, please do take the time to read the [documentation](https://docs.jsplumbtoolkit.com/community/). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project.
Issues reported for the Toolkit edition in this issue tracker will be deleted.


## Packages

One major change between 5.x and 2.x is that jsPlumb is now broken up into a number of smaller packages. This repository contains the code for all of these packages, but they are published on npm separately:

- `@jsplumb/util` This is the equivalent to what was always the `jsPlumbUtil` member on the window (and in fact, if you use the umd build, still is). This package has no external dependencies.

- `@jsplumb/core` Core functionality for jsPlumb - contains type definitions of Endpoints, Anchors and Connector, as well as as the base definition of a connector segment, manages connections/endpoints and their drawing, but has no knowledge of the DOM. Depends on `@jsplumb/util`

- `@jsplumb/connector-bezier` Contains the core functions for working with Bezier curves and provides the Bezier and StateMachine connectors. Depends on `@jsplumb/core`.

- `@jsplumb/connector-flowchart` Provides the Flowchart connectors. Depends on `@jsplumb/core`.

- `@jsplumb/browser-ui` This package is the equivalent of `jsPlumb` in 2.x - it provides a concrete instance of jsPlumb that renders connections as SVG elements in the DOM. Depends on `@jsplumb/core`. Note that from 5.x onwards the default connector is now the `Straight` connector, so you will need to import other connectors if you want them - see below.

- `@jsplumb/browser-ui-lists` Scrollable list manager. Depends on `@jsplumb/browser-ui`.

- `@jsplumb/bundle` This package contains all of the other packages, and contains a single JS file - `jsplumb.bundle.umd.js`, which exposes a `jsPlumbBrowserUI` member on the window. Using this package you do not have the option of any tree shaking, and you are importing everything, which you may not need.  Currently this package is not published on npm. 


### Which packages do you need?

- To get a basic instance of jsPlumb running, you need only import `@jsplumb/browser-ui`. It will use the `Straight` connector by default.

- To use the `Bezier` or `StateMachine` connectors you will also need to import `@jsplumb/connector-bezier`

- To use the `Flowchart` connector you will also need to import `@jsplumb/connector-flowchart`

### What if I'm not using a package manager?

If you're not using a package manager at all then to get a basic instance of jsPlumb running you have two options:

#### 1. Use the full bundle

The `@jsplumb/bundle` package can be found in the file `bundle/dist/jsplumb.bundle.js`. This Javascript file is an `IIFE` which you can import in a `script` tag:

```html
<script src="bundle/dist/jsplumb.bundle.js"></script>
```

The bundle exposes a single `jsPlumbBrowserUI` member on the window:

```js
var instance = jsPlumbBrowserUI.newInstance({
    container:someDOMElement
})

instance.addEndpoint(someElement, "Dot")

etc

```

Whilst this is a simple way to get going it has the disadvantage that you are including all of the jsPlumb code, which you most likely do not need.


#### 2. Import the packages you need as `umd` files

This approach lets you limit, to a certain extent, importing code that you don't need. At the minimum you need these imports:

```
<script src="dist/util/js/jsplumb.util.umd.js"></script>
<script src="dist/core/js/jsplumb.core.umd.js"></script>
<script src="dist/browser-ui/js/jsplumb.browser-ui.umd.js"></script>
```

If you also want the `Bezier` or `StateMachine` connector:

```
<script src="dist/connector-bezier/js/jsplumb.connector-bezier.umd.js"></script>
```

And/or if you want the `Flowchart` connector you will also need:

```
<script src="dist/connector-flowchart/js/jsplumb.connector-flowchart.umd.js"></script>
```

---

## Documentation

For the Community edition the documentation for version 5.x is here:

[https://docs.jsplumbtoolkit.com/community/](https://docs.jsplumbtoolkit.com/community/)

For the previous - 2.x - version of jsPlumb, docs are here:

[https://docs.jsplumbtoolkit.com/community-2.x/current/](https://docs.jsplumbtoolkit.com/community-2.x/current/)


## Issues

jsPlumb uses GitHub's issue tracker for enhancements and bugs

## Requirements

No external dependencies.

## jsPlumb in action

Links to various Community Edition demonstrations can be found [here](https://community.jsplumbtoolkit.com).

## Tests
There is a full suite of unit tests checked in to the `test` and `dist/test` directories.

## Twitter

Please don't.

## Mailing List

Sign up for the jsPlumb announcements mailing list [here](http://eepurl.com/bMuD9).

## License

All 1.x.x, 2.x.x, 4.x.x, 5.x.x versions of jsPlumb Community edition are dual-licensed under both MIT and GPLv2. 
