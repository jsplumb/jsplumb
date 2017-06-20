## Querying jsPlumb

- **Connections**
  - [Selecting and operating on a list of Connections](#select)
    - [Setter operations](#selectSetters)
    - [Getter operations](#selectGetters)
    - [Examples](#selectExamples)
    - [Iterating through results](#selectIterate)
    - [Other properties/functions](#selectOther)
  - [Retrieving static Connection lists](#getConnections)
    - [Retrieving connections for a single scope](#getConnectionsSingleScope)
    - [Filtering by source, target and/or scope](#getConnectionsAdvanced)
    - [Examples](#getConnectionsExamples)
- **Endpoints**
  - [Selecting and operating on a list of Endpoints](#selectEndpoints)
  - [Setter Methods](#selectEndpointsSetters)
  - [Getter Methods](#selectEndpointsGetters)
  - [Other Methods/Properties](#selectEndpointsOther)
  - [Examples](#selectEndpointsExamples)

### Connections

<a name="select"></a>
#### Selecting and operating on a list of Connections
The `jsPlumb.select` function provides a fluid interface for working with lists of Connections.  The syntax used to 
specify which Connections you want is identical to that which you use for `getConnections`, but the return value is an 
object that supports most operations that you can perform on a Connection, and which is also chainable, for setter methods. 
Certain getter methods are also supported, but these are not chainable; they return an array consisting of all the 
Connections in the selection along with the return value for that Connection.

<a name="selectSetters"></a>
##### Setter Operations
This is the full list of setter operations supported by jsPlumb.select:

- addClass
- removeClass
- addOverlay
- removeOverlay
- removeOverlays
- showOverlay
- hideOverlay
- showOverlays
- hideOverlays
- removeAllOverlays
- setLabel
- setPaintStyle
- setHoverPaintStyle
- setDetachable
- setReattach
- setConnector
- setParameter
- setParameters
- detach
- repaint
- setType
- addType
- removeType
- toggleType
- setVisible

Each of these operations returns a selector that can be chained.

<a name="selectGetters"></a>
##### Getter Operations
This is the full list of getter operations supported by `jsPlumb.select`:

- getLabel
- getOverlay
- isHover
- isVisible
- isDetachable
- isReattach
- getParameter
- getParameters
- getType    
- hasType

Each of these operations returns an array whose entries are [ value, Connection ] arrays, where `value` is the return value from the given Connection.  Remember that the return values from a getter are not chainable, but a getter may be called at the end of a chain of setters.

<a name="selectExamples"></a>
##### Examples
			
- Select all Connections and set their hover state to be false:

```javascript
jsPlumb.select().setHover(false);
```

- Select all Connections from "d1" and remove all Overlays:

```javascript
jsPlumb.select({source:"d1"}).removeAllOverlays();
```

- Select all connections in scope "foo" and set their paint style to be a thick blue line:

```javascript
jsPlumb.select({scope:"foo"}).setPaintStyle({
        stroke:"blue", 
        strokeWidth:5 
});
```

- Select all Connections from "d1" and detach them:

```javascript
jsPlumb.select({source:"d1"}).detach();
```

- Select all Connections and add the classes "foo" and "bar" to them :

```javascript
jsPlumb.select().addClass("foo bar");
```

- Select all Connections and remove the class "foo" from them :

```javascript
jsPlumb.select().removeClass("foo");
```

<a name="selectIterate"></a>
##### Iterating through results

The return value of `jsPlumb.select` has a `.each` function that allows you to iterate through the list, performing an operation on each one:

```javascript
jsPlumb.select({scope:"foo"}).each(function(connection) {
		// do something 
});
```

`.each` is itself chainable:

```javascript
jsPlumb.select({scope:"foo"}).each(function(connection) {	
		// do something 
}).setHover(true);
```

<a name="selectOther"></a>
##### Other properties/functions
- **length** - this member reports the number of Connections in the selection
- **get(idx)** - this function allows you to retrieve a Connection from the selection

<a name="getConnections"></a>
#### Retrieving static Connection lists

As well as the `select` method, jsPlumb has another method that can be used to retrieve static lists of Connections - `getConnections`. The return value of this method is not chainable and does not offer operations on the Connections in the way that the return value of `select` does.
			
<a name="getConnectionsSingleScope"></a>
##### Retrieving connections for a single scope
To do this, you call `getConnections` with either no arguments, in which case jsPlumb uses the default scope, or with a string specifying one scope

```javascript
var connectionList = jsPlumb.getConnections(); // you get a list of Connection objects that are in the default scope.
```

Compare this with:

```javascript
var connectionList = jsPlumb.getConnections("myScope");     // you get a list of Connection objects that are in "myScope".
```

<a name="getConnectionsAdvanced"></a>
##### Filtering by source, target and/or scope
`getConnections` optionally takes a JS object specifying filter parameters, of which there are three:

- **scope** - the scope(s) of the connection type(s) you wish to retrieve
- **source** - limits the returned connections to those that have this source id
- **target** - limits the returned connections to those that have this target id

Each of these three parameters may be supplied as a string, which for source and target is an element id and for scope is the name of the scope, or a list of strings.  Also, you can pass "*" in as the value for any of these - a wildcard, meaning any value.  See the examples below.

**Important:** The return value of a call to `getConnection` using a JS object as parameter varies on how many scopes you defined.  If you defined only a single scope then jsPlumb returns you a list of Connections in that scope.  Otherwise the return value is a dictionary whose keys are  scope names, and whose values are lists of Connections. For example, the following call:

```javascript
jsPlumb.getConnections({
  scope:["someScope", "someCustomScope"]
});
```

would result in this output:

```javascript
{
  "someScope" : [ 1..n Connections ],
  "someCustomScope": [ 1..m Connections ]
}
```

This has tripped up many a developer who has been reluctant to take the time to read the documentation.  

There is an optional second parameter that tells getConnections to flatten its output and just return you an array.  The previous example with this parameter would look like this:

```javascript
jsPlumb.getConnections({
  scope:["someScope", "someCustomScope"]
}, true);
```

...and would result in this output:

    [ 1..n Connections ]

<a name="getConnectionsExamples"></a>
The following examples show the various ways you can get connection information:

- Get all connections:	
```
jsPlumb.getAllConnections();
```
- Get all connections for the default scope only(return value is a list):
```javascript
jsPlumb.getConnections();
```
- Get all connections for the given scope (return value is a list):	
```javascript
jsPlumb.getConnections({scope:"myTestScope"});
```

- Get all connections for the given scopes (return value is a list if only connections for the default scope exist, otherwise its a map of scope names to connection lists):	
```javascript
jsPlumb.getConnections({
    scope:["myTestScope", "yourTestScope"]
});
```

- Get all connections for the given source (return value is a list if only connections for the default scope exist, otherwise its a map of scope names to connection lists):
```javascript
jsPlumb.getConnections({
    source:"mySourceElement"
});
```

- Get all connections for the given sources (return value is a list if only connections for the default scope exist, otherwise its a map of scope names to connection lists):	
```javascript
jsPlumb.getConnections({
    source:["mySourceElement", "yourSourceElement"]
});
```

- Get all connections for the given target (return value is a list if only connections for the default scope exist, otherwise its a map of scope names to connection lists):
```javascript
jsPlumb.getConnections({
    target:"myTargetElement"
});
```

- Get all connections for the given source and targets (return value is a list if only connections for the default scope exist, otherwise its a map of scope names to connection lists):
```javascript
jsPlumb.getConnections({
        source:"mySourceElement", 
        target:["target1", "target2"]
});
```

- Get all connections for the given scope, with the given source and target (return value is a list of connections):
```javascript
jsPlumb.getConnections({
        scope:'myScope", 
        source:"mySourceElement", 
        target:"myTargetElement"
});
```

<a name="selectEndpoints"></a>
### Selecting and operating on a list of Endpoints
`jsPlumb.selectEndpoints` provides a fluid interface for working with lists of Endpoints.

The syntax used to specify which Endpoints you want is identical to that which you use for `jsPlumb.select`, and the return value is an object that supports most operations that you can perform on an Endpoint (and which is also chainable, for setter methods). Certain getter methods are also supported, but these are not chainable; they return an array consisting of all the Endpoints in the selection along with the return value for that Endpoint.	

Four parameters are supported by selectEndpoints - each of these except `scope` can be provided as either a string, a selector, a DOM element, or an array of a mixture of these types.  `scope` can be provided as either a string or an array of strings:        

- **element** - element(s) to get both source and target endpoints from
- **source** - element(s) to get source endpoints from
- **target** - element(s) to get target endpoints from
- **scope** - scope(s) for endpoints to retrieve
            
<a name="selectEndpointsSetters"></a>
#### Setter Operations
This is the full list of setter operations supported by `jsPlumb.selectEndpoints`: 

- addClass                
- removeClass
- addOverlay
- removeOverlay
- removeOverlays
- showOverlay
- hideOverlay
- showOverlays
- hideOverlays
- removeAllOverlays
- setLabel
- setPaintStyle
- setHoverPaintStyle
- setConnector
- setParameter
- setParameters
- repaint
- setType
- addType
- removeType
- toggleType
- setVisible
- setAnchor

Each of these operations returns a selector that can be chained.

<a name="selectEndpointsGetters"></a>
#### Getter Operations
This is the full list of getter operations supported by `jsPlumb.selectEndpoints`:     

- getLabel
- getOverlay
- isHover
- isVisible				
- getParameter
- getParameters
- getType
- hasType  
- getAnchor

Each of these operations returns an array whose entries are `[ value, Endpoint ]` arrays, where 'value' is the return value from the given Endpoint. Remember that the return values from a getter are not chainable, but a getter may be called at the end of a chain of setters.

<a name="selectEndpointsOther"></a>
#### Other methods/properties (not chainable):

- **delete** - deletes the Endpoints in the selection
- **detachAll** - detaches all Connections from the Endpoints in the selection          
- **length** - this member reports the number of Endpoints in the selection
- **get(idx)** - this function allows you to retrieve an Endpoint from the selection

<a name="selectEndpointsExamples"></a>
#### Examples

- Select all Endpoints and set their hover state to be false:
```javascript
jsPlumb.selectEndpoints().setHover(false);
```

- Select all source Endpoints on "d1" and remove all Overlays:
```javascript
jsPlumb.selectEndpoints({source:"d1"}).removeAllOverlays();
```

- Select all source Endpoints on "d1" and add the classes "foo" and "bar" to them :
```javascript
jsPlumb.selectEndpoints({source:"d1"}).addClass("foo bar");
```

- Select all source Endpoints on "d1" and remove the class "foo" from them :
```javascript
jsPlumb.selectEndpoints({source:"d1"}).removeClass("foo");
```

- Select all Endpoints in scope "foo" and set their fill style to be blue:
```javascript
jsPlumb.selectEndpoints({ scope:"foo" }).setPaintStyle({ fill:"blue" });
```

- Select all Endpoints from "d1" and detach their Connections:
```javascript
jsPlumb.selectEndpoints({source:"d1"}).detachAll();
```

##### `.each` iterator
The return value of jsPlumb.selectEndpoints also has a `.each` function that allows you to iterate through the list, performing an operation on each one:
```javascript
jsPlumb.selectEndpoints({scope:"foo"}).each(function(endpoint) {
	
		// do something 
});
```

`.each` is itself chainable:

```javascript
jsPlumb.selectEndpoints({scope:"foo"}).each(function(endpoint) {
	
		// do something 

}).setHover(true);
```