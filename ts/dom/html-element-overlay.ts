
import {OverlayRenderer} from "../overlay/overlay-renderer";
import {Overlay} from "../overlay/overlay";
import {jsPlumbInstance, PointArray, PointXY} from "../core";
import {Component} from "../component/component";
import {IS, isFunction} from "../util";
import {PaintStyle} from "../styles";
import {Connection} from "../connector/connection-impl";

export class HTMLElementOverlay implements OverlayRenderer<HTMLElement> {

    canvas:HTMLElement;

    endpointLoc:any;

    cachedDimensions:PointArray;

    constructor(private instance:jsPlumbInstance<HTMLElement>, public overlay: Overlay<HTMLElement>) {

    }

    getElement ():HTMLElement {
        if (this.canvas == null) {
            this.canvas = this.instance.createElement("div", {}, this.instance.overlayClass + " " +
                (this.overlay.cssClass ? this.overlay.cssClass : ""));
            this.canvas.style.position = "absolute";
            this.instance.appendElement(this.canvas);
            this.instance.getId(this.canvas);

    
            // in IE the top left corner is what it placed at the desired location.  This will not
            // be fixed. IE8 is not going to be supported for much longer.
            let ts = "translate(-50%, -50%)";
            (<any>this.canvas.style).webkitTransform = ts;
            (<any>this.canvas.style).mozTransform = ts;
            (<any>this.canvas.style).msTransform = ts;
            (<any>this.canvas.style).oTransform = ts;
            (<any>this.canvas.style).transform = ts;
    
            // write the related component into the created element
            //div._jsPlumb = this;
    
            if (!this.overlay.isVisible()) {
                this.canvas.style.display = "none";
            }
        }
        return this.canvas;
    }

    private _getDimensions(forceRefresh?:boolean):PointArray {
        if (this.cachedDimensions == null || forceRefresh) {
            this.cachedDimensions = this.getDimensions();
        }
        return this.cachedDimensions;
    }

    draw(component:Component<HTMLElement>, currentConnectionPaintStyle:PaintStyle, absolutePosition?:PointArray) {
        let td = this._getDimensions();
        if (td != null && td.length === 2) {
            let cxy = { x: 0, y: 0 };

            // absolutePosition would have been set by a call to connection.setAbsoluteOverlayPosition.
            if (absolutePosition) {
                cxy = { x: absolutePosition[0], y: absolutePosition[1] };
            }
            else if (component instanceof Connection) {
                let loc = this.overlay.location, absolute = false;
                if (IS.aString(this.overlay.location) || this.overlay.location < 0 || this.overlay.location > 1) {
                    loc = parseInt("" + this.overlay.location, 10);
                    absolute = true;
                }
                cxy = (<Connection<HTMLElement>>component).getConnector().pointOnPath(loc, absolute);  // a connection
            }
            else {
                let locToUse = this.overlay.location.constructor === Array ? this.overlay.location : this.endpointLoc;
                cxy = { x: locToUse[0] * component.w,
                    y: locToUse[1] * component.h };
            }

            let minx = cxy.x - (td[0] / 2),
                miny = cxy.y - (td[1] / 2);

            return {
                component: this.overlay,
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

    setText(t: string): void {
        this.getElement().innerHTML = t;
    }

    setVisible(v: boolean): void {
        this.getElement().style.display = v ? "block" : "none";
    }

    cleanup(force?: boolean): void { }

    destroy(force?: boolean): void {
        let el = this.getElement();
        if (el) {
            this.instance.remove(el);
        }
    }

    setHover(h: boolean): void {
        let el = this.getElement();
        this.instance[h ? "addClass" : "removeClass"](el, this.instance.hoverClass);
    }

    getDimensions():[number, number] {
        return [ 1, 1 ];
    }
}
