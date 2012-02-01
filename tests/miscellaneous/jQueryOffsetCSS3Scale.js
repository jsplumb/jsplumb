jQuery.fn.offsetzz = function( options ) {
		var elem = this[0], box;

		if ( options ) {
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box ? { top: box.top, left: box.left } : { top: 0, left: 0 };
		}

		var body = doc.body,
			win = window,
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop,
			scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft,
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

        var r = /scale\(([0-9]*\.?[0-9]*)\)/,
            offsetParent = (elem.tagName.toLowerCase() === "svg" && elem.parentNode) ? elem.parentNode : elem.offsetParent,
            t = offsetParent ? offsetParent.style.transform ||
                               offsetParent.style.MozTransform ||
                               offsetParent.style.OTransform : null,
            scale = (offsetParent && t) ? t.match(r)[1] : null;

		if (scale) {
            var pBox = offsetParent.getBoundingClientRect(),
                dl = left - pBox.left,
                dt = top - pBox.top,
                dls = dl / scale,
                dts = dt / scale;

            console.log("PARENT SCALE IS " + scale);
            //top = pBox.top + dt;
            //left = pBox.left + dl;
            top = pBox.top + dts;
            left = pBox.left + dls;
        }


		return { top: top, left: left };
	};