/*
 * this is experimental and probably will not be used.  solutions exist for most libraries.  but of course if
 * i want to support multiple scopes at some stage then i will have to do dragging inside jsPlumb.
 */ 
;(function() {
    
    window.jsPlumbDrag = function(_jsPlumb) {
      
        var ta = new TouchAdapter();
        
        this.draggable = function(selector) {
            var el, elId, da = [], elo, d = false,
                isInSelector = function(el) {
                    if (typeof selector == "string")
                        return selector === _jsPlumb.getId(el);
                    
                    for (var i = 0; i < selector.length; i++) {
                        var _sel = jsPlumb.CurrentLibrary.getDOMElement(selector[i]);
                        if (_sel == el) return true;
                    }
                    return false;
                };
				
			ta.bind(document, "mousedown", function(e) {
                var target = e.target || e.srcElement;
                if (isInSelector(target)) {
                    el = jsPlumb.CurrentLibrary.getElementObject(target);
                    elId = _jsPlumb.getId(el);
                    elo = jsPlumb.CurrentLibrary.getOffset(el);
                    da = [e.pageX, e.pageY];
                    d = true;
                }
			});
			
			ta.bind(document, "mousemove", function(e) {
				if (d) {
					var dx = e.pageX - da[0],
						dy = e.pageY - da[1];
						
					jsPlumb.CurrentLibrary.setOffset(el, {
						left:elo.left + dx,
						top:elo.top + dy
					});
					_jsPlumb.repaint(elId);
					e.preventDefault();
					e.stopPropagation();
				}
			});
			ta.bind(document, "mouseup", function(e) {
				el = null;
				d = false;				
			});    
        };
        
        var isIOS = ((/iphone|ipad/gi).test(navigator.appVersion));
        if (isIOS)
            _jsPlumb.draggable = this.draggable;
        
    };
    
})();