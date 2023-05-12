## 6.1.1

May 12th 2023

- Updates to build

## 6.1.0

May 11th 2023

- Bump version to keep in line with Toolkit edition. No functional change.

## 6.0.5

April 18th 2023

- Internal packaging updates.  No functional change.

## 6.0.4

April 14th 2023

- Fixed an issue where endpoints to set to invisible would be repainted under certain revalidation scenarios.

## 6.0.3

April 5th 2023

- Toolkit packaging updates for evaluation builds

## 6.0.2

April 4th 2023

- Fixed issue with Toolkit edition's Vue 3 integration packaging.

## 6.0.1

April 4th 2023

- Added bezier / state machine connectors to Toolkit edition

## 6.0.0

April 4th 2023

jsPlumb 6.x consists of only one package - `@jsplumb/browser-ui` - which exports everything from the various packages in 5.x. The thinking behind this decision is twofold:

- it's easier to import things when you don't have to hunt around for the package the thing you want is in
- Tree shaking is more efficient when everything is exported by a single package

Since the overwhelming majority of JS/TS development involves bundlers and tree-shakers these days, it seemed a good time to update jsPlumb to sit more nicely in that world.  You can still use jsPlumb as a standalone import, via the UMD bundle, and in that case it's also easier to work with, since there's a single global export - `jsPlumb` on the window object.


### BREAKING

Aside from the fact that you'll need to update all your imports to use the single `@jsplumb/browser-ui` package, there were a few minor changes to interface names:

- `newInstance` method removed from `@jsplumb/browser-ui-lists`. Use `new JsPlumbListManager(instance, params)` instead.

- `BeforeStartDetachInterceptor` renamed to `BeforeStartConnectionDetachInterceptor`
- `BeforeDetachInterceptor` renamed to `BeforeConnectionDetachInterceptor`
- `BeforeDropInterceptor` renamed to `BeforeConnectionDropInterceptor`


## 5.13.7

March 28th 2023

- Added support for injecting props into components in the Vue2/Vue3 integration packages in the Toolkit edition.

## 5.13.6

March 21st 2023

- Update to the fix applied in 5.13.5

## 5.13.5

March 17th 2023

- Fixed issue with endpoint cleanup after aborted connection drag

## 5.13.4

February 26th 2023

- Packaging updates for integrations

## 5.13.3

February 18th 2023

- Packaging updates for the Toolkit edition.

## 5.13.2

December 7th 2022

- Updated the Toolkit's lasso plugin to remove a global reference to `document` and instead use a lazy init method

## 5.13.1

November 28th 2022

- Updates to the Toolkit's Hierarchy layout.
- Addition of `groupUnattachedRoots` option to Toolkit's Hierarchy layout.

## 5.12.6

November 9th 2022

- Refactoring of the Toolkit's templates-2 package

## 5.12.5

November 8th 2022

- Updates to handling of Angular component overlays in Toolkit edition.

## 5.12.4

November 7th 2022

- Toolkit edition updates to support OnPush change detection
- Updates to handling of Angular component overlays in Toolkit edition.


## 5.12.3

October 27th 2022

- EventGenerator now directly invokes listener functions instead of using `apply` to bind `this`. This approach is more compatible with arrow functions in ES6.

## 5.12.2

October 12th 2022

- updated to Arrow overlay to ensure the arrow head is drawn as a point, not a bevel.

## 5.12.1

October 7th 2022

- updates to packaging in the Toolkit edition's background plugin
- addition of methods to hide/show backgrounds in Toolkit edition. 

## 5.12.0

September 24th 2022

- include drag group members in list of dragged elements that the `drag:stop` event contains

## 5.11.3

August 23rd 2022

- Improved docs in the Toolkit edition

## 5.11.2

August 19th 2022

- Toolkit edition updates
- Clone initial paint style in connection class to ensure values dont leak into other connections
- `updateFrom` method of label overlay now takes new 'location' value into account and repositions the overlay accordingly.
- overlay locations that do not parse as a number are rejected. For new overlays this results in using the default position of 0.5; for existing overlays the location remains at its previous value.

## 5.11.1

August 18th 2022

- When extracting a `label` to create a default label overlay in a `connect` call, the created label overlay is now assigned a class of `jtk-default-label`.

## 5.11.0

August 17th 2022

- Added some unit tests for the color/lineWidth/outlineWidth/outlineColor parameters on a `connect` call

- Added `setLineStyle` method to `JsPlumbInstance`.

## 5.10.9

August 16th 2022

- Added `setColor(connection, color)`, `setOutlineColor(connection, color)`, `setLineWidth(connection, width)`, `setOutlineWidth(connection, width)` methods to jsPlumbInstance.

- Added support for four new options in `ConnectParams` (the args to the `connect` method):

    - outlineColor:string
    - outlineWidth:number
    - color:string
    - lineWidth:number
 
## 5.10.8

August 16th 2022

- Internal refactoring of grid backgrounds in Toolkit edition.

## 5.10.7

August 15th 2022

- Addition of generated grid backgrounds to Toolkit edition.

## 5.10.6

August 12th 2022

- Fixed a couple of issues with connector placement when dragging nested nodes/groups.

## 5.10.5

August 5th 2022

- Expose `parameters` on the `ConnectOptions` interface.

## 5.10.4

August 3rd 2022

- Internal refactoring to use the viewport's position and size information instead of going back to the DOM

## 5.10.3

July 25th 2022

- Minor internal refactoring in the Toolkit edition.

## 5.10.2

July 22nd 2022

- Updates to the Toolkit's selection policy

## 5.10.1

July 21st 2022

- Updates to the Toolkit's lasso

## 5.10.0

July 21st 2022

- Added the `clearDragGroup` method, allowing you to remove all the members of some specific drag group at once.

## 5.9.4

July 19th 2022

- Upgraded to Typescript 4.x.

## 5.9.3

July 18th 2022

- Toolkit edition packaging updates. No code change.

## 5.9.2

July 18th 2022

- added a few utility methods from event manager to the exports.
- Toolkit edition updates.

## 5.9.1

14 Juillet 2022

### UPDATES

- Updated `constrainFunction` support to allow the user to return null, signifying that for the given desired location there is no allowed drag position and the element should not move from its last position. Drag is not aborted, but the element does not move from its last position.

## 5.9.0

July 7th 2022

### BREAKING

- Endpoints no longer have a `div` wrapping their `svg` element. For the vast majority of applications this change will have no discernible effect, but there is a chance that the occasional CSS selector needs to be updated.

### UPDATES

- Added `setDragConstrainFunction` method to `BrowserJsPlumbInstance`.
- Added `getPageLocation` method for accessing page location agnostic of touch vs mouse device.

## 5.8.3

June 16th 2022

### UPDATES

- Updated event manager to prefer `Event.computedPath()` over `Event.path` as Chrome now reports `Event.path` is deprecated and will be removed in the not so distant future.
- Updates to the Toolkit edition's React integration.

## 5.8.2

June 15th 2022

### UPDATES

- Toolkit edition updates

## 5.8.1

June 14th 2022

### UPDATES

- Toolkit edition updates

## 5.8.0

June 9th 2022

### UPDATES

- Added support for template macros to Toolkit's `browser-ui-vanilla-2` package
- Updated Toolkit's React and Vue 3 integrations to better handle asynchronous rendering
- Fixed versioning issue in Community edition
- Fix for issue with incorrect decoding of drag group spec when providing id and role

## 5.7.1

June 1st 2022

- Update to ForceDirected layout in Toolkit edition to better support positioning newly added nodes 

## 5.7.0

June 1st 2022

- Reinstated support for "direct render" in Toolkit edition.
- Added ForceDirected layout to Toolkit edition

## 5.6.5

May 24th 2022

- Updates to the Toolkit edition's Angular integration

## 5.6.4

May 21st 2022

- Updates to the Toolkit edition's Angular integration

## 5.6.3

May 20th 2022

- Updates to the Toolkit edition's Angular integration

## 5.6.2

May 6th 2022

- Toolkit edition updates

## 5.6.1

May 5th 2022

- Update to packaging in Toolkit edition.

## 5.6.0

May 3rd 2022

- Parameterised types were updated to support `{{value}}` syntax as opposed to `${value}`. This is to avoid confusion with JS string templates. The previous syntax is still supported for now but won't be as of v6.0.0.

