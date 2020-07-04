# jsPlumb

<strong>This is version 4.x alpha. It is a rewrite of the original jsPlumb in Typescript, and is currently a work in progress. Use this version in production at your own risk.</strong>

It would be very helpful if existing users of jsPlumb could test this alpha version. There are a number of breaking backwards
changes to be mindful of, though:


### Breaking changes

#### Methods

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


#### Configuration

- All defaults converted to camelCase instead of having a leading capital, eg. "Anchors" -> "anchors", "ConnectionsDetachable" -> "connectionsDetachable". This brings the defaults into line with the parameters used in method calls like `connect` and `addEndpoint` etc.

- It is **imperative** that you provide the `container` for an instance of jsPlumb.  We no longer infer the container from the `offsetParent` of the first element to which an Endpoint is added. If you do not provide `container` an Error is thrown.

- `connector-pointer-events` not supported on Endpoint definitions. Use `cssClass` and CSS tricks.

- `labelStyle` is no longer supported. Use `cssClass` and CSS tricks.

- The `LogEnabled` and `DoNotThrowErrors` defaults have been removed.

- Paint styles for connectors dont support gradients anymore. You can use CSS for this.

- Removed `overlays` default. Use `connectionOverlays` or `endpointOverlays` now: not all overlay types are supported by Endpoints, so having a common set of overlays doesnt make sense.  

- The `radius` option is not supported on `PaintStyle` any longer. More generally, type specific values are not supported - `radius` only pertains to `Dot` endpoints, for instance. `width` and `height` from the Rectangle endpoint are also instance of this.  Put type specific values on the endpoint spec itself, eg `endpoint:['Dot', { radius:10 }]`.  

#### CSS classes

- The `jtk-endpoint-anchor` css class is not added to endpoints when the associated anchor did not declare a class. It is still
used when the anchor has declared a class (eg `jtk-endpoint-anchor-foo`), but otherwise it is not added. Without the anchor's class
suffix `jtk-endpoint-anchor` was just a shadow of `jtk-endpoint` - use `jtk-endpoint` instead.

- Managed elements do not have the `jtk-managed` class applied. They now have a `jtk-managed` attribute set on them. It is unlikely anyone was using this class but we include it here for completeness.

- Elements configured via `makeTarget` do not get assigned a `jtk-droppable` css class now. Instead, they are given a `jtk-target` attribute, as well as a`jtk-scope-**` attribute for every scope that is assigned.

#### Events

- The `manageElement` and `unmanageElement` events are no longer fired by the `JsPlumbInstance` class. These were undocumented anyway, but we're calling it out in case you have code that used them.
 
- Added `drag:start`, `drag:move` and `drag:stop` events. These replace the `start`, `drag` and `stop` event handlers that used to be supported on individual `draggable(..)` method calls.

- Binding to `mouseover` and `mouseout` on Endpoints and Connections is not supported. You now should bind to these events on a jsplumb instance instead:

    - endpointMouseOver
    - endpointMouseOut
    - connectionMouseOver
    - connectionMouseOut
    

#### Behaviour

- By default, every node is draggable. `.draggable(someElement)` no longer exists. You can make an element not draggable by setting a `jtk-not-draggable` attribute on it. It doesn't matter what the value of the attribute is, just its presence is all that is required.

- It is not possible to subclass Connection or Endpoint to provide your own implementations in 4.x.
  
- There is no `Image` endpoint in 4.x. You can achieve this via a 'Blank' endpoint with a css class. Or if you find you cannot and you can't think of any alternative, we could possibly add a `Custom` endpoint type, with which you could achieve this.


### New Functionality

- `elementsDraggable` added to `Defaults`, with a default value of true.

- Added `drag:start`, `drag:move` and `drag:stop` events to the `JsPlumbInstance` class. These replace the `start`, `drag` and `stop` event handlers that used to be supported on individual `draggable(..)` method calls.

- The `Mottle` library, which used to be a separate project, has now been incorporated into jsPlumb. For convenience, we have exposed `Mottle` on the browser window, as some people do use standalone instances of Mottle from time to time.  

- The `Katavorio` library, which used to be a separate project, has now been incorporated into jsPlumb. At present there is nothing exposed on the window as we did with Mottle, but there could be.


##### Imports

```
<script src="../../dist/js/jsplumb.js"></script>
```


##### Reporting issues

If you find any issues, please report them using the `4.x-alpha` tag on Github.


#### Introduction
 

If you're new to jsPlumb, please do take the time to read the [documentation](http://jsplumb.github.io/jsplumb/). 
There are a few integration issues that you should be aware of: z-index needs special attention, for example.

This project is the 'Community Edition' of jsPlumb. The 'Toolkit Edition' is a commercially-licensed wrapper around this. 

**This project is not the correct place to report issues for the Toolkit edition**. The Toolkit is not a public project.
Issues reported for the Toolkit edition in this issue tracker will be deleted.

## Documentation

For the Community edition the documentation can now be found here:

[https://docs.jsplumbtoolkit.com/community/current/index.html](https://docs.jsplumbtoolkit.com/community/current/index.html)



## Installation

```
npm install @jsplumb/community
```

NOTE: jsPlumb does not follow strict semantic versioning.  It is not at all recommended that you use wildcards when specifying a dependency on jsPlumb.  The given command will install jsPlumb version using a caret for wildcard, eg `^2.9.0` - you might want to take off the caret.

jsPlumb does not follow strict semantic versioning largely because of the stipulation that breaking changes must result in the major version being bumped. A major version implies something fundamental has occurred. The bump from 1.7.10 to 2.0.0 in jsPlumb was caused by the removal of the VML renderer, meaning IE6 and IE8 were no longer supported. You may say, a-ha! A breaking change! And you would be right; that was a breaking change. But a new major version might also occur when a new capability is added that doesn't affect existing functionality. And not every breaking change constitutes a fundamental change in the library itself. This note about semver was added to jsPlumb, for example, due to a discussion about how the `stop` event behaviour in the underlying drag library - Katavorio - had changed. Semver would say that the major version should have been bumped. But the change was not something fundamental. No capabilities had been added or removed...just some variables had been shuffled around.

Maybe you agree with this viewpoint. Maybe you don't.

We recommend including the `jsplumbtoolkit.css` file to begin with, as it provides some sane default values.


## Issues
jsPlumb uses GitHub's issue tracker for enhancements and bugs.  A losing battle was fought against the usage of Github for questions; now it seems to be the default, and the Google group is no longer in use.

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
All 1.x.x, 2.x.x and 4.x.x versions of jsPlumb Community edition are dual-licensed under both MIT and GPLv2. 
