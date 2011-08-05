// JavaScript Document
EP_MIN_DIS = 10;         // the min distance between two endpoints
exampleDropOptions =
{
	tolerance:'touch',
	hoverClass:'dropHover',
	activeClass:'dragActive'
};
// end points
/**
					first example endpoint.  it's a 25x21 rectangle (the size is provided in the 'style' arg to the Endpoint), and it's both a source
					and target.  the 'scope' of this Endpoint is 'exampleConnection', meaning any connection starting from this Endpoint is of type
					'exampleConnection' and can only be dropped on an Endpoint target that declares 'exampleEndpoint' as its drop scope, and also that
					only 'exampleConnection' types can be dropped here.
 
					the connection style for this endpoint is a Bezier curve (we didn't provide one, so we use the default), with a lineWidth of
					5 pixels, and a gradient.
 
					note the use of the '$.extend' function to setup generic connection types.  this will save you a lot of typing, and probably
					errors.
 
				*/

InputEPColor = '#00f';
InputEP = 
{
	endpoint : "Rectangle",
	isSource : false,
	isTarget : true,
	paintStyle: { width:20, height:20, fillStyle : InputEPColor},
	connectorStyle : {
		gradient : {stops : [[0, InputEPColor], [0.5, '#09098e'], [1, InputEPColor]]},
		lineWidth : 5,
		strokeStyle : InputEPColor
	},
	dropOptions : exampleDropOptions
};

OutputEPColor = '#f00';
OutputEP =
{
		endpoint : [ "Rectangle", { width:20, height:20 } ],
		isSource : true,
		isTarget : false,
		paintStyle: { fillStyle : OutputEPColor },
		connectorStyle : {
			gradient : {stops : [[0, OutputEPColor], [0.5, '#09098e'], [1, OutputEPColor]]},
			lineWidth : 5,
			strokeStyle : OutputEPColor
		} 	
};

ControlColor = '#000';
ControlEP =
{
		endpoint : [ "Rectangle", { width:10, height:10 } ],
		isSource : false,
		isTarget : true,
		paintStyle: { fillStyle : ControlColor },
		connectorStyle : {
			gradient : {stops : [[0, ControlColor], [0.5, '#09098e'], [1, ControlColor]]},
			lineWidth : 5,
			strokeStyle : ControlColor
		},
		dropOptions : exampleDropOptions
};

RDColor = '#FFFF5C';
RDEP =
{
		endpoint : [ "Dot", { radius:10 } ],
		isSource : false,
		isTarget : false,
		paintStyle: { fillStyle : RDColor },
		connectorStyle : {
			gradient : {stops : [[0, RDColor], [0.5, '#09098e'], [1, RDColor]]},
			lineWidth : 10,
			strokeStyle : RDColor
		},
		dropOptions : exampleDropOptions
};

NumberEPColor = '#00f';
NumberEP = 
{
	endpoint:[ "Rectangle", { width:5, height:5 } ],
	paintStyle:{fillStyle:NumberEPColor },
	isSource:true,
	scope:'blue rectangle',
	connectorStyle : {
				gradient:{stops:[[0, NumberEPColor], [0.5, '#09098e'], [1, NumberEPColor]]},
				lineWidth:5,
				strokeStyle:NumberEPColor
			},
	isTarget:true,
	dropOptions : exampleDropOptions
};
/**
	the second example uses a Dot of radius 15 as the endpoint marker, is both a source and target, and has scope
	'exampleConnection2'.
*/
StringEPColor = '#316b31';
StringEP = 
{
	endpoint: [ "Dot", { radius:5 } ],
	style:{ strokeStyle:StringEPColor },
	isSource:true,
	scope:'green dot',
	connectorStyle:{ strokeStyle:StringEPColor, lineWidth:8 },
	connector: new jsPlumb.Connectors.Bezier(63),
	maxConnections:3,
	isTarget:true,
	dropOptions : exampleDropOptions
};

/**
the third example uses a Dot of radius 17 as the endpoint marker, is both a source and target, and has scope
'exampleConnection3'.  it uses a Straight connector, and the Anchor is created here (bottom left corner) and never
overriden, so it appears in the same place on every element.

this example also sets the 'reattach' flag for the Endpoint, meaning that when you drag a
connection off an endpoint and release it, it snaps back.  the default behaviour in this case
is to delete the connection.

*/
NumberArrayEPColor = "rgba(229,219,61,0.5)";
NumberArrayEP = 
{
	endpoint:[ "Dot", { radius:10 } ],
	reattach:true,
	anchor:"BottomLeft",
	style:{ strokeStyle:NumberArrayEPColor, opacity:0.5 },
	isSource:true,
	scope:'yellow dot',
	connectorStyle:{ strokeStyle:NumberArrayEPColor, lineWidth:4 },
	connector : new jsPlumb.Connectors.Straight(),
	isTarget:true,
	dropOptions : exampleDropOptions
};
