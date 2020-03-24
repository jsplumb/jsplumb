
import {_attr, _pos} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {sizeElement} from "../browser-util";
import {jsPlumbInstance} from "../core";

export interface SvgComponentOptions {
    pointerEventsSpec?:string;
    cssClass?:string;
    useDivWrapper?:boolean;
}

export type Positionable = { x:number, y: number, w:number, h:number }

export class SvgComponent {

    static paint<E>(connector:any, useDivWrapper:boolean, paintStyle:PaintStyle, extents?:any):void {
        if (paintStyle != null) {

            let xy = [ connector.x, connector.y ],
                wh = [ connector.w, connector.h ], p;

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

            if (useDivWrapper) {
                sizeElement((connector as any).canvas, xy[0], xy[1], wh[0], wh[1]);
                xy[0] = 0;
                xy[1] = 0;
                p = _pos([ 0, 0 ]);

                _attr(connector.svg, {
                    "style": p,
                    "width": "" + (wh[0] || 0),
                    "height": "" + (wh[1] || 0)
                });
            }
            else {
                p = _pos([ xy[0], xy[1] ]);
                _attr(connector.canvas, {
                    "style": p,
                    "width": "" + (wh[0] || 0),
                    "height": "" + (wh[1] || 0)
                });
            }
        }
    }


    // cleanup(force?:boolean) {
    //
    //     if (force) {
    //         if (this.canvas) {
    //             (<any>this.canvas)._jsPlumb = null;
    //         }
    //         if (this.svg) {
    //             (<any>this.svg)._jsPlumb = null;
    //         }
    //         if (this.bgCanvas) {
    //             (<any>this.bgCanvas)._jsPlumb = null;
    //         }
    //
    //         if (this.canvas && this.canvas.parentNode) {
    //             this.canvas.parentNode.removeChild(this.canvas);
    //         }
    //         if (this.bgCanvas && this.bgCanvas.parentNode) {
    //             this.canvas.parentNode.removeChild(this.canvas);
    //         }
    //
    //         this.svg = null;
    //         this.canvas = null;
    //         this.bgCanvas = null;
    //     }
    //     else {
    //         // if not a forced cleanup, just detach from DOM for now.
    //         if (this.canvas && this.canvas.parentNode) {
    //             this.canvas.parentNode.removeChild(this.canvas);
    //         }
    //         if (this.bgCanvas && this.bgCanvas.parentNode) {
    //             this.bgCanvas.parentNode.removeChild(this.bgCanvas);
    //         }
    //     }
    // }
    //
    // reattach<E>(instance:jsPlumbInstance<E>) {
    //     let c = (<unknown>instance.getContainer()) as HTMLElement;
    //     if (this.canvas && this.canvas.parentNode == null) {
    //         c.appendChild(this.canvas);
    //     }
    //     if (this.bgCanvas && this.bgCanvas.parentNode == null) {
    //         c.appendChild(this.bgCanvas);
    //     }
    // }
    //
    // setVisible(v:boolean) {
    //     if (this.canvas) {
    //         this.canvas.style.display = v ? "block" : "none";
    //     }
    //
    //     if (this.bgCanvas) {
    //         this.bgCanvas.style.display = v ? "block" : "none";
    //     }
    // }

    // setHover(b:boolean) {
    //     this.instance[b ? "addClass" : "removeClass"](this.canvas, this.instance.hoverClass);
    // }
    //
    // destroy(force?:boolean) {
    //     if (this.canvas != null) {
    //         this.instance.removeElement(this.canvas as any);
    //     }
    //
    //     if (this.bgCanvas != null) {
    //         this.instance.removeElement(this.bgCanvas as any);
    //     }
    // }
    //
    // addClass(clazz:string) {
    //     this.instance.addClass(this.canvas as any, clazz);
    // }
    //
    // removeClass(clazz:string) {
    //     this.instance.removeClass(this.canvas as any, clazz);
    // }
    //
    // getClass():string {
    //     return this.instance.getClass(this.canvas);
    // }
    //
    // moveParent(newParent: HTMLElement): void {
    //     this.instance.appendElement(<any>this.canvas);
    // }
}