- Fixed issue 1123: `jtk-endpoint-connected` and `jtk-endpoint-full` not initially added to endpoints created via the `connect` method.
- Fixed issue with redrop of connection on its original source: the selector params were not applied correctly (discussed in issue 1122)
- Added new RedropPolicy values `ANY_SOURCE`, `ANY_TARGET` and `ANY_SOURCE_OR_TARGET`
- Improved documentation around the `redrop` and `RedropPolicy` concepts.
- Several updates to css classes assigned to endpoint when dragging connections from them (issue 1124)
    - add `jtk-floating-endpoint` class to floating endpoints 
    - ensure floating endpoints have all user-supplied classes from the endpoint they were cloned from
    - set `jtk-dragging1 class on stationary endpoint, not floating endpoint, and only when dragging a new connection
    - fix issue where the endpoint definition was not correctly honoured when dropping a source back onto its original element
    - ensure 'source' and 'target' flags are correctly copied from target definition on drop
    - fix for `shouldReattach` - it was using the floating endpoint's detach allowed response rather than the stationary endpoint the connection was originally on   

- Added a `ResizeObserver` to the `BrowserJsPlumbInstance` class in `@jsplumb/browser-ui`. When the size of a managed element changes, jsPlumb will automatically revalidate that element.

- Added `resizeObserver` parameter to `BrowserJsPlumbDefaults`, with a default value of `true`. Can be set to `false` to prevent the resize observer from being added.

- Improved API docs @jsplumb/test-support package.
- Updated docs related to CSS classes when dragging connections

### Breaking

- in `@jsplumb/test-support`, the `dragToDistantLand` and `dragAndAbort` methods were removed. They were identical to `dragAndAbortConnection`, which was retained. 

---

## 5.5.5

April 5th 2022

- Merge PR 1115 - fix for issue 1113, in which a flowchart connector painted between opposite faces on the same element was not painted properly.

---

## 5.5.4

April 5th 2022

- Removed reference to `document` in root of the event manager module, which was causing an error on import when using NextJS SSR.

---

## 5.5.3

April 1st 2022

- Optimising imports. No code change from 5.5.2.

## 5.5.2

March 16th 2022

- Toolkit edition updates.

## 5.5.1

March 12th 2022

- Toolkit edition updates.

## 5.5.0

March 10th 2022

- Fixed an issue with endpoints not being cleaned up properly if an `endpointHoverStyle` was set in the defaults.

BREAKING

- The `CustomOverlayOptions` interface has been moved from `@jsplumb/common` to `@jsplumb/core`

## 5.4.1

February 15th 2022

- Updates to the Toolkit edition.

## 5.4.0

February 10th 2022

- added `addOverlay` to `JsPlumbInstance`. This method calls `addOverlay` on the underlying Component, and then revalidates the UI
- updated connection drag code to honour the orientation of the source anchor when dragging a new connection. With Flowchart connectors
this makes for a better UX, as the source stub is always painted.
- issue 1107 - drag handler's scroll listener is now removed when the drag handler is destroyed.
- Moved code that calculates `maxConnections` on drag start into a new handler - `canAcceptNewConnection`. this obviates the need to extract all the parameters from each candidate target. If previously you had a `parameterExtractor` defined that was passing back a value for `maxConnections`, you'll now need to implement `canAcceptNewConnection`

## 5.3.11

February 6th 2022

- update drag manager code to ensure handlers array is empty after reset
- added support for optional `attributes` record to set custom attributes on overlays
- added `addSelector` method to `DragManager`, which proxies the `addSelector` method on the underlying `Drag`. The Toolkit's connector editors register drag handlers via this method.

## 5.3.10

February 4th 2022

- Toolkit edition dialog refactoring.

## 5.3.9

February 1st 2022

- Toolkit edition dialog refactoring.

## 5.3.8

January 29th 2022

- fixed issue with `anchor` in an `addTargetSelector` call being ignored.

## 5.3.7

January 27th 2022

- fixed issue 1100, in which a `start` handler in `dragOptions` would override the disabled state of some draggable element.

## 5.3.6

January 25th 2022

- updated EventManager to support multiple `:not(..)` clauses in the child selector.
- updated `hideOverlays` and `showOverlays` on `Component` to support a list of IDs to hide or show.

## 5.3.5

January 20th 2022

Toolkit edition updates:

    - Fixed an issue whereby in some circumstances it was possible for a `bindModelObject` callback to be invoked without a model object supplied.
    
    - added `setOverlaysVisible(Selection|Path|Edge|Array<Edge>, boolean)` method to the `Surface`
    
    - updated the drop manager to support overridden `left` / `top` properties passed to the node factory callback.
    
    - added optional `onVertexAdded` callback to SurfaceDropManager, which will be invoked whenever a group/node has been dropped onto the canvas and added to the dataset. 

## 5.3.4

January 12th 2022

- Correction of the change in 5.3.3: `jtk-source-hover` and `jtk-target-hover` are applied to the _elements_ involved in a connection, not the endpoints.

## 5.3.3

January 11th 2022

- Reinstated the application of `jtk-source-hover` and `jtk-target-hover` classes to the source and target endpoint for some connection on which the mouse is hovering.

## 5.3.2

January 10th 2022

Toolkit edition updates:

    - Fixed issue with endpoint hover: when hovering over an endpoint, endpoints at the other end of connections to that endpoint also hover.
    - Fixed intermittent issue with multiple definitions on an element that have Continuous anchor definitions with different faces.


## 5.3.1

December 20th 2021

- added support for `maxConnections` in `addTargetSelector` method. 

## 5.1.0

November 25th 2021

- support for `connection:mouseup`, `connection:mousedown`, `endpoint:mouseup`, `endpoint:mouseup` events added.
- fixed issue with dragging via source selector ignoring the `anchors` default, if set.

## 5.0.0

TBD

## 4.0.0

30th April 2021

4.0.0 marks the first release of jsPlumb's port to Typescript. 

- Marked `spec` as optional argument for `getSelector` in `BrowserJsPlumbInstance`, to match its superclass.


## 4.0.0-RC92

29th April 2021

- added `mergeParameters(...)` method to `Component`

### Breaking

- replaced `getParameters()` / `setParameters(..)` with direct `parameters` member on the Component class.
- replaced `getParameter(key)` and `setParameter(key, value)` with direct access on the `parameters` member (or the `mergeParameters` method)

## 4.0.0-RC91

28th April 2021

- Refactored drag code to check for an instance-wide source selector before looking on the element from which a connection drag has started
- Added support for `elementTap` and `elementDblTap` events to be fired from a jsPlumb instance.

## 4.0.0-RC90

23rd April 2021

- Add support for disabling "loopback" connections when using `addSourceSelector` and/or `addTargetSelector`
- Add support for extracting attribute values to source/target Endpoints when using `makeSource`, `makeTarget`, `addSourceSelector`, `addTargetSelector`


## 4.0.0-RC89

23rd April 2021

- Fixed issue where multiple calls to `deleteConnection` for a given Connection would fail.

## 4.0.0-RC88

22nd April 2021

- Some extra unit testing
- Reinstated support for connector hoverClass on endpoint definitions 

## 4.0.0-RC87

21st April 2021

- internal improvements to the code that handles connection dragging
- extra tests for connection dragging, in particular detaching existing connections and reattaching elsewhere
- added support for CSS3 selectors as argument to `manageAll`
- reorganised tests suites for the various dragging functionality jsPlumb supports

## 4.0.0-RC86

15th April 2021

- added some optimisations to `repaintEverything`
- added some JsDoc
- simplified the `redraw` method of the router


## 4.0.0-RC85

15th April 2021

### Breaking

- Any `jtk-****` attribute written to an element managed by jsPlumb now has a `data-` prefix. For example, `jtk-managed` is now `data-jtk-managed`.

### Non-breaking

- Added code to ensure SVG elements are not painted with inappropriate values such as `Infinity`.
- Refactored the code (to run faster) that toggles classes on elements based upon whether or not they have any connections.
- Made a few adjustments to the `manage` method and the viewport code to be more efficient during bulk element add

## 4.0.0-RC84

31st March 2021

### Breaking (mildly)

- `click`/`tap`/`dbltap`/`dblclick` event callbacks on Overlays now pass `{e:Event, overlay:Overlay}` as the argument to the callback, where previously it was just the event.

## 4.0.0-RC83

30th March 2021

- Added a fix to the code that cleans up continuous anchors after connection drag end.

## 4.0.0-RC82

30th March 2021

- Further improvements to the `isNodeList` and `isArrayLike` methods

## 4.0.0-RC81

30th March 2021

- Improved the `isNodeList` method to not falsely identify an Array as a NodeList
- Added `isArrayLike`; this is probably the method we wanted in the first place.

## 4.0.0-RC80

30th March 2021

- Added support for passing in `NodeList<Element>` to `addClass`, `removeClass` and `toggleClass`

## 4.0.0-RC79

29th March 2021

- Added support for `NodeList` to the `on` and `off` event binding methods.
- Added support for tracking document scroll during element or connection dragging.

## 4.0.0-RC78

25th March 2021

- Added `beforeDrag` interceptor constant
- Added `beforeStartDetach` interceptor constant
- Update event handling to ensure only one delegated handler fires.

## 4.0.0-RC77

19th March 2021

- Tap event handler now passes back the event target

## 4.0.0-RC76

13th March 2021

- Added support for binding to `tap` and `dbltap` events on a `JsPlumbInstance` (binding to these events means binding to tap/dbltap on Connections)
- Added support for binding to `tap` and `dbltap` on overlays.
- Fixed a possible memory leak related to the `tap` event handler

## 4.0.0-RC75

9th March 2021

- Fix for `notNegative` drag containment

## 4.0.0-RC74

9th March 2021

- Updates to code to support drag containment

## 4.0.0-RC73

8th March 2021

### Breaking

- Renamed `EVENT_EXPAND` constant to `EVENT_GROUP_EXPAND`
- Renamed `EVENT_COLLAPSE` constant to `EVENT_GROUP_COLLAPSE`

## 4.0.0-RC72

6th March 2021

- added `connectorStyle` to makeSource/makeTarget args
- added `type` to `ConnectParams`

## 4.0.0-RC71

6th March 2021

- changed `makeSource` method signature to take Element, not jsPlumbElement
- `on`/`off`/`trigger` methods now take `Document | Element` ( they always did, but the method signatures did not reflect that reality)
- AnchorSpec now supports dynamic anchor

## 4.0.0-RC70

6th March 2021

- `AnchorOptions` now extends `Record<string, any>`
- added `dashstyle` to `PaintStyle` interface 

## 4.0.0-RC69

6th March 2021

- added missing `reattach` parameter to ConnectParams
- removed unnecessary 'id' parameter in `proxyConnection` and `unproxyConnection` method signatures - it is derived from the element passed in.

## 4.0.0-RC68

5th March 2021

- fixed issue that would prevent the deletion of connections that have been proxied, when the original endpoint is deleted
- fixed issue with group deletion not resulting in edges belonging to child nodes also being deleted

## 4.0.0-RC67

4th March 2021

- changed all overlay type members to be `type`, which is now standard across connectors/endpoints/overlays
- changed Continuous anchor type member to be `type`
- Update `AddGroupOptions` to now extend `GroupOptions`

## 4.0.0-RC66

4th March 2021

- internal refactoring to remove extra closures being created each time an Endpoint is added

## 4.0.0-RC65

3rd March 2021

- updated defaults to use `EndpointStyle` for endpoints rather than `PaintStyle`

### Breaking

- Renamed `Bezier` to `BezierConnector` and `StateMachine` to `StateMachineConnector`, for consistency with the other connector types (this is only a breaking change for people using Typescript and referencing `Bezier`)

## 4.0.0-RC64

3rd March 2021

- Introduced `EndpointStyle` interface, which extends `PaintStyle` and allows for arbitrary additional parameters.

## 4.0.0-RC63

3rd March 2021

- added setDragGrid method

## 4.0.0-RC62

3rd March 2021

- Internal refactoring - moved some methods between modules. 
- Fixed issue with drag filters being removed when `setContainer` is called.
- Added support for instance-wide specs of connection source/target points, using `addSourceSelector` and `addTargetSelector`. These methods can be used in place of the previous `makeSource` and `makeTarget` methods in many cases, and will be more performant as they don't need to register a bunch of stuff on each element.
- Internal updates to drag manager to ensure original position is correctly stored
- Added interfaces for all drag payload callbacks

## 4.0.0-RC61

24th February 2021

### Potentially breaking

- The `PointArray` type, mostly used internally, has been completely removed, and all instances of its usage have been replaced with `PointXY`.

### New

- The ID of an overlay is written into the DOM as a `jtk-overlay-id` attribute (this is really just for internal use)

## 4.0.0-RC60

22nd February 2021

- Internal event location members use `PointXY` instead of `PointArray`

## 4.0.0-RC59

22nd February 2021

### Breaking

- It is not permitted to use the `document` or `document.body` as the `container` element for a JsPlumbInstance now.  It is very unlikely anyone was doing this, but now jsPlumb is explicitly forbidding it.

- The `Offset` type was removed, and all instances of its usage were replaced by `PointXY`.  From the perspective of a user of the API this probably has little effect, but there is one public method whose return value has changed: the `getOffset(..)` method of `JsPlumbInstance` now returns a `PointXY` instead of an `Offset`  

## 4.0.0-RC58

20th February 2021

### Breaking (mostly internal)

- The drag code and the viewport both now use coordinates in the form `{x:.., y:..}` (a `PointXY`) rather than `[x,y]` (a `PointArray`). For most people this change will be transparent, but if you have any drag listeners registered you will need to update them, as the positions reported by these callbacks are all in `PointXY` format now.

- Method signatures for drag callbacks have been updated to more correctly model the arguments that are passed.

## 4.0.0-RC57

19th February 2021

- Internal refactoring of the geometry functions.

## 4.0.0-RC56

17th February 2021

- Added support for transactions to the viewport: a set of updates can be applied to a viewport without recomputing the bounds until all the updates have been made.

## 4.0.0-RC55

16th February 2021

- Exported a few touch event methods

## 4.0.0-RC54

16th February 2021

- Exported a few touch event methods

## 4.0.0-RC53

12th February 2021

- corrected an import that was pointing at the @jsplumb package

## 4.0.0-RC52

12th February 2021

- Converted `AnchorLocations` into a string enum, so you can now specify anchor locations in a type-safe way:

```
anchor: AnchorLocations.Top
```

### Breaking

- The `TopCenter`, `BottomCenter`, `LeftMiddle` and `RightMiddle` anchor locations have been removed. They have, for quite some time, been aliases to `Top`, `Bottom`, `Left` and `Right`, being a hangover from jsPlumb's early days. 

- The format of the various "spec" objects used to define the appearance of parts of the UI has changed. This came about after I actually tried to write an app against the Typescript API and ran into a few vagaries of how Typescript infers types, which together required more boilerplate in the UI than is desirable.

#### ConnectorSpec
 

Whereas previously you might have had:

```javascript
connector:[ "Flowchart", { cornerRadius:10 } ]
```

you now need:

```
connector:{
    type:"Flowchart",
    options:{
        cornerRadius:10
    }
}
```
#### OverlaySpec

`OverlaySpec` has also changed. Previously:

```
overlays:[
    [ "Label", { label:"foo" } ]
]
```

now:

```javascript
overlays:[
    { 
        type:"Label",
        options:{
            label:"foo"
        }
    }
]
```

Also note that in 2.x, there was a 3-arg version of the OverlaySpec:

```
[ "Label", { label:"foo" }, { location:0.2 } ]
```

This does not exist in 4.x. You will now need to merge the two objects before passing it to the overlay spec.

#### AnchorSpec

In some - very few - cases, it is possible to specify an anchor via its name and a set of constructor options, in the same way you could specify connectors or overlays, for instance:

```
anchor: [ "Continuous", { faces: [ "bottom", "left" ] } ]
```

This too has changed in 4.0.0-RC52:

```
anchor: { type:"Continuous", options:{ faces: [ "bottom", "left" ] } }
```

#### EndpointSpec

`EndpointSpec` has also been changed to be in the same format as the other spec objects. Where previously you had this:

```javascript
endpoint:[ "Dot", { radius:5} ]
```

You now need this:

```javascript
endpoint:{
    type:"Dot",
    options:{
        radius:5
    }
}
```

    

## 4.0.0-RC51

9th February 2021

- Updated a few places in the code where `Array.from` was used - replaced this with an IE11 compatible hand rolled method.

## 4.0.0-RC50

9th February 2021

- Updated a few places in the code where `forEach` from `Array` was being used - replaced this with an IE11 compatible hand rolled
method.

## 4.0.0-RC49

9th February 2021

- Fixed a race condition in the list manager tests that was causing intermittent test failures.
- Updated a few places in the code where `findIndex` or `find` from `Array` was being used - replaced this with an IE11 compatible hand rolled
method.

## 4.0.0-RC48

8th February 2021

- Dropped the `@jsplumb/community` package. Use `@jsplumb/browser-ui` now; it will import `@jsplumb/core`.  If you use static JS imports, not a build system, then import `jsplumb.core.umd.js` from `@jsplumb/core` and `jsplumb.browser-ui.umd.js` from `@jsplumb/browser-ui` to your page.

- Internal refactoring to support multiple rotations for any given element. This allows jsPlumb to support rotated nodes inside groups that are themselves rotated.

## 4.0.0-RC47

6th February 2021

### Breaking

- `@jsplumb/community-core` package renamed to `@jsplumb/core`.  We were going to use `@jsplumb` as the scope for the Toolkit edition packages, hence the name `community-core`, to distinguish it from the Toolkit. But now the Toolkit packages will use `@jsplumbtoolkit` as their scope.

## 4.0.0-RC46

3rd February 2021

- Internal method `getOffset` in `JsPlumbInstance` does not support optional `relativeToRoot` argument now. If you happen to be using it, with the `relativeToRoot` argument set, use `getOffsetRelativeToRoot(el)` instead.

- Removed the concept of "helper functions" for retrieving element position and size. This can be overridden in the `Viewport` now, as `Viewport` is the only class internally that calls these methods.     

## 4.0.0-RC45

2nd February 2021

- Internal refactoring of anchor code
- Fixed issue with cleanup of continuous anchors

## 4.0.0-RC44

31st January 2021

- Internal refactoring of connection drag code
- Internal refactoring of viewport code

## 4.0.0-RC43

29th January 2021

- Fix issue #1014, in which a connection dragged by its source could not be reattached to its original endpoint (or indeed to any source)

## 4.0.0-RC42

29th January 2021

- Added a test suite for scrollable lists and made some internal tweaks to the operation of scrollable lists.

## 4.0.0-RC41

29th January 2021

- Fixed issued 944, in which connections could be dropped onto list elements that were not currently visible in the list's viewport.

## 4.0.0-RC40

29th January 2021

- `JsPlumbInstance` now fires `manageElement` and `unmanageElement` events from the `manage` and `unmanage` methods respectively.
- Updates to list manager to fix an issue with the initialisation of a list via the `jtk-scrollable-list` attribute
- Updates to list manager to be more efficient about processing new connections after list initialisation.

## 4.0.0-RC39

28th January 2021

### Breaking

- The `container` property of a `Defaults` object, and the `container` method argument on the `setContainer` method, now only support an Element, not the ID of an element.
- The `getElement` and `getElementById` methods have been removed from `JsPlumbInstance` 

## 4.0.0-RC38

25th January 2021

- Various public methods changed to use `Element` instead of `jsPlumbElement` or `jsPlumbDOMElement`.

## 4.0.0-RC37

23rd January 2021

- `@jsplumb/browser-ui` imports the `community-core` package with the corresponding version.

## 4.0.0-RC36

23rd January 2021

- Fixed some path issues with imports (that only manifest when importing the package and trying to build something against it)

## 4.0.0-RC35

23rd January 2021

### Breaking

- `getAllConnections()` is no longer a method on `JsPlumbInstance`. Use the `connections` property instead.
- `connector-pointer-events` is not supported in EndpointOptions. Use `connectorClass` and CSS if you need to specify pointer events.
- `getZoom()` method on `JsPlumbInstance` replaced with `currentZoom` property.
- `getDefaultScope()` method on `JsPlumbInstance` replaced with `defaultScope` property
- The `connectionDragStop` event is no longer fired. Its use cases are covered by `connection`, `connection:move` and `connection:abort`.
- The `connectionAborted` event is now `connection:abort`
- The `connectionDrag` event is now `connection:drag`
- The `connectionDetached` event is now `connection:detach`
- The `connectionMoved` event is now `connection:move`

 
## 4.0.0-RC34

20th January 2021

- Internally, jsPlumb no longer uses the `id` attribute of the elements it is connecting; it now uses `jtk-id` instead. 

### Breaking

- The `setId` and `setIdChanged` methods were removed from `JsPlumbInstance`. This is due to change in tracking attribute described above.
- The concept of `Posse` was renamed to `DragGroup`. All associated types/interfaces and methods were renamed accordingly, eg `addToPosse` is now `addToDragGroup`; `PosseMemberSpec` is now `DragGroupMemberSpec`, etc.
- The `rotate` method takes elements as argument now, not element ids.

## 4.0.0-RC33

19th January 2021

The focus of this release was the internal separation of the core code from the code that renders to elements in a browser. The Community edition is now published as two packages - `@jsplumb/community-core`, which contains the core code and no renderer, and `@jsplumb/browser-ui`, which is the renderer that connects individual DOM elements with individual SVG elements. This latter package declares `@jsplumb/community-core` as a dependency.

For the time being, `@jsplumb/community` is still being published, which is a build that contains both `community-core` and `browser-ui`. In the future, though, this package will cease to be published.


## 4.0.0-RC32

16th January 2021

### Breaking

All of these methods only accept a single element as argument, where they previously will have accepted (depending on the method) an element, element id, or an array of elements of element ids.

    - `manage`
    - `setSourceEnabled`, 
    - `toggleSourceEnabled`
    - `unmakeSource`
    - `unmakeTarget`
    - `makeSource` 
    - `makeTarget`
    - `setTargetEnabled`
    - `toggleTargetEnabled`
    - `unmanage`
    - `removeAllEndpoints` 
    - `revalidate`
    - `getEndpoints`
    - `deleteConnectionsForElement`
    - `addEndpoint`
    - `addEndpoints`
    - `connect`
    - `getEndpoints`
    - `addToPosse`
    - `removeFromPosse`
    
A telltale sign that you need to migrate one of these methods is when you see "el.getAttribute is not a function" in your console.
    
- `makeAnchor` has been removed from `JsPlumbInstance`. It was only ever exposed for testing and was not a method that users of the API would need to access.

## 4.0.0-RC31

16th January 2021

- Re-release of RC29/RC30, which had an empty package.

## 4.0.0-RC30

16th January 2021

- Re-release of RC29, which had an empty package.

## 4.0.0-RC29

8th January 2021

- Internal refactoring

## 4.0.0-RC28

16th December 2020

- Fixed packaging issue that caused RC26 and RC27 to be empty.

## 4.0.0-RC27

16th December 2020

- GroupManager calls `unmanage` when removing a group now, which cleans it up properly (previously only the element was removed)

## 4.0.0-RC26

7th December 2020

### Breaking

- removed the `remove` method from `JsPlumbInstance`. 
- `unmanage` in JsPlumbInstance now removes all endpoints/connections for an element

### Non-breaking

- `unmanage` in `JsPlumbInstance` optionally removes the element from the view (replacement for the now deleted `remove` method)
  
## 4.0.0-RC25

7th December 2020

- Minor export updates, for the Toolkit edition to use.

## 4.0.0-RC24

7th December 2020

- `getDragArea` renamed to `getContentArea` in `UIGroup`

## 4.0.0-RC23

7th December 2020

- `EndpointSelection` now returns `this` from all methods.
- Fixed issue with the `.d.ts` files from core not being packaged in the browser build
- Removed a bunch of unused old doc stuff and kept just the `.md` files
- Removed `_orphan` method from Group and updated GroupManager's `orphan` method to work for all cases.

## 4.0.0-RC22

3rd December 2020

- Reinstated `grid` option for `dragOptions`
- Added support for `elementsDraggable` default and instance class member
- Reinstated `allowLoopback` option in `makeTarget`, and added it to `makeSource`

## 4.0.0-RC21

3rd December 2020

- Internal changes to split out the core parts of the code, which do not know about the DOM, from the parts that do know about the DOM. This will provide the foundation for both "headless" use cases and also alternative renderers
- Updated packaging to include umd, cjs and es builds. 
- General cleanup of unused code.
- Reinstated `allowLoopback` on `makeTarget` and added it to `makeSource`
- Fix JS error after drag

## 4.0.0-RC20

4th September 2020

- Removed all unnecessary semicolons from the source. No functional change.
- Internal refactoring related to the introduction of a Router for paths. No functional change.
- Internal refactor to use a class for EndpointSelection and ConnectionSelection

Breaking backwards changes: 

- all getters removed from the `ConnectionSelection` and `EndpointSelection` classes (the return values of `select()` and `selectEndpoints()` respectively). If you need access to an array of values you can use the `map` function on `SelectionBase` (the parent of `ConnectionSelection` and `EndpointSelection`)
- `isEnabled()` method removed from `EndpointSelection` (the return value of selectEndpoints)
- `delete()` method renamed to `deleteAll()` in `EndpointSelection` (delete is a reserved word so cannot be used as a class method)

## 4.0.0-RC19

25th August 2020

- `setEnabled`/`isEnabled` on Endpoint replaced with `enabled` property
- `setConnectionCost`/`getConnectionCost` on Endpoint replaced with `connectionCost` property
- added support for optional `portId` on `makeSource`/`makeTarget` calls
- added support for optional `ports` array on `connect` calls

## 4.0.0-RC18

4th August 2020

- Ported some code from the Toolkit edition to support user-specified geometry in edges
- Refactored the code that reports click/double click on managed elements.
- Improved handling for element double click
- Further issues with css class removal for endpoints

## 4.0.0-RC17

28th July 2020

- Fixed issue with `setContainer` method incorrectly moving nested managed elements out of their parents

## 4.0.0-RC16

28th July 2020

- When dragging an element/group, do not assign hover/active classes to its current parent (if any). Dragging within the current group will not result in a drop event.
- Improvements to collapse/expand for connections between a node and a group

## 4.0.0-RC15

27th July 2020

- Internal changes to the way Overlays are registered on connections and endpoints.
- Internal changes to remove an intermediate object that is a hangover from the previous version's approach to inheritance.
- Added initial support for nested groups. 

## 4.0.0-RC14

14th July 2020

- Added 'anchor' and 'anchors' to connection type merge overrides array

## 4.0.0-RC13

14th July 2020

- Added support for mergeStrategy:"override" to connection/endpoint type descriptors.

## 4.0.0-RC12

14th July 2020

- Backed out the paint changes from RC11. In some cases browsers were choosing spurious values for stroke widths with this arrangement.  You should still ensure you have the `overflow:visible` style on `.jtk-connector`, though, it's a good practice.

## 4.0.0-RC11

11th July 2020

### Breaking

- Refactored connection paint code to not take overlay placements or stroke width of connector into account when computing SVG bounds.  The `.jtk-connector` class in the `css/jsplumbtoolkit.css` file now has `overflow:visible`, which covers this. If you are upgrading from a prior version you should ensure this style is applied to your `.jtk-connector` elements.


## 4.0.0-RC10

10th July 2020

- fixed issue with css class removal of deleted connection causing a console log.


## 4.0.0-RC9

9th July 2020

- Added a proper implementation of onDragAbort for group and element drag handlers.
- Added tests for changes made in 4.0.0-RC8

## 4.0.0-RC8

8th July 2020

- Fixed issue with drag elements not being cleaned up when mouse clicked on endpoint but no drag occurs
- Fixed issue with classes not being cleaned up properly after endpoint drag
- Improved the internal typing of the drag manager

## 4.0.0-RC7

6th July 2020

- Fixed issue with typedefs not being up to date in package.

## 4.0.0-RC6

6th July 2020

- Re-release of 4.0.0-RC5, which may have had packaging problem

## 4.0.0-RC5

3rd July 2020

- added endpoint/connection mouseover and mouseout event bindings on jsPlumbInstance (in previous version you could bind to these events on an Endpoint or Connection)

## 4.0.0-RC4   

2nd July 2020

- Improved typing for various classes related to dragging.
- Added `createDragManager` method to `BrowserJsPlumbInstance` class.
- "dblClick" event on Overlay was incorrectly firing "click"
- Folded a couple of types related to anchor placements into one
- allow string or html element as arg to isSource/isTarget
- updated `AnchorSpec` type to allow for the array of numerics specifiers. 

## 4.0.0-RC3

30th June 2020

Third pre-release of the 4.x version. Couple of tiny changes, nothing functional:

- optional `center` added to the `BoundingBox` type definition
- added notes about the removal of the `droppable` method


## 4.0.0-RC2

25th June 2020

Second pre-release of the 4.x version of jsPlumb Community Edition. This release contains mostly updates to the types used in the code, as well as a bugfix for dragging connections.

- introduced a type for target/source definitions (used by makeTarget/makeSource)
- changed default Dot endpoint radius to 5px
- changed default Rectangle endpoint width/height to 10px
- fixed issue with resolution of target endpoint, found after introducing types for the target/source definitions.

## 4.0.0-RC1

20th June 2020

This release is a rewrite of the codebase into Typescript, with a bunch of breaking changes. The rendering pipeline has been refactored, and the way element dragging is handled has been completely rewritten: where previously each element - and each endpoint - would be initialised as a draggable individually, we now use a single delegated event listener on the container. This reduces the memory footprint and the time taken to create endpoints/connections, and to register elements, quite drastically.

This release is considered "alpha", since it is largely new code that does not have the benefit of having being run in production, although there is a test suite of roughly 2200 tests, so we're confident - contingent upon taking the changes listed below into account - that 4.x will behave the same as the current 2.x release.

If you're upgrading from a previous version of the Community edition, please do take the time to read through the changelog and familiarise yourself with what's different.

### Installation 

From 4.x onwards, jsPlumb Community Edition has a new package in npm:

```
npm i @jsplumb/community
```

After installation, you can import it directly into the page like this:

```
<script src="node_modules/@jsplumb/community/dist/js/jsplumb.js"></script>
```


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


#### Configuration

- All defaults converted to camelCase instead of having a leading capital, eg. "Anchors" -> "anchors", "ConnectionsDetachable" -> "connectionsDetachable". This brings the defaults into line with the parameters used in method calls like `connect` and `addEndpoint` etc.

- It is **imperative** that you provide the `container` for an instance of jsPlumb.  We no longer infer the container from the `offsetParent` of the first element to which an Endpoint is added. If you do not provide `container` an Error is thrown.

- `connector-pointer-events` not supported on Endpoint definitions. Use `cssClass` and CSS tricks.

- `labelStyle` is no longer supported. Use `cssClass` and CSS tricks.

- The `LogEnabled` and `DoNotThrowErrors` defaults have been removed.

- Paint styles for connectors dont support gradients anymore. You can use CSS for this.

- Removed `overlays` default. Use `connectionOverlays` or `endpointOverlays` now: not all overlay types are supported by Endpoints, so having a common set of overlays doesnt make sense.  

#### CSS classes

- The `jtk-endpoint-anchor` css class is not added to endpoints when the associated anchor did not declare a class. It is still
used when the anchor has declared a class (eg `jtk-endpoint-anchor-foo`), but otherwise it is not added. Without the anchor's class
suffix `jtk-endpoint-anchor` was just a shadow of `jtk-endpoint` - use `jtk-endpoint` instead.

- Managed elements do not have the `jtk-managed` class applied. They now have a `jtk-managed` attribute set on them. It is unlikely anyone was using this class but we include it here for completeness.

- Elements configured via `makeTarget` do not get assigned a `jtk-droppable` css class now. Instead, they are given a `jtk-target` attribute, as well as a`jtk-scope-**` attribute for every scope that is assigned.

#### Events

- The `manageElement` and `unmanageElement` events are no longer fired by the `JsPlumbInstance` class. These were undocumented anyway, but we're calling it out
 in case you have code that used them.
 
- Added `drag:start`, `drag:move` and `drag:stop` events. These replace the `start`, `drag` and `stop` event handlers that used to
be supported on individual `draggable(..)` method calls.


#### Behaviour

- By default, every node is draggable. `.draggable(someElement)` no longer exists. You can make an element not draggable by setting a `jtk-not-draggable` attribute on it. It doesn't matter what the value of the attribute is, just its presence is all that is required.

- It is not possible to subclass Connection or Endpoint to provide your own implementations in 4.x.
  
- There is no `Image` endpoint in 4.x. You can achieve this via a 'Blank' endpoint with a css class. Or if you find you cannot and you can't think of any alternative, we could possibly add a `Custom` endpoint type, with which you could achieve this.


### New Functionality

- `elementsDraggable` added to `Defaults`, with a default value of true.

- Added `drag:start`, `drag:move` and `drag:stop` events to the `JsPlumbInstance` class. These replace the `start`, `drag` and `stop` event handlers that used to be supported on individual `draggable(..)` method calls.

- The `Mottle` library, which used to be a separate project, has now been incorporated into jsPlumb. For convenience, we have exposed `Mottle` on the browser window, as some people do use standalone instances of Mottle from time to time.  

- The `Katavorio` library, which used to be a separate project, has now been incorporated into jsPlumb. At present there is nothing exposed on the window as we did with Mottle, but there could be.

 
## 2.15.5

December 14th 2020

- Extra piece of cleanup for Endpoint/Connection canvases to avoid leaking memory via element refs.

## 2.15.4

December 12th 2020

- Added missing `addOverlay` and `removeOverlay` methods on Connection in index.d.ts

## 2.15.3

December 8th 2020

- Fix for infinite loop in `empty()` method (issue #997)

## 2.15.2

December 1st 2020

- Further minor updates to index.d.ts, specifically the addition of a couple of missing return types.

## 2.15.1

November 27th 2020

- A minor release that includes updates to index.d.ts to include methods/types for working with Groups

## 2.15.0

October 26th 2020

### Breaking

- `revalidate` now supports only a single element as argument, and returns a `RedrawResult` object, which contains a list of Connections
and Endpoints that were repainted as a result of the call.

### Non-breaking

- When element rotated, fix issue where the original x/y locations for an anchor were being overwritten


## 2.14.7

October 15th 2020

- additional unit testing for the setTarget method
- added `destroy` method to jsPlumb class, which performs a reset and also sets a bunch of closure-wide variables to null.
- switched a few functions from using closures to using members on the Anchor class
- added support for rotating elements, using the `rotate(element:string|Element, degrees:number)` method of jsPlumb.

## 2.14.6

September 4th 2020

- Internal changes to reference a Router for various methods rather than an AnchorManager. There is no functional change; this work was undertaken to assist in the 4.x rewrite.

## 2.14.5

July 27th 2020

- Further updates to type defs for Connection and Endpoint - added setParameter/setParameters/getParameter/getParameters

## 2.14.4

July 27th 2020

- change `parameters` to `Record<string, any>` in `EndpointOptions` in type definitions
- add `parameters` to `ConnectParams` in type definitions

## 2.14.3

July 14th 2020

- Backed out the change from 2.14.0 that dispensed with taking overlay placements/stroke width into account. In some cases browsers were choosing spurious values for stroke width with this setup.

## 2.14.2

July 12th 2020

- Always use width/height of at least 1 pixel in SVG element. This is a proper fix for the issue from 2.14.0; don't use 2.14.1.

## 2.14.1

July 12th 2020

- Fixed issue with SVG elements sometimes being assigned height/width of 0, in which case overflow is ignored.

## 2.14.0

July 11th 2020

### Breaking

- Refactored connection paint code to not take overlay placements or stroke width of connector into account when computing SVG bounds.  The `.jtk-connector` class in the `jsplumbtoolkit-defaults.css` file now has `overflow:visible`, which covers this. If you are upgrading from a prior version you should ensure this style is applied to your `.jtk-connector` elements.

### Non-breaking

- `doNotFireEvent` parameter in `deleteConnection` js doc switched to `fireEvent` (issue 932)
- Internal refactoring of paint code to introduce the concept of a "router". No functional change.

## 2.13.4

July 9th 2020

- Added missing `uuid` option to `EndpointOptions` in types. No change to the code.

## 2.13.3

Jun 16th 2020

- Minor changes to demonstrations. No change to the library.

## 2.13.2

May 1st 2020

- when adding new endpoint and drawing is not suspended, ensure offset/size is always updated. 

## 2.13.1

April 12th 2020

- fix issue #924 - connections for nested child elements not recognised when parent added to a group.
- Support `ListStyle` default, for specifying endpoint/anchor of `jtk-scrollable-list` elements.

## 2.13.0

March 20th 2020

- upgrade to Mottle 1.0.1

## 2.12.14

March 2nd 2020

- faster `uuid` method implementation
- faster bezier curve length method
- issue #914 and #913 part 2

## 2.12.13

February 29th 2020

- fix issue 913 - arrow overlays disappearing when changing types

## 2.12.12

February 29th 2020

- fix issue 912 - change of element ID not recognised by makeSource when user drags with mouse.

## 2.12.11

February 28th 2020

- fix duplicated types.

## 2.12.10

February 27th 2020

- updates to groups code to handle correctly hiding connections between elements that are not direct children of the group
- several typings changes, one of which was partly duplicated, causing this version to not be something you should install.

## 2.12.9

January 30th 2020

- redraw child elements on group drag (fixes issue with group members that have associated connections that are on descendants of the child element, not the child element itself)
- add setZoom/getZoom to Typescript definitions file. 

## 2.12.8

December 11th 2019

- fixes for the sort functions used to sort edges by the continuous anchors (#893, #892, #891, #890).

## 2.12.7

November 28th 2019

- remove the ability to add nodes that are inside a group to the current drag selection.
- when a node is added to a group, it is removed from the current drag selection.

## 2.12.6

November 18th 2019

- update groups code to correctly orphan/prune multiple dragged elements

## 2.12.5

October 29th 2019

- fix issue #861, error on droppable.

## 2.12.4

October 27th 2019

- minor updates to endpoint label handling
- update `remove` method to test for parent node existence before attempting removal.

## 2.12.3

October 20th 2019

- ensure `label` from connection type is not presented to endpoint.

## 2.12.2

October 20th 2019

- minor update to the return value of the internal method used to find the point on a Bezier connector closest to some point in the viewport. 

## 2.12.1

October 19th 2019

- minor update to the return value of the internal method used to find the point on a connector closest to some point in the viewport.

## 2.12.0

September 23rd 2019

- added support for label location being specified in the `data` for some Connection, via key `labelLocation`
- added support for overridding `labelLocation` key name with user-specified key, via `labelLocationAttribute` in Label overlay options.

## 2.11.2

August 7th 2019

- added `snapToGrid()` method to jsPlumb instance.
- added `replaceEndpoint()` method to Connection.

## 2.11.1

July 18th 2019

- fixed issue in reset method introduced in 2.11.0

## 2.11.0

July 17th 2019

- updated util from Toolkit edition

- Changes to the way types are overridden/merged (not all backwards compatible):

    - By default, every key in a type overrides previous types, with the exception of `cssClass`, `events` and `overlays`. Previously, only
    `connector` would override other types.  This meant that if you used any of the array variants to specify `anchor`,  the arrays 
    would be merged and the result would be nonsense.  It also meant that `paintStyle` and its variants would be merged at a 
    fine-grained level: you could specify `strokeWidth` in a parent and then `stroke` in a child. That is no longer possible.
    
    - You can set `mergeStrategy:"override"` in a type now to indicate to jsPlumb that it should overwrite parent definitions of
    `events` and `overlays` rather than merge them with the child's values for them.
    
    - `cssClass` is still "collated" by default, ie. in a normal merge both child `cssClass` and parent `cssClass` values are
    retained. If you specify `mergeStrategy:"override"` then `cssClass` is strictly overridden and is not collated.


## 2.10.2

July 4th 2019

- Upgraded to Katavorio 1.4.8

## 2.10.1

June 25th 2019

- refactored how makeSource gets its source parameters, so that call sites can manipulate the parameters after the makeSource call.
- PR 843: reapplyTypes() for Arrow overlays ignores 'direction' parameter
- fixed an issue causing connectors to disappear when a type is applied multiple times.


## 2.10.0

June 5th 2019

- fix `rectangle` and `square` Perimeter anchors so that their orientation is correct for each face.
- add support for scrollable lists, plus a demonstration page

## 2.9.3

May 9th 2019

- Upgrade to Katavorio 1.4.5
- support "scoped root" selectors in delegated draggables

## 2.9.2

April 22nd 2019

- upgrade Katavorio to 1.4.2

## 2.9.1

March 7th 2019

- reinstate the ability to build a local copy of the docs

## 2.9.0

January 28th 2019

- update `ConnectParams` to include `connector?:ConnectorSpec` in typings file.

## 2.8.8

December 28th 2018

- removed unused method, and its usage from tests

## 2.8.7

December 28th 2018

- update types file to add overlays to ConnectParams

## 2.8.6

December 11th 2018

- better decision making when determining if a connection is detachable or not.
 
## 2.8.5

December 7th 2018

- added missing `findClosestPointOnPath` method to Bezier segment.
- added support for finding the intersection of a line and a segment.

## 2.8.4

November 2nd 2018

- do not merge `connector` declarations when merging connection types. The child value overwrites the parent now.
- issue #794 - use `jsPlumb.addClass(div,...)`` instead of `div.className=` - this was causing an error when the custom overlay was an SVG element

