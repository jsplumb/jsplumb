# jsPlumb

<strong>This is version 5.x alpha. It is a rewrite of the original jsPlumb in Typescript, and is currently a work in progress. Use this version in production at your own risk.</strong>

## Packages

One major change between 5.x and 2.x is that jsPlumb is now broken up into a number of smaller packages. This repository contains the code for all of these packages, but they are published on npm separately:

- `@jsplumb/util` This is the equivalent to what was always the `jsPlumbUtil` member on the window (and in fact, if you use the umd build, still is). This package has no external dependencies.

- `@jsplumb/common` Contains type definitions of Endpoints, Anchors and Connector, as well as as the base definition of a connector segment.  Has a dependency on `@jsplumb/util`.

- `@jsplumb/geom` Contains various geometry functions. Depends on `@jsplumb/util`. 

- `@jsplumb/core` Core functionality for jsPlumb - manages connections/endpoints and their drawing, but has no knowledge of the DOM. Depends on `@jsplumb/common` (which depends on `@jsplumb/util`) and `@jsplumb/geom`.

- `@jsplumb/bezier` Contains the core functions for working with Bezier curves. Depends on `@jsplumb/util` and `@jsplumb/common`.

- `@jsplumb/connector-bezier` Provides the Bezier and StateMachine connectors. Depends on `@jsplumb-bezier` and `@jsplumb/core`.

- `@jsplumb/connector-flowchart` Provides the Flowchart connectors. Depends on `@jsplumb/core`.

- `@jsplumb/browser-ui` This package is the equivalent of `jsPlumb` in 2.x - it provides a concrete instance of jsPlumb that renders connections as SVG elements in the DOM. Depends on `@jsplumb/core`. Note that from 5.x onwards the default connector is now the `Straight` connector, so you will need to import other connectors if you want them - see below.


### Which packages do you need?

- To get a basic instance of jsPlumb running, you need only import `@jsplumb/browser-ui`. It will use the `Straight` connector by default.

- To use the `Bezier` or `StateMachine` connectors you will also need to import `@jsplumb/connector-bezier`

- To use the `Flowchart` connector you will also need to import `@jsplumb/connector-flowchart`

### What if I'm not using a package manager?

If you're not using a package manager at all then to get a basic instance of jsPlumb running you will need to import a bunch of javascript files yourself. Their paths, relative to the project root, are:

- `dist/util/js/jsplumb.util.umd.js`
- `dist/common/js/jsplumb.common.umd.js`
- `dist/geom/js/jsplumb.geom.umd.js` 
- `dist/core/js/jsplumb.core.umd.js`
- `dist/browser-ui/js/jsplumb.browser-ui.umd.js`

If you also want the `Bezier` or `StateMachine` connector:

- `dist/bezier/js/jsplumb.bezier.umd.js`
- `dist/connector-bezier/js/jsplumb.connector-bezier.umd.js`

And/or if you want the `Flowchart` connector you will also need:

- `dist/connector-flowchart/js/jsplumb.connector-flowchart.umd.js`

---


## Breaking changes

### Methods

- The `empty` method was removed from `JsPlumbInstance`.

- The `deleteEveryEndpoint` method was removed from `JsPlumbInstance`. Functionally, it was identical to `reset`. Use `reset`.

- `addEndpoint` does not support a list of elements as the first argument - only a single DOM element is supported.

- `makeSource` does not support a list of elements as the first argument - only a single DOM element is supported.

- `makeTarget` does not support a list of elements as the first argument - only a single DOM element is supported.

- `getWidth` and `getHeight` methods removed from `JsPlumbInstance`. All they did was return the `offsetWidth` and `offsetHeight` of an element.

- `updateClasses` method removed from `JsPlumbInstance`. It was an attempt at keeping reflows to a minimum but was used only in one method internally, which is a method that was very rarely called.

- `setClass` method removed from `JsPlumbInstance`. This brings `JsPlumbInstance` into line with the way the DOM works: `classList` offers methods to add/remove/toggle classes, but not to set one particular class.

- `jsPlumbUtil` is no longer a static member on the window. Some of its more useful methods for users of the library have been exposed elsewhere: 

    - The `uuid` method, which we use a lot in our demos, and internally, is now exposed on the `JsPlumbInstance` class and on the global `jsPlumb` object
    
    - The `extend` method is now exposed on the `JsPlumbInstance` class and on the global `jsPlumb` object
    
    - The `consume` method is exposed on the `BrowserJsPlumbInstance` class (which is currently the only concrete instance of `JsPlumbInstance` and the class you will get from a `jsPlumb.newInstance(..)` call).

- `setId` no longer supports an array-like argument. You must now pass in a single id, or element.

- `appendToRoot` method removed. If you're using this, use `document.body.appendChild(..)` instead.

