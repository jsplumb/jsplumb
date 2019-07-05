
import {_attr, _pos, _node} from "./svg-util";
import {Anchor} from "../anchor/anchor";
import {PaintStyle} from "../styles";
import {sizeElement} from "../browser-util";
import {jsPlumbInstance} from "../core";

export interface SvgComponentOptions {
    pointerEventsSpec?:string;
    cssClass?:string;
    useDivWrapper?:boolean;
}

export type Positionable = { x:number, y: number, w:number, h:number }

export abstract class SvgComponent {

    typeId:string;
    pointerEventsSpec:string;
    svg:SVGElement;

    renderer:any = {};
    clazz:string;
    useDivWrapper:boolean;

    canvas:HTMLElement;
    bgCanvas:HTMLElement;

    constructor(protected instance:jsPlumbInstance<HTMLElement>,
                protected refComponent:Positionable,
                params:SvgComponentOptions) {

        params = params || {};

        this.pointerEventsSpec = params.pointerEventsSpec || "all";

        this.useDivWrapper = params.useDivWrapper === true;

        this.svg = _node(this.instance, "svg", {
            "style": "",
            "width": "0",
            "height": "0",
            "pointer-events": "none",
            "position": "absolute"
        });

        this.clazz = params.cssClass;

        if (params.useDivWrapper) {
            this.canvas = this.instance.createElement("div", { position : "absolute" });

            // if (!params._jsPlumb.isSuspendDrawing()) {
            sizeElement(this.canvas, 0, 0, 1, 1);
            //}

            this.canvas.className = this.clazz;
        }
        else {
            _attr(this.svg, { "class": this.clazz });
            this.canvas = (<unknown>this.svg) as HTMLElement;
        }

        this.instance.appendElement(this.canvas, this.instance.getContainer());

        if (params.useDivWrapper) {
            this.canvas.appendChild(this.svg);
        }

       // this.displayElements = [ this.canvas ];
    }

//    _jp.jsPlumbUIComponent.apply(this, params.originalArgs);

    paint<E>(style:PaintStyle, extents?:any):void {
        if (style != null) {

            let xy = [ this.refComponent.x, this.refComponent.y ],
                wh = [ this.refComponent.w, this.refComponent.h ], p;

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
                p = _pos([ 0, 0 ]);
            }
            else {
                p = _pos([ xy[0], xy[1] ]);
            }

            //renderer.paint.apply(this, arguments);

            _attr(this.svg, {
                "style": p,
                "width": "" + (wh[0] || 0),
                "height": "" + (wh[1] || 0)
            });
        }
    }

    cleanup(force?:boolean) {

        //super.cleanup(force);

        if (force || this.typeId == null) {
            if (this.canvas) {
                (<any>this.canvas)._jsPlumb = null;
            }
            if (this.svg) {
                (<any>this.svg)._jsPlumb = null;
            }
            if (this.bgCanvas) {
                (<any>this.bgCanvas)._jsPlumb = null;
            }

            if (this.canvas && this.canvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }
            if (this.bgCanvas && this.bgCanvas.parentNode) {
                this.canvas.parentNode.removeChild(this.canvas);
            }

            this.svg = null;
            this.canvas = null;
            this.bgCanvas = null;
            //this.path = null;
            //this.group = null;
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

    reattach<E>(instance:jsPlumbInstance<E>) {
        let c = (<unknown>instance.getContainer()) as HTMLElement;
        if (this.canvas && this.canvas.parentNode == null) {
            c.appendChild(this.canvas);
        }
        if (this.bgCanvas && this.bgCanvas.parentNode == null) {
            c.appendChild(this.bgCanvas);
        }
    }

    setVisible(v:boolean) {
        if (this.canvas) {
            this.canvas.style.display = v ? "block" : "none";
        }

        if (this.bgCanvas) {
            this.bgCanvas.style.display = v ? "block" : "none";
        }
    }

    setHover(b:boolean) {
        this.instance[b ? "addClass" : "removeClass"](this.canvas, this.instance.hoverClass);
    }

    destroy(force?:boolean) {
        console.log("destroy svg component");
        if (this.canvas != null) {
            this.instance.removeElement(this.canvas as any);
        }

        if (this.bgCanvas != null) {
            this.instance.removeElement(this.bgCanvas as any);
        }
    }

    addClass(clazz:string) {
        this.instance.addClass(this.canvas as any, clazz);
    }

    removeClass(clazz:string) {
        this.instance.removeClass(this.canvas as any, clazz);
    }

    getClass():string {
        return this.instance.getClass(this.canvas);
    }

}