## 2.8.3

October 28th 2018

- fixed a repaint issue with Continuous anchors

## 2.8.2

October 18th 2018

- remove animated paths from Flowchart demo, as IE does not support that CSS.

## 2.8.1

October 18th 2018

- Upgrade to Katavorio 1.2.0

## 2.8.0

August 31st 2018

- Upgrade to Mottle 1.0.0, which doesn't use document.createTouch/document.createTouchList, as these methods are not supported
in latest Chrome and are becoming obsolete in all browsers. If you cannot upgrade to this version of jsPlumb and you're finding problems
in Chrome on touch devices, there are shims available in the Mottle project on Github.

## 2.7.19

August 28th 2018

- proper cleanup for arrow overlay

## 2.7.18

August 28th 2018

- Fixed an issue with overlays not being removed from every cache during removeOverlay call on overlay component.

## 2.7.17

August 28th 2018

- Minor change to the segment paint code, to allow for animation effects to be used.

## 2.7.16

August 20th 2018

- Upgrade to Katavorio 1.0.0

## 2.7.15

August 11th 2018

- Issue 582: ConnectionsDetachable does not allow dragging multiple connections from endpoints when false

## 2.7.14

August 10th 2018

- Group's orphanAll method now returns a map of element positions for the previous child elements.
- Group's removeAll method works without throwing an error now.

