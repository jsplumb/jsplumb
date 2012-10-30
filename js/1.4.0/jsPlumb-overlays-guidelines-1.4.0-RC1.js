    // this is really just a test overlay, so its undocumented and doesnt take any parameters. but i was loth to delete it.
    jsPlumb.Overlays.GuideLines = function() {
        var self = this;
        self.length = 50;
        self.lineWidth = 5;
        this.type = "GuideLines";
		AbstractOverlay.apply(this, arguments);
        jsPlumb.jsPlumbUIComponent.apply(this, arguments);
        this.draw = function(connector, currentConnectionPaintStyle, connectorDimensions) {

            var head = connector.pointAlongPathFrom(self.loc, self.length / 2),
                mid = connector.pointOnPath(self.loc),
                tail = jsPlumbUtil.pointOnLine(head, mid, self.length),
                tailLine = jsPlumbUtil.perpendicularLineTo(head, tail, 40),
                headLine = jsPlumbUtil.perpendicularLineTo(tail, head, 20);

            self.paint(connector, [head, tail, tailLine, headLine], self.lineWidth, "red", null, connectorDimensions);

            return [Math.min(head.x, tail.x), Math.min(head.y, tail.y), Math.max(head.x, tail.x), Math.max(head.y,tail.y)];
        };

        this.computeMaxSize = function() { return 50; };

    	this.cleanup = function() { };  // nothing to clean up for GuideLines
    };

// a test
    jsPlumb.Overlays.svg.GuideLines = function() {
        var path = null, self = this, path2 = null, p1_1, p1_2;
        jsPlumb.Overlays.GuideLines.apply(this, arguments);
        this.paint = function(connector, d, lineWidth, strokeStyle, fillStyle) {
    		if (path == null) {
    			path = _node("path");
    			connector.svg.appendChild(path);
    			self.attachListeners(path, connector);
    			self.attachListeners(path, self);

                p1_1 = _node("path");
    			connector.svg.appendChild(p1_1);
    			self.attachListeners(p1_1, connector);
    			self.attachListeners(p1_1, self);

                p1_2 = _node("path");
    			connector.svg.appendChild(p1_2);
    			self.attachListeners(p1_2, connector);
    			self.attachListeners(p1_2, self);

    		}

    		_attr(path, {
    			"d"		:	makePath(d[0], d[1]),
    			stroke 	: 	"red",
    			fill 	: 	null
    		});

            _attr(p1_1, {
    			"d"		:	makePath(d[2][0], d[2][1]),
    			stroke 	: 	"blue",
    			fill 	: 	null
    		});

            _attr(p1_2, {
    			"d"		:	makePath(d[3][0], d[3][1]),
    			stroke 	: 	"green",
    			fill 	: 	null
    		});
    	};

        var makePath = function(d1, d2) {
            return "M " + d1.x + "," + d1.y +
                   " L" + d2.x + "," + d2.y;
        };
    };