- The `droppable` method was removed. It was not used internally by any of the other code in either the Community or Toolkit editions, and had no accompanying tests. A question was raised [on Github](https://github.com/jsplumb/jsplumb/issues/942) about it and the OP ended up saying they'd just used native droppable stuff to achieve what they needed. If you feel `droppable` should be reinstated, we can chat about it [in this issue](https://github.com/jsplumb/jsplumb/issues/943). 


### Configuration

- The default connector is now `Straight`, not `Bezier`

- `Bezier`, `StateMachine` and `Flowchart` connectors are not imported by default. They are in separate packages.

- All defaults converted to camelCase instead of having a leading capital, eg. "Anchors" -> "anchors", "ConnectionsDetachable" -> "connectionsDetachable". This brings the defaults into line with the parameters used in method calls like `connect` and `addEndpoint` etc.

- It is **imperative** that you provide the `container` for an instance of jsPlumb.  We no longer infer the container from the `offsetParent` of the first element to which an Endpoint is added. If you do not provide `container` an Error is thrown.

- `connector-pointer-events` not supported on Endpoint definitions. Use `cssClass` and CSS tricks.

- `labelStyle` is no longer supported. Use `cssClass` and CSS tricks.

- The `LogEnabled` and `DoNotThrowErrors` defaults have been removed.

- Paint styles for connectors dont support gradients anymore. You can use CSS for this.

- Removed `overlays` default. Use `connectionOverlays` or `endpointOverlays` now: not all overlay types are supported by Endpoints, so having a common set of overlays doesnt make sense.  

- The `radius` option is not supported on `PaintStyle` any longer. More generally, type specific values are not supported - `radius` only pertains to `Dot` endpoints, for instance. `width` and `height` from the Rectangle endpoint are also instance of this.  Put type specific values on the endpoint spec itself, eg `endpoint:['Dot', { radius:10 }]`.  

### CSS classes

- The `jtk-endpoint-anchor` css class is not added to endpoints when the associated anchor did not declare a class. It is still used when the anchor has declared a class (eg `jtk-endpoint-anchor-foo`), but otherwise it is not added. Without the anchor's class suffix `jtk-endpoint-anchor` was just a shadow of `jtk-endpoint` - use `jtk-endpoint` instead.

- Managed elements do not have the `jtk-managed` class applied. They now have a `jtk-managed` attribute set on them. It is unlikely anyone was using this class but we include it here for completeness.

- Elements configured via `makeTarget` do not get assigned a `jtk-droppable` css class now. Instead, they are given a `jtk-target` attribute, as well as a`jtk-scope-**` attribute for every scope that is assigned.

### Events

- The `manageElement` and `unmanageElement` events are no longer fired by the `JsPlumbInstance` class. These were undocumented anyway, but we're calling it out in case you have code that used them.
 
- Added `drag:start`, `drag:move` and `drag:stop` events. These replace the `start`, `drag` and `stop` event handlers that used to be supported on individual `draggable(..)` method calls.

- Binding to `mouseover` and `mouseout` on Endpoints and Connections is not supported. You now should bind to these events on a jsplumb instance instead:

    - endpointMouseOver
    - endpointMouseOut
    - connectionMouseOver
    - connectionMouseOut
    

### Behaviour

- By default, every node is draggable. `.draggable(someElement)` no longer exists. You can make an element not draggable by setting a `jtk-not-draggable` attribute on it. It doesn't matter what the value of the attribute is, just its presence is all that is required.

- It is not possible to subclass Connection or Endpoint to provide your own implementations in 4.x.
  
- There is no `Image` endpoint in 4.x. You can achieve this via a 'Blank' endpoint with a css class. Or if you find you cannot and you can't think of any alternative, we could possibly add a `Custom` endpoint type, with which you could achieve this.


### New Functionality

- `elementsDraggable` added to `Defaults`, with a default value of true. When `false`, prevents nodes/groups from being dragged.

- `elementsDraggable` member exposed on `BrowserJsPlumbInstance`, defaulting to `true`. When `false`, prevents nodes/groups from being dragged.

- Added `drag:start`, `drag:move` and `drag:stop` events to the `JsPlumbInstance` class. These replace the `start`, `drag` and `stop` event handlers that used to be supported on individual `draggable(..)` method calls.

- The `Mottle` library, which used to be a separate project, has now been incorporated into jsPlumb. For convenience, we have exposed `Mottle` on the browser window, as some people do use standalone instances of Mottle from time to time.  

- The `Katavorio` library, which used to be a separate project, has now been incorporated into jsPlumb. At present there is nothing exposed on the window as we did with Mottle, but there could be.



## Reporting issues

If you find any issues, please report them using the `5.x-alpha` tag on Github.


#### Introduction
 

If you're new to jsPlumb, please do take the time to read the [documentation](http://jsplumb.github.io/jsplumb/). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project.
Issues reported for the Toolkit edition in this issue tracker will be deleted.

## Documentation

For the Community edition the documentation can now be found here:

[https://docs.jsplumbtoolkit.com/community/current/index.html](https://docs.jsplumbtoolkit.com/community/current/index.html)


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