## 2.7.13

July 27th 2018

- PR #769: refactor DragManager's `register` method to avoid computing parent offsets when unnecessary.

## 2.7.12

July 25th 2018

- changed a method declaration whose format caused Angular's optimizer to fail (when running an Angular production build)

## 2.7.11

July 23rd 2018

- remove unnecessary double firing of the group:addMember event.

## 2.7.10

July 22nd 2018

- fix for setting class name of SVG element in IE11 - it doesnt expose `classList`. The reported error was not fatal but now
we test if `classList` is null before accessing it.

## 2.7.9

June 24th 2018

- moved Defaults off the jsPlumbInstance prototype and into the class itself. Prevents global variable effect.
- update the internals of creating Connectors to make it easier to add a custom connector.

## 2.7.8

June 22nd 2018

- additions to Typescript typings file
- group:addMember and group:removeMember events optionally include the other group involved when the event was fired as the result of
  a member changing groups.

## 2.7.7

June 21st 2018

- ensure 'rank' is passed through to drop library when present
- separate out unit tests for drag/drop and for groups.

## 2.7.6

June 20th 2018

- replaced incorrect call to detachAllConnections in demo to deleteConnectionsForElement
- fixed docs to change references from `detachAllConnections` to `deleteConnectionsForElement`

## 2.7.5

