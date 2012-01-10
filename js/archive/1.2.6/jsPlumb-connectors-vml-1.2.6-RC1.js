;(function() {
	
	document.createStyleSheet().addRule(".jsplumb_vml", "behavior:url(#default#VML);border:1px solid red;position:absolute;");
	document.namespaces.add("jsplumb", "urn:schemas-microsoft-com:vml");
	
	var scale = 1000,
	_atts = function(o, atts) {
		for (var i in atts) o.setAttribute(i, atts[i]);
	},
	_node = function(name, d, atts) {
		var o = document.createElement("jsplumb:" + name);
		o.className = "jsplumb_vml";
		_pos(o, d);
		atts["coordsize"] = (d[2] * scale) + "," + (d[3] * scale);
		_atts(o, atts);
		document.body.appendChild(o);		
		return o;
	},
	_pos = function(o,d) {
		o.style.left = d[0] + "px";		
		o.style.top =  d[1] + "px";
		o.style.width= d[2] + "px";
		o.style.height= d[3] + "px";
		/*
		o.left = d[0];
		o.top = d[1];
		o.width = d[2];
		o.height = d[3];
		*/
	},
	_conv = function(v) {
		return Math.floor(v * scale);
	},
	_toHex = function(n) {
		var _n = function(k) {
			var h = Number(k).toString(16);
			return k < 16 ? "0" + h : "" + h;
		};
		var o = "#" + _n(n[0]) + _n(n[1]) + _n(n[2]);
		if (n.length == 4) o = o + _n(n[3]);
		return o;
	},
	_convertStyle = function(s) {
		var p = /(rgb[a]?\()(.*)(\))/;
		if (s.match(p)) {
			var parts = s.match(p)[2].split(",");
			return _toHex(parts);
		}
		else return s;
	};
	
	/*
	 * Class: VmlComponent
	 * base class for Vml endpoints and connectors. 
	 */
	var VmlComponent = function() {				
		jsPlumb.jsPlumbUIComponent.apply(this, arguments);		
	};
	
	/*
	 * Class: VmlConnector
	 * base class for Vml connectors. extends VmlComponent.
	 */
	var VmlConnector = function() {
		var self = this, vml = null;
		VmlComponent.apply(this, arguments);
		this.paint = function(d, style, anchor) {
			if (style != null) {				
				var path = self.getPath(d), p = {};
				if (style.strokeStyle) {
					p["stroked"] = "true";
					p["strokecolor"] =_convertStyle(style.strokeStyle);
					p["strokeweight"] = style.lineWidth + "px";
				}
				else p["stroked"] = "false";
				if (style.fillStyle) {
					p["filled"] = "true";
					p["fillcolor"] = _convertStyle(style.fillStyle);
				}
				else p["filled"] = "false";
				p["path"] = path;
				if (vml == null) {
					vml = _node("shape", d, p);
				//	console.log("c init at " + d[0] + "," + d[1] + "," +d[2] + "," + d[3] + "," + d[4] + "," + d[5]+ "," + d[6] + "," + d[7]);
				}
				else {
					//console.log("c set pos " + d[0] + "," + d[1] + "," +d[2] + "," + d[3] + "," + d[4] + "," + d[5]+ "," + d[6] + "," + d[7]);
					_pos(vml, d);
					_atts(vml, p);
				}
			}
		};
	};
		
	/*
	 * Class: VmlEndpoint
	 * base class for Vml endpoints. extends VmlComponent.
	 */
	var VmlEndpoint = function() {
		VmlComponent.apply(this, arguments);
		var vml = null, self = this;
		this.paint = function(d, style, anchor) {
			var p = {};
			if (style.strokeStyle) {
				p["stroked"] = "true";
				p["strokecolor"] =_convertStyle(style.strokeStyle);
				p["strokeweight"] = style.lineWidth + "px";
			}
			if (style.fillStyle) {
				p["filled"] = "true";
				p["fillcolor"] = style.fillStyle;
			}
			//d[2] = _conv(d[2]);d[3] = _conv(d[3]);
			if (vml == null) {
				vml = self.getVml(d, p, anchor);
				//console.log("e init at " + d[0] + "," + d[1] + "," +d[2] + "," + d[3] + "," + d[4] );
			}
			else {
				_pos(vml, d);
				_atts(vml, p);
				//console.log("e set pos " + d[0] + "," + d[1] + "," +d[2] + "," + d[3] + "," + d[4] );
			}
		};
	};
	
	jsPlumb.Connectors.vml.Bezier = function() {
		jsPlumb.Connectors.Bezier.apply(this, arguments);	
		VmlConnector.apply(this, arguments);
		this.getPath = function(d) {
			return "M" + _conv(d[4]) + "," + _conv(d[5]) + " C" + _conv(d[8]) + "," + _conv(d[9]) + "," + _conv(d[10]) + "," + _conv(d[11]) + "," + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};
	
	jsPlumb.Connectors.vml.Straight = function() {
		jsPlumb.Connectors.Straight.apply(this, arguments);	
		VmlConnector.apply(this, arguments);
		this.getPath = function(d) {
			return " m" + _conv(d[4]) + "," + _conv(d[5]) + " l" + _conv(d[6]) + "," + _conv(d[7]) + " e";
		};
	};
	
	jsPlumb.Endpoints.vml.Dot = function() {
		jsPlumb.Endpoints.Dot.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor) { return _node("oval", d, atts); };
	};
	
	jsPlumb.Endpoints.vml.Rectangle = function() {
		jsPlumb.Endpoints.Rectangle.apply(this, arguments);
		VmlEndpoint.apply(this, arguments);
		this.getVml = function(d, atts, anchor) { return _node("rect", d, atts); };
	};
})();
