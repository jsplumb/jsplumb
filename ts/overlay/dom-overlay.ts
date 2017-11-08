import {Overlay} from "./overlay";
import {ArrayLocation} from "../jsplumb-defaults";
import {isPathBasedComponent, PathBasedComponent} from "../component/path-based-component";
import {JsPlumbInstance} from "../core";
import {EventGenerator} from "../event/event-generator";

export abstract class DOMOverlay<EventType, ElementType> extends Overlay<EventType, ElementType> {

    detached:Boolean = false;
    id:string;
    cssClass:string;
    _jsPlumb:any;

    static _getDimensions<EventType, ElementType>(overlay:DOMOverlay<EventType, ElementType>, forceRefresh?:Boolean):[number, number] {
        if (overlay._jsPlumb.cachedDimensions == null || forceRefresh) {
            overlay._jsPlumb.cachedDimensions = overlay.getDimensions();
        }
        return overlay._jsPlumb.cachedDimensions;
    }

    constructor(params:any) {
        super(params);

        this.id = params.id;
        this._jsPlumb.div = null;
        this._jsPlumb.initialised = false;
        this._jsPlumb.component = params.component;
        this._jsPlumb.cachedDimensions = null;
        this._jsPlumb.create = params.create;
        this.cssClass = params.cssClass;
        this._jsPlumb.initiallyInvisible = params.visible === false;
    }

    /**
     * @override
     * @param event
     * @param value
     * @param originalEvent
     */
    fire(event:string, value?:any, originalEvent?:EventType):EventGenerator<EventType> {

        if (this.component) {
            this.component.fire.apply(this.component, arguments);
        }

        return super.fire(event, value, originalEvent);
    }

    getElement() {
        if (this._jsPlumb.div == null) {
            let div:any = this._jsPlumb.div = this.instance.getElement(this._jsPlumb.create(this._jsPlumb.component));
            div.style.position = "absolute";
            div.className = this.instance.overlayClass + " " +
                (this.cssClass || "");
            this.instance.appendElement(div);
            this.instance.getId(div);
            this.canvas = div;

            // in IE the top left corner is what it placed at the desired location.  This will not
            // be fixed. IE8 is not going to be supported for much longer.
            let ts = "translate(-50%, -50%)";
            div.style.webkitTransform = ts;
            div.style.mozTransform = ts;
            div.style.msTransform = ts;
            div.style.oTransform = ts;
            div.style.transform = ts;

            // write the related component into the created element
            div._jsPlumb = this;

            if (this._jsPlumb.initiallyInvisible) {
                div.style.display = "none";
            }
        }
        return this._jsPlumb.div;
    }

    static getOverlayDimensions<EventType, ElementType>(overlay:DOMOverlay<EventType, ElementType>, forceRefresh?:Boolean) {
        if (overlay._jsPlumb.cachedDimensions == null || forceRefresh) {
            overlay._jsPlumb.cachedDimensions = overlay.getDimensions();
        }
        return overlay._jsPlumb.cachedDimensions;
    }


    draw(currentConnectionPaintStyle:any, paintStyle:any, absolutePosition?:ArrayLocation):any {
        let td = DOMOverlay.getOverlayDimensions(this);
        if (td != null && td.length === 2) {
            let cxy = { x: 0, y: 0 };

            // absolutePosition would have been set by a call to connection.setAbsoluteOverlayPosition.
            if (absolutePosition) {
                cxy = { x: absolutePosition[0], y: absolutePosition[1] };
            }
            else if (isPathBasedComponent(this.component)) {
                let loc = this.loc, absolute = false;
                if (/*isString(this.loc) || */this.loc < 0 || this.loc > 1) {
                    //loc = parseInt(this.loc, 10);
                    absolute = true;
                }
                cxy = this.component.pointOnPath(loc, absolute);  // a connection
            }
            else {
                let locToUse = this.loc.constructor === Array ? this.loc : this.endpointLoc;
                cxy = { x: locToUse[0] * this.component.w,
                    y: locToUse[1] * this.component.h };
            }

            let minx = cxy.x - (td[0] / 2),
                miny = cxy.y - (td[1] / 2);

            return {
                component: this.component,
                d: { minx: minx, miny: miny, td: td, cxy: cxy },
                minX: minx,
                maxX: minx + td[0],
                minY: miny,
                maxY: miny + td[1]
            };
        }
        else {
            return {minX: 0, maxX: 0, minY: 0, maxY: 0};
        }
    }

    getDimensions() {
        return [1,1];
    }

    setVisible(state:Boolean) {
        if (this._jsPlumb.div) {
            this._jsPlumb.div.style.display = state ? "block" : "none";
            // if initially invisible, dimensions are 0,0 and never get updated
            if (state && this._jsPlumb.initiallyInvisible) {
                DOMOverlay._getDimensions(this, true);
                this.component.repaint();
                this._jsPlumb.initiallyInvisible = false;
            }
        }
    }
    /*
     * Function: clearCachedDimensions
     * Clears the cached dimensions for the label. As a performance enhancement, label dimensions are
     * cached from 1.3.12 onwards. The cache is cleared when you change the label text, of course, but
     * there are other reasons why the text dimensions might change - if you make a change through CSS, for
     * example, you might change the font size.  in that case you should explicitly call this method.
     */
    clearCachedDimensions() {
        this._jsPlumb.cachedDimensions = null;
    }

    cleanup(force?:Boolean) {
        if (force) {
            if (this._jsPlumb.div != null) {
                this._jsPlumb.div._jsPlumb = null;
                this.instance.removeElement(this._jsPlumb.div);
            }
        }
        else {
            // if not a forced cleanup, just detach child from parent for now.
            if (this._jsPlumb && this._jsPlumb.div && this._jsPlumb.div.parentNode) {
                this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
            }
            this.detached = true;
        }
    }

    reattach(instance:JsPlumbInstance<EventType, ElementType>, component?:any) {
        if (this._jsPlumb.div != null) {
            (<any>instance.getContainer()).appendChild(this._jsPlumb.div);
        }
        this.detached = false;
    }

    computeMaxSize():number {
        let td = DOMOverlay._getDimensions(this);
        return Math.max(td[0], td[1]);
    }

    paint(p:any, containerExtents:any) {
        if (!this._jsPlumb.initialised) {
            this.getElement();
            p.component.appendDisplayElement(this._jsPlumb.div);
            this._jsPlumb.initialised = true;
            if (this.detached) {
                this._jsPlumb.div.parentNode.removeChild(this._jsPlumb.div);
            }
        }
        this._jsPlumb.div.style.left = (p.component.x + p.d.minx) + "px";
        this._jsPlumb.div.style.top = (p.component.y + p.d.miny) + "px";
    }

}