June 17th 2018

- added toggleClass method to jsPlumb

## 2.7.4

June 14th 2018

- fix for cssClass being ignored in `addEndpoint` method (PR 750)
- minor updates to the Typescript typings file.

## 2.7.3

May 27th 2018

- switched util back to an older method of declaring it on the window.
- removed bower.json

## 2.7.2

May 25th 2018

- browser util assumes 'window' as root

## 2.7.1

May 25th 2018

- added Connector to the Defaults interface in the TS typings file (#744)

## 2.7.0

May 22nd 2018

- jsPlumb.extend now copies the __proto__ chain too. 
- Remove old site code. We manage the site in a different project now.
 
## 2.6.12

May 15th 2018

- improvement to the calculation of corner radius when segments are short in a Flowchart connector
- upgrade to Katavorio 0.28.0

## 2.6.11

- slight refactor of AnchorManager to put a commonly used method on the prototype.

## 2.6.10

- documentation updates

## 2.6.9

March 16th 2018

- removal of unused 'editable' stubs. No functional change.
 
## 2.6.8

February 24th 2018

- upgrade to Katavorio 0.26.0
- added unbindDraggable and unbindDroppable methods

## 2.6.7

February 8th 2018

- add the ability to lock a Continuous Anchor's current 'axis' (ie. it can choose left/right OR top/bottom).

## 2.6.6

February 8th 2018

- add the ability to lock a Continuous Anchor's current face.
- upgrade to Katavorio 0.25.0

## 2.6.5

February 2nd 2018

- add support for `connectorOverlays` to `makeSource` method
- upgrade to Katavorio 0.24.0

## 2.6.4

January 28th 2018

- trivial formatting issue required by upstream collation mechanism in Toolkit 

## 2.6.3

January 26th 2018

- Updates to Typescript typings files

## 2.6.2

January 24th 2018

- `getInstance` method in index.d.ts returns `jsPlumbInstance` instead of `any` (issue 680)

## 2.6.1

January 24th 2018

- comment out a block of code instead of using 'if false' to prevent its execution (issue 707)

## 2.6.0

January 20th 2018

- switch from lazy loading of connector types to direct registration. In certain Webpack scenarios the lazy loading was causing connectors to not be found.

## 2.5.14

January 19th 2018

- improvements to the .d.ts file.

## 2.5.13

January 14th 2018

- minor internal refactoring of the flowchart connectors
 
## 2.5.12

January 4th 2018

- refactor the method that chooses which connection is being dragged on some endpoint that has more than one connection. no functional change.
- update to index.d.ts to fix compile error

## 2.5.11

December 23rd 2017

- doc updates to include `deleteConnection` method on jsPlumbInstance.

## 2.5.10

- fix for connections lost when group collapsed (issue 694)

## 2.5.9

- dont default to false for 'directed' on a connection; allow it to be undefined if not set.

## 2.5.8

7th December 2017

- minor updates to the way anchors and connectors are set to fix a couple of small bugs related to types.

## 2.5.7

22nd October 2017

- update Katavorio to version 0.22.0

## 2.5.6

18th October 2017

- fix for an issue seen in Chrome where setting the className of an SVG element does not result in the element's classList being updated.

## 2.5.5

8th October 2017

- issue 675, connector not changed in setType/addType

## 2.5.4

7th October 2017

- fix issue with drag containment in elements whose scroll height is larger than their client height.

## 2.5.3

5th October 2017

- expose Connection to anchor at compute time.

## 2.5.2

4th October 2017

- upgrade to Katavorio 0.20.0.  Fixes issue #618, in which constraining drag to a grid did not work for anything other than
a grid of size [10,10]

## 2.5.1

28th August 2017

- fix for the setType method: if the new type had a different connector, arrow overlays were not being transferred.

## 2.5.0

22nd August 2017

- removed the old changelog.txt, which hadnt been used since 2.0.3 and was probably confusing matters.
- fixed stale references to various detach methods which were renamed a few versions ago.
- EventGenerator was updated to fire each event on a separate tick of the event loop. Previously, if an event was fired during
the callback to a previous event, the second event handler was executed in its entirety before the original event handler. 
Enqueuing events that are fired during the event loop and running them after each tick prevents this from happening.

## 2.4.3

20th June 2017

- update documentation to remove references to the now defunct jQuery flavour of jsPlumb.
- SVG elements use SVG namespace rather than XHTML

## 2.4.2

10th May 2017

- update calls to drag manager to handle the case that one is not set

## 2.4.1

10th May 2017

- Support `collapsed` as a parameter to the `addGroup` method, which specifies that a Group be initially collapsed.

## 2.4.0

8th May 2017

Several methods and parameters have been renamed to better reflect their function:

#### jsPlumbInstance

  - `detachAllConnections` renamed to `deleteConnectionsForElement`
  
  - `detach` renamed to `deleteConnection`. `detach ({source.., target:...})` can be achieved with `select({source:..,target:..}).delete()`
  
  - `detachEveryConnection` renamed to `deleteEveryConnection` 
  
  - `connect` method: the `deleteEndpointsOnDetach` parameter is now `deleteEndpointsOnEmpty`
  
  - `getEndpoints` method returns empty list when none found now, not null.
  
  - `select` method: the return value of this now has a `delete` method, instead of `detach`.
  
  - `selectEndpoints` method : the return value of this now has a `deleteEveryConnection` method, instead of `detachAll`.  
  
#### Endpoint
  
  - `detach` method removed
  - `detachAll` renamed to `deleteEveryConnection`
  

## 2.3.6

1st May 2017

- fix for the filenames to the toolkit css files (they are lower case now)
 

## 2.3.5

24th April 2017

- Reordered the sequence of events when a node is dragged out of a group.

## 2.3.4

23rd April 2017

- fixed a reference to dragManager which short-circuited the lazy loading. 

## 2.3.3

23rd April 2017

- update drag manager offsets during revalidate

## 2.3.2

22nd March 2017

- upgrade Katavorio to version 0.19.2, to fix a minor issue with droppables not being cleared after mouseup.

## 2.3.1

15th March 2017

- fixed possible NPE when adding child to group
- do not override endpoints in connect call with endpoints from type if endpoints are specified.

## 2.3.0

14 February 2017

- removed version extension from built file names and made filenames lower case : jsplumb.js, jsplumb.min.js
- npm pack the project at build time (to local file jsplumb.tgz)
- reinstate bower.json in this project 
- reorganise files used for building
- ensure element connections repainted correctly after element added to group 
- fix addToGroup to support multiple elements
- switch to imports using npm (jsBezier, katavorio, biltong, mottle) rather then included in lib dir of project

## 2.2.10

13 January 2017

- addition of `version` member to built JS. current version is now accessible via `jsPlumb.version` (or `.version` on 
an instance).

## 2.2.9

13 January 2017

- limit files that are published to npm to just js, minified js and css
- remove version number from built filename

## 2.2.8

20 December 2016

- disallow addition of some node to a group in which it is already a member
- remove node from its current group (if there is one) upon addition to new group.
- fix for drag manager not being called to re-register a node if it was added to a new group
programmatically and not via drag/drop

## 2.2.7

10 December 2016

- fixed an issue with setting a blank label on a Label overlay.

## 2.2.6

05 November 2016

- fix deployment issue in 2.2.6


## 2.2.5

- upgrade to mottle 0.7.4 

## 2.2.4

- no code change from 2.2.3. built to provide initial build in the bower-jsplumb repo.

## 2.2.3

- add support for connectionType to makeTarget call (to allow multiple types of target)

## 2.2.2

- corrected deployment issue in 2.2.1. 2.2.1 does not do what it says; it is an impostor.

## 2.2.1

- upgrade to Katavorio 0.18.0; now `rank` is supported in `dropOptions` to `makeTarget` or `addEndpoint`. Use this when
you want to make a Group container a connection target but you want to give prededence to Nodes inside the Groups.

- set drop rank for Group elements automatically (if user does not provide one) so that Nodes receive drop events before
Groups.


## 2.2.0


- Overhaul of keys used in paintStyle and hoverPaintStyle objects:

  strokeStyle   -> stroke
  fillStyle     -> fill
  lineWidth     -> strokeWidth
  outlineColor  -> outlineStroke
  outlineWidth  -> outlineWidth     (yes, unchanged)
  
  
- All classnames changed from `jsplumb-` prefix to `jtk-`, to bring them into line with the prefix used by the Toolkit edition.
  
- support webpack
- add webpack demo page
- upgrade to Mottle 0.7.3
- upgrade to Katavorio 0.17.0
- straight connectors extracted to a separate JS file for dev
- added disable/enable functionality example to sources and targets demo

## 2.1.6

- setTargetEnabled/setSourceEnabled now return the previous value of the enabled state.
- disabled source/target elements get a `jtk-source-disabled` or `jtk-target-disabled` class added.
- issue 552 - in place endpoint painted in wrong location during connection drag
- issue 554 - after drag, connections to a node inside a group are positioned incorrectly.


## 2.1.5

- issue 533 - Dragging multiple nodes causes incorrect connectors position
- `reset` method sets hover suspended flag to false now.



## 2.1.4

- issue 530 - Further fix related to issue 530, in which elements that had connections prior to being added to a group
were sometimes getting an offset applied when dragging. The fix for this removed some code that was put in for issue 231, 
but it turns out the fix for issue 231 had broken somewhere along the line and this change set that right too.


## 2.1.3

- issue 530 - Element with existing connections being added to Groups.
- issue 526 - bower version incorrect

## 2.1.2

- issue 523 - Endpoint click registration problems
- issue 522 - Groups documentation

## 2.1.1

- bugfix for groups: element exposed now via getEl method, not directly as el. 

## 2.1.0

- 'elementDraggable' event now fired whenever an element is made draggable via the `draggable` function
- add support for 'groups' - elements that can contain other elements, and which are collapsible.
- upgrade to Mottle 0.7.2. a few fixes for event delegation.

- upgrade to katavorio 0.17.0
- upgrade to mottle 0.7.2
- upgrade to jsBezier 0.8
- upgrade to Biltong 0.3

ISSUES

- 483 - srcElement undefined in Firefox
- 484 - changed a couple of variables refs so that they are not reserved words 


## 2.0.6

- add `connectionAborted` event, fired whenever a new connection is abandoned before being dropped on an endpoint or
target. also fired if `beforeDrop` interceptor returns false.

- fixed docs for `connectionDetached` to call out the fact that it is not fired when a connection is abandoned.
 
 ISSUES
 
- 472 - Pending connections do not fire the documented events
- 469 - Scopes not applied to new drag & drop connections
- 452 - Why "connection.scope" property cannot get scope value ?


## 2.0.5

- Refactor Bezier and StateMachine connectors to extend common AbstractBezierConnector parent. This means Bezier
 connectors now support loopback connections.
 
- add support for loopback connections to Flowchart connector (issue 457).
 
ISSUES
 
- 458 connectionDetached is fired the first time only

- 457 'Flowchart' connector: loopback connections broken

- 451 cannot bind events to arrow overlays

- 446 addClass and removeClass on Endpoint and Connection now also add/remove class from their overlays, by default. This
 can be overridden by providing 'true' as the second argument to the addClass/removeClass methods.
 
- 434 wrong arrow drawing (offset) when creating a connection on IE9 
 

## 2.0.4

- upgrade to Katavorio 0.13.0
- upgrade to Mottle 0.7.1
- add `droppable` method to jsPlumbInstance: the ability to make _elements_ droppable. Not connections or endpoints - DOM 
elements.
- fixes for offset calculation when dragging a nested element.

## 2.0.3

### Issues

- 444 - maxConnections not honoured in makeSource

### Backwards Compatibility

- `removeFromPosse` now requires the ID of the Posse, since the new Katavorio version supports multiple Posses
per element.

### New Functionality

- Upgrade to Katavorio 0.12.0, with support for multiple Posses and active/passive elements in a Posse.
- `removeFromAllPosses(element)` method added.


### Miscellaneous

- Fixed an issue in which overlays on Endpoint types were not being converted to 'full' syntax upon registration. This was
an internal issue that could manifest in user code occasionally.

- We now ensure drag scope is set on an element when source scope changes, even though the code can derive source scope
when the user begins to drag. The Toolkit edition makes use of this new update.



    
## 2.0.2

Fix issues with CSS class documentation.

## 2.0.1

Bugfix release: connectionDetached event was no longer firing.

## 2.0.0

### Backwards Compatibility

- Removal of the VML renderer. IE8 no longer supported.
- All class names such as `_jsPlumb_connector` renamed to, for example, `jsplumb-connector`.
- makeSource and makeTarget require explicit anchor/endpoint parameters: they do not source these things
  from the jsPlumb Defaults.


### New Functionality

- makeSource now supports multiple registrations per element, keyed by the `connectionType` parameter.  You can configure 
elements to be connection sources for different connection types, and also when you call `connect` with a `type` 
parameter that matches a `makeSource` registration, that type will be used.
- new connection drag: if the type of connection is known, that type's target endpoint is now used.
- addition of support for `dragProxy` to endpoint/makeSource: an endpoint spec defining what the drag endpoint should 
look like when dragging a new connection. The existence of a `dragProxy` will override any other behaviour (such as the 
behaviour discussed in the point above)
- addition of "posses" - groups of elements that should always be dragged together.
- when dragging a new connection, jsPlumb now uses as the source endpoint a true representation of what the endpoint
    will be if a connection is established. Previous versions just used a static, in-place, endpoint.


## 1.7.10

### Changes between 1.7.9 and 1.7.10

- Small update to getOffset to make it return the correct value if the input element was the container itself.
- Small update to animation to fix incorrect falsey check.
- Documented the `on` method of a `jsPlumbInstance` in the API docs.
- `on` and `off` event registration methods now return the current jsPlumb instance
    
    
## 1.7.9

### Changes between 1.7.8 and 1.7.9

- No more jQuery flavour. Vanilla jsPlumb is the only jsPlumb, and as such, has been renamed to simply `jsPlumb-1.7.9.js`.
- First version of jsPlumb to be published to npm.
- Addition of getManagedElements method. Returns a map of all the elements the instance of jsPlumb is currently managing.

#### Issues

- **421** svg gradient elements not cleaned up properly

## 1.7.8

### Changes between 1.7.7 and 1.7.8

#### Issues

- **381** -  instance.detach(connection) will detach source endpoint as well
- **419** -  endpoints not cleaned up properly when connection converted to looback to endpoints not cleaned up properly when connection converted to loopback
- **420** - Image endpoint not cleaned up correctly


## 1.7.7

### Changes between 1.7.6 and 1.7.7


#### Issues

- **408** - setIdChanged doesn't correctly handle element sources/targets
- **410** - setConnector (whether applied via type or directly) removes custom css classes of other types
- **412** - Endpoint style cannot be transparent 
- **415** - Unnecessary endpoint may be created at when drag and drop endpoint from one node to another.

## 1.7.6

### Changes between 1.7.5 and 1.7.6

A minor bugfix release, with a few new options for controlling connection detachment (and one small backwards 
compatibility issue to be aware of)

#### Backwards Compatibility

- All versions of jsPlumb prior to 1.7.6 would fire `beforeDetach` for both new Connection drags and also 
dragging of existing Connections. As of 1.7.6 this latter behaviour has been moved to the `beforeStartDetach` 
interceptor.

#### New Functionality

-  `revalidate` now supports the same arguments as repaint - an ID, an Element, or a list-like
    object (such as the results of $(..) or document.querySelectorAll)

- added `beforeStartDetach` interceptor: a function that is called before an existing connection is dragged off of 
one of its endpoints, and which can return false to cancel the drag.

- The `unbind` method on various objects (jsPlumbInstance, Connection, Endpoint to name a few) now supports passing a 
Function to be unbound, rather than just some event name.

- Connectors now have a `getLength` function, which returns their length in pixels. To access from a Connection,
      you need to first get the connector: `someConnection.getConnector().getLength()`

#### Issues

- **350** - recalculateOffsets not working
- **353** - multiple select disabled
- **367** - rendering and drag/drop errors when parent element scrolled
- **369** - unbinding events
- **383** - jsPlumb.setDraggable fails for getElementsByClassName return value
- **392** - onMaxConnections jpc isn't defined
- **402** - offset update cache
- **404** - statemachine demo makes ghost endpoints

## 1.7.5

### Changes between 1.7.4 and 1.7.5

A minor-ish release; no changes to the API. Some refactoring of JS and of CSS. But one notable thing is that touch events on Windows touch laptops are working now (in Chrome and IE; FF seems to still have issues)

#### Backwards Compatibility

- The jQuery flavour was removed from the `main` section in `bower.json`.

#### Issues

- **295** - draggable not working in chrome
- **340** - Draggable stop event doesn't get called on all elements when dragging multiple elements
- **341** - Add possibility to change z-order of the "inPlaceCopy" endpoint.
- **344** - add getUuids method to Connection
- **345** - Error when two linked objects are with exactly same position

## 1.7.4

### Changes between 1.7.3 and 1.7.4

#### Issues

  - **237** - scroll is ignored in offset calculations
  - **314** - jsPlumbUtil is not defined (webpack)
  - **329** - Scroll issue
  - **332** - endpoint label not working in newest version
  - **333** - ReattachConnections not working when a connection is detached (jquery & vanilla 1.7.3)
  - **336** - cannot drop a connection back on the endpoint to which it was previously attached


## 1.7.3

### Changes between 1.7.2 and 1.7.3

Predominantly a minor bugfix release, this version brings a degree of uniformity to the behaviour of elements configured with `makeSource` and `makeTarget`, and is a recommended upgrade if you are currently using any other 1.7.x version.

#### New Functionality

- There is a new interceptor in this release: `beforeDrag`.  You can use it to abort dragging a connection as soon as it starts, and also to supply the initial data for a Connection that uses a parameterized type.
- Added `jsPlumb.empty` function: remove child content from a node, including endpoints and connections, but not the element itself.


#### Backwards Compatibility

- The `doWhileSuspended` method has been aliased as `batch`, and `doWhileSuspended` is now deprecated, to be removed in version 2.0.0.

#### Issues

  - **187** - jsPlumb.draggable() doesn't work with forms
  - **281** - beforeDetach not triggered by `jsPlumb.detachAllConnections`
  - **287** - Cannot drop source of connection on makeTarget element after 1.6.4
  - **289** - Cannot prevent drop of source edge using beforeDrop on nested makeTarget elements
  - **297** - Distinguish drag\click for Vanilla jsPlumb
  - **298** - Fix for using library inside shadowDom (e.g. Polymer etc.)
  - **307** - Setting Container multiple times fires events multiple times
  - **311** - addType resets overlays
  - **313** - setContainer does not work when container has overflow: scroll;
  - **315** - setConnector removes existing overlays
  - **317** - Docs incorrectly refer to "mouseenter"
  - **326** - Connections not updating position - (detach, delete, readd, reconnect)
  

## 1.7.2

### Changes between 1.7.1 and 1.7.2

- Reverted a minor bugfix introduced by the fix for issue 276
- Updated continuous anchors to allow for several Continuous anchors to be in use on the one element.

## 1.7.1

### Changes between 1.7.0 and 1.7.1

#### Issues

- **276** - TypeError on dragging empty target endpoint


## 1.7.0

### Changes between 1.6.4 and 1.7.0

#### Backwards Compatibility

- Perhaps the biggest change between 1.6.4 and 1.7.0 is that YUI and MooTools are no longer supported.  It is recommended you use vanilla jsPlumb now. jQuery is still supported but it is neither as fast nor does it have as many features as vanilla jsPlumb.

- The `parent` argument to the `makeSource` function is no longer supported. It was being kept because neither YUI nor MooTools have the ability to support a drag filter, but now that those libraries are not supported this feature has been removed.  The `filter` approach is much more powerful.

#### New Functionality

Perhaps not strictly new functionality, but shiny enough to warrant being associated with the word "new", is the fact that jsPlumb 1.7.0 is considerably faster than any previous version.  A rough comparison: the default settings for the load test in jsPlumb generate 360 connections in total between 10 elements. in 1.6.4 this test averages about 1600ms in Chrome on a Mac.  In 1.7.0 that number is about 600ms on the same computer.

#### Issues

- **178** - Detachable endpoints: different behaviour between connect() and mouse-based connections
- **214** - Endpoint stays visible when should be terminated (right mouse button)
- **242** - Distinguish drag\click for Vanilla jsPlumb
- **245** - reinstate isConnectedTo method on Endpoint
- **246** - outlineColor ignored when gradient defined in paintStyle  
- **248** - dynamic anchor create fail
- **257** - allow for the scope of a makeSource element to be changed
- **258** - Typo in documentation: s/container/Container 
- **260** - isSource and isTarget usage with makeSource and makeTarget causes broken connections
- **261** - Two target endpoints close to each other: "TypeError: Cannot read property '0' of null"
- **262** - hoverPaintStyle only works for the first connection (maxConnections > 1) 
- **263** - TypeError: conn.endpoints is null
- **267** - continuous anchors with faces set do not paint on selected faces when not connected to anything
- **268** - Endpoint "Blank" generates endpoint with class "undefined"
- **269** - Source endpoint does not/cannot respect uniqueEndpoint setting
- **270** - Support `endpointStyle` in args to addEndpoint and makeSource/makeTarget

## 1.6.4

### Changes between 1.6.3 and 1.6.4

#### Backwards Compatibility

- No issues

#### New Functionality

- Connection types support 'anchor' and 'anchors' parameters now.

#### Miscellaneous

- YUI adapter now sets a 'base' url and retrieves everything via https.


## 1.6.3

### Changes between 1.6.2 and 1.6.3

#### Backwards Compatibility

- No issues

#### New Functionality

- Added optional `allowLoopback` boolean parameter to vanilla jsPlumb's `makeTarget` method. 
- When using parameterized types, unmatched values are now replaced with blank strings, rather than being left in place. For instance, if you had `label="${foo}"`, and you passed a blank 'foo' value, you used to see `"${foo}"`. Now you see `""`.
- You can set `visible:false` on an overlay spec, to have it initially invisible.
- Added `setHoverEnabled` method to jsPlumb.
- Added `clearTypes` method to Connection and Endpoint
- Connection and Endpoint types now support `cssClass` property. These are merged into an array if multiple types declare a cssClass.


### Issues

- **222** - Endpoints incorrectly calculated when the anchor faces of source/target are set to left/right
- **223** - beforeDetach not fired by jsPlumb
- **224** - endpointStyle of the jsPlumb.connect method does not work
- **227** - MaxConnections=1 console log error
- **230** - Endpoints not cleaned up after connector move
- **236** - makeTarget/makeSource drag issues
- **241** - Dropping existing connection creates an orphaned endpoint when beforeDrop returns false
- **243** - setConnector not correctly re-assigning event handler on overlays


## 1.6.2


### Changes between 1.6.1 and 1.6.2

#### Backwards Compatibility

- 1.6.2 has improved behaviour for determining what element to use as the Container. Previous 1.6.x versions defaulted to the document body, with the docs strongly recommending you set a Container. From 1.6.2, if there is no Container set when the user makes a first call to either addEndpoint, makeSource, makeTarget or connect, the Container is set to be the offsetParent of either the element being configure (in the case of `addEndpoint`, `makeSource` and `makeTarget`), or the source element, for the `connect` method.

- a consequence of this is that you can no longer manipulate `Defaults.Container` manually. Your changes will be ignored; `Defaults.Container` is referenced only in the constructor or in the `importDefaults` method. If you need access to the current Container, use the `getContainer` method.

- the order of parameters to the function `jsPlumbInstance.on` has changed, in the case that you are passing 4 parameters and using it for event delegation.  Previously, the order was `(element, filter, eventId, callback)` and now the order is `(element, eventId, filter, callback)`. This brings it into line with the order of parameters in jQuery's `on` function.  It is not very likely this will affect you: `jsPlumbInstance.on` is used internally, mostly (although it can be used to register events independently of jsPlumb if you want to use it).

### New Functionality

- The Container inferencing discussed above is both a backwards compatibility issue and also new functionality!
- added `setContainer`, to allow you to move an entire jsPlumb UI to some new parent
- added `getContainer`, to allow you to retrieve the current Container.

### Issues

- **207** - problem with absolute overlays
- **211** - setVisible(true) on hidden overlay whose connection has moved causes the overlay to repaint in the wrong place

## 1.6.1

This is a minor release in which a few issues related to zooming have been fixed.

### Changes between 1.6.0 and 1.6.1

#### Backwards Compatibility

No issues

#### Issues

- **206** Fix documentation error about jsPlumb.Defaults.Endpoints

#### New Functionality

Better handling of zooming in vanilla jsPlumb.


## 1.6.0

Version 1.6.0 is a major release of jsPlumb. With this version ships a "vanilla" version - it relies on no external libraries, and also has a few features that the other library adapters do not (see below). 

### Changes between 1.5.5 and 1.6.0

#### Backwards Compatibility

- There is no support for the canvas renderer in jsPlumb 1.6.0.
- The way in which library adapters inject their functionality into jsPlumb has changed. This will affect very few people; contact jsPlumb if you need help with this.
- All elements added by jsPlumb are appended to the current "Container", which defaults to the document body. This differs from previous versions, in which if there was no Container set then jsPlumb would append elements to the parent of a connection's source endpoint. For this reason it is now more than ever recommended that you set a Container.	 
- The `container` parameter on `addEndpoint` or `connect` calls is no longer supported.

#### Issues

  - **91**  - Old ID is being used on events after setId
  - **143** - SVG gradient fails when page url already contains a hash
  - **153** - jsPlumb.animate no longer supports jQuery selectors
  - **157** - connectionMoved event not fired (when using makeTarget)
  - **162** - Connector 'Flowchart' occurs an error.
  - **164** - makeSource fails when used in conjunction with uniqueEndpoint
  - **173** - jsPlumb.setDraggable([element_id],false); fails
  - **177** - Flowchart straight Line
  - **202** - Spurious mouse events in connector with outline
  - **203** - hoverClass on endpoints doesn't work

#### New Functionality

##### DOM Adapter

It isn't actually true to say that this adapter has no external dependencies; it actually relies on a couple of new projects written specifically for this ([Mottle](https://github.com/jsplumb/mottle) for events, and [Katavorio](https://github.com/jsplumb/katavorio) for drag/drop support. However, these dependencies are wrapped into the concatenated jsPlumb 1.6.0 JS file.

###### Multiple element dragging

The DOM adapter supports dragging (and dropping!) multiple elements at once.

###### Multiple drag/drop scopes

Also supported are multiple scopes for each draggable/droppable element.

###### Using Vanilla jsPlumb with jQuery

Even if you have jQuery in the page you can use vanilla jsPlumb; it will accept jQuery selectors as arguments. Keep in mind that you won't get jQuery selectors out of it, though - any methods that return an Element will return plain DOM Elements and you'll need to turn them in jQuery selectors yourself.

#### Miscellaneous

- Events now have `this` set correctly
- Added qUnit tests for Vanilla, YUI and MooTools adapters
- Various YUI and MooTools methods were upgraded to support passing in an element list (`setId` for one)
- Added setSource/setTarget methods, allowing you to retarget a Connection programmatically.
- Reduced the amount of functionality that is delegated to a support library
- Rewrote the way support libraries are integrated

## 1.5.5

### Changes between 1.5.4 and 1.5.5

#### Issues

- **138** - allow for connection type to be derived from connection params AND endpoint params.

## 1.5.4

### Changes between 1.5.3 and 1.5.4

#### Issues
- **105** - Blank endpoint cleanup fails
- **116** - Assign anchors wont connect
- **117** - Assign anchors fail on source
- **127** - Docs on making elements draggable should note required CSS
- **128** - expose original event on `connectionDragStop` callback
- **129** - connection event fired twice by makeTarget with parent option.

#### New Functionality

- `"Assign"` anchors now work with the `makeSource` method.
- The `connectionDragStop` event now supplies the original event as the second argument to the callback function.

#### Miscellaneous

  - fixed an issue causing SVG gradients to fail when a BASE tag is present in the document.

## 1.5.3
### Changes between 1.5.2 and 1.5.3

#### Backwards Compatibility

- The fix for issue 112 involved making a change to the circumstances under which a `connectionDetached` event is fired. When you drag the source or target of an existing connection to some other endpoint, `connectionDetached` is no longer fired. Instead, a `connectionMoved` event is fired, containing the connection that was moved, the index of the endpoint that changed (0 for source, 1 for target), and the original and new source and target endpoints.

#### Issues

- **77** - Endpoint types should support Anchor parameter         
- **88** - reinstate labelStyle parameter on Label overlay.
- **90** - overlay setVisible not working (SVG/VML)
- **95** - Nested element positions not updated
- **100** - add setParent function
- **101** - JS error when detaching connection during connection callback
- **103** - IE8: connector hide does not hide overlays or background lines
- **107** - remove the necessity to set isSource/isTarget in order to make an endpoint draggable
- **108** - strange anchor orientation behaviour
- **109** - Dropping new connections on overlapping elements leads to crash after connection is deleted
- **111** - Absolute positioned arrow in wrong location
- **112** - Deleting a connection after changing its source endpoint causes failure.
- **113** - IE8 - state machine - loops are not displayed

#### New Functionality
- A setParent function was added. jsPlumb changes the parent of some element and updates its internal references accordingly (issue 100).
- Endpoint types now support the anchor parameter (issue 77)
- The `labelStyle` parameter on Label overlays has made a comeback (issue 88). The argument went along the lines of it being useful if you wanted to programmatically generate a label style.
- jsPlumb now automatically updates the internal offsets of some element that has draggable children (obviating the need for you to call `recalculateOffsets` yourself).
- When making a programmatic connection to an endpoint that was not marked `isSource:true` or `isTarget:true`, if the connection is detachable then the endpoint is made draggable, in order to allow users to drag the connection to detach it. Connections dragged off of source or target endpoints in this way can be dropped back onto their original endpoint or onto other endpoints with the same scope, but you cannot subsequently drag a new connection from an endpoint that has been made draggable by this method.
- `connectionMoved` event added. This is fired whenever the source or target of an existing connection is dragged to some other Endpoint.


#### Miscellaneous

- An issue was fixed that was preventing the ability to supply a dynamic anchor with parameters, eg

    `[ [ [ 1,0,0,1], [1,1,1,1] ], { selector:function() { ... } } ]`


## 1.5.2
### Changes between 1.5.1 and 1.5.2

#### Backwards Compatibility

- Issue 86, fixed in 1.5.2, changes the priority in which parameters are applied to a connection. The documentation has always stated that source takes priority, but in fact the code was the other way round, with target taking priority. Now source does take priority.

#### Issues

- **84** - jsPlumb 1.5.1 Arrow Disappears on IE8 when connector is straight
- **85** - dragging target endpoints created by makeTarget not working
- **86** - Connection parameters override order

#### Miscellaneous

- An issue that caused the SVG renderer to paint overlays before the connector was ready when the types API was used was also fixed.

## 1.5.1
### Changes between 1.5.0 and 1.5.1

#### Issues

- **81** - Uncaught TypeError: Cannot read property 'uuid' of null
- **82** - Blank endpoint doesn't cleanup properly
- **83** - for connections made with makeTarget originalEvent is not set

## 1.5.0
### Changes between 1.4.1 and 1.5.0

Release 1.5.0 contains several bugfixes and one or two minor enhancements, but the biggest change since 1.4.1 is the way jsPlumb handles inheritance internally - it has switched from a 'module pattern' architecture to a prototypal-based setup.  The module pattern is good for information hiding, but it makes objects bigger, and its far easier to leak memory with that sort of arrangement than it is with a prototypal inheritance scheme. 

The build has been switched from the original Ant build to Grunt with release 1.5.0, and with this has come the ability to 
build versions of jsPlumb that omit functionality you do not need (see [here](Build)).

  1. [Backwards Compatibility](#backwards)
  - [New Functionality](#new)
  - [Issues Fixed](#issues)
  - [Miscellaneous](#misc)

<a name="backwards"></a>
### Backwards Compatibility
	   
- `jsPlumb.addClass`, `jsPlumb.removeClass` and removed `jsPlumb.hasClass` removed. You don't need these. You can use the methods from the underlying library.
- `makeTargets` method removed from jsPlumb. You can pass an array or selector to `makeTarget`.
- `makeSources` method removed from jsPlumb. You can pass an array or selector to `makeSource`.
- `jsPlumb.detach` no longer supports passing in two elements as arguments.  Use instead either 


`jsPlumb.detach({source:someDiv, target:someOtherDiv});`

or

`jsPlumb.select({source:someDiv, target:someOtherDiv}).detach();`

- `jsPlumbConnectionDetached` event, which was deprecated, has been removed. Use `connectionDetached`.
- `jsPlumbConnection` event, which was deprecated, has been removed. Use `connection`.
- `Endpoint.isConnectedTo` method removed.  it didnt work properly as it only checked for connections where the Endpoint was the source.
- Many places in jsPlumb that used to use library-specific selectors for elements now use pure DOM elements.  It is best to re-select any elements you are getting from a jsPlumb object, even if you supplied them as a selector, as jsPlumb will have unwrapped your selector into a DOM element.

<a name="new"></a>
### New Functionality
  	     
- `jsPlumb.setSuspendDrawing` returns the value of `suspendDrawing` _before_ the call was made.
- `Endpoint.setElement` works properly now.
 
<a name="issues"></a>
### Issues Fixed

- **27** - investigate why a new connection is created after drag          
- **37** - .addClass() not working - IE8
- **39** - problem about connectionDrag event
- **49** - Calling detachEveryConnection winds up calling repaintEverything once for each endpoint
- **51** - arrow overlay orientation at location 1 on flowchart connectors
- **54** - Memory Leak Issue
- **57** - DOMException while dragging endpoints
- **60** - flowchart connector start position wrong
- **63**  - Flowchart midpoint=0 is ignored 
- **65** - Uncaught exception in IE 8
- **69** - jsPlumb.detach(connection) is really slow with larger graphs
- **72** - Drag and drop connections fail to work correctly when using makeTarget
- **75** - changing continuous anchor is ignored
- **76** - jsPlumb doesn't work in XHTML documents         

<a name="misc"></a>
### Miscellaneous

Nothing to report.
