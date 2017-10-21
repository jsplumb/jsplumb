import {RawElement, createElement} from "../../dom/dom-adapter";
import { node, attr, pos } from "./svg-util";

// note that here we are getting this from browser util when it is in fact a function supplied by the current renderer,
// which may not in fact know about the browser. this will need to be fixed.
import { sizeElement } from "../../browser-util";
import {JsPlumbInstance} from "../../core";
import {ConnectionAwareComponent} from "../../component/connection-aware-component";

export type Extents = {
    xmin:number,
    xmax:number,
    ymin:number,
    ymax:number
}

export class SvgComponent<EventType> extends ConnectionAwareComponent<EventType, RawElement> {

    idPrefix = "";

    pointerEventsSpec:string;
    renderer:any = {};
    canvas:RawElement = null;
    path:RawElement = null;
    svg:RawElement = null;
    bgCanvas:RawElement = null;
    group:RawElement = null;
    clazz:string = null;
    displayElements:RawElement[] = [];
    useDivWrapper:boolean = false;

    constructor(params:any) {

        super(params);

        this.pointerEventsSpec = params.pointerEventsSpec || "all";
        this.clazz = params.cssClass + " " + (params.originalArgs[0].cssClass || "");

        let svgParams = {
            "style": "",
            "width": 0,
            "height": 0,
            "pointer-events": this.pointerEventsSpec,
            "position": "absolute"
        };

        this.svg = node("svg", svgParams);
        this.useDivWrapper = params.useDivWrapper;

        if (this.useDivWrapper) {
            this.canvas = createElement("div", { position : "absolute" });
            sizeElement(this.canvas, 0, 0, 1, 1);
            this.canvas.className = this.clazz;
        }
        else {
            attr(this.svg, { "class": this.clazz });
            this.canvas = this.svg;
        }

        params._jsPlumb.appendElement(this.canvas, params.originalArgs[0].parent);
        if (this.useDivWrapper) {
            this.canvas.appendChild(this.svg);
        }

        this.displayElements = [ this.canvas ];
    }

    getDisplayElements () {
        return this.displayElements;
    };

    appendDisplayElement(el:RawElement) {
        this.displayElements.push(el);
    };

    paint(style?:any, anchor?:any, extents?:Extents) {
        if (style != null) {

            let xy = [ this.x, this.y ], wh = [ this.w, this.h ], p;
            if (extents != null) {
                if (extents.xmin < 0) {
                    xy[0] += extents.xmin;
                }
                if (extents.ymin < 0) {
                    xy[1] += extents.ymin;
                }
                wh[0] = extents.xmax + ((extents.xmin < 0) ? -extents.xmin : 0);
                wh[1] = extents.ymax + ((extents.ymin < 0) ? -extents.ymin : 0);
            }

            if (this.useDivWrapper) {
                sizeElement(this.canvas, xy[0], xy[1], wh[0], wh[1]);
                xy[0] = 0;
                xy[1] = 0;
                p = pos([ 0, 0 ]);
            }
            else {
                p = pos([ xy[0], xy[1] ]);
            }

            this.renderer.paint.apply(this, arguments);

            attr(this.svg, {
                "style": p,
                "width": wh[0] || 0,
                "height": wh[1] || 0
            });
        }
    }

    cleanup(force?:boolean) {

        super.cleanup(force)

        if (force || this.typeId == null) {
            if (this.canvas) {
                this.canvas._jsPlumb = null;
            }
            if (this.svg) {
                this.svg._jsPlumb = null;
            }
            if (this.bgCanvas) {
                this.bgCanvas._jsPlumb = null;
            }

            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }

            this.svg = null;
            this.canvas = null;
            this.path = null;
            this.group = null;
        }
        else {
            // if not a forced cleanup, just detach from DOM for now.
            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode) {
                this.bgCanvas.parentNode.removeChild(this.bgCanvas);
            }
        }
    }

    reattach(instance:JsPlumbInstance<EventType, RawElement>) {

        super.reattach(instance);

        let c = instance.getContainer();
        if (this.canvas && this.canvas.parentNode == null) {
            (<any>c).appendChild(this.canvas);
        }
        if (this.bgCanvas && this.bgCanvas.parentNode == null) {
            (<any>c).appendChild(this.bgCanvas);
        }
    }

    setVisible (v:boolean) {

        super.setVisible(v);

        if (this.canvas) {
            this.canvas.style.display = v ? "block" : "none";
        }
    }


    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }
}