import {ArrowOverlayOptions, Overlay} from "./overlay";
import {jsPlumbInstance, PointArray} from "../core";
import {AbstractConnector, Component, OverlayFactory, PaintStyle} from "..";

const DEFAULT_WIDTH = 20;
const DEFAULT_LENGTH = 20;

declare const Biltong:any;

export class ArrowOverlay<E> extends Overlay<E> {

    width:number;
    length:number;
    foldback:number;
    direction:number;

    paintStyle:PaintStyle;

    type:string = "Arrow";

    cachedDimensions:PointArray;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>,
                p:ArrowOverlayOptions) {

        super(instance, component, p);
        p = p || {};

        this.width = p.width || DEFAULT_WIDTH;
        this.length = p.length || DEFAULT_LENGTH;
        this.direction = (p.direction || 1) < 0 ? -1 : 1;
        this.foldback = p.foldback || 0.623;
        this.paintStyle = p.paintStyle || { "strokeWidth": 1 };

        this.setRenderer(this.instance.renderer.assignOverlayRenderer(this.instance, this));
    }


    draw(component:Component<HTMLElement>, currentConnectionPaintStyle:PaintStyle, absolutePosition?:PointArray): any {

        if (component instanceof AbstractConnector) {

            let connector = component as AbstractConnector<E>;

            var hxy, mid, txy, tail, cxy;

                if (this.location > 1 || this.location < 0) {
                    var fromLoc = this.location < 0 ? 1 : 0;
                    hxy = connector.pointAlongPathFrom(fromLoc, this.location, false);
                    mid = connector.pointAlongPathFrom(fromLoc, this.location - (this.direction * this.length / 2), false);
                    txy = Biltong.pointOnLine(hxy, mid, this.length);
                } else if (this.location === 1) {
                    hxy = connector.pointOnPath(this.location);
                    mid = connector.pointAlongPathFrom(this.location, -(this.length));
                    txy = Biltong.pointOnLine(hxy, mid, this.length);

                    if (this.direction === -1) {
                        var _ = txy;
                        txy = hxy;
                        hxy = _;
                    }
                } else if (this.location === 0) {
                    txy = connector.pointOnPath(this.location);
                    mid = connector.pointAlongPathFrom(this.location, this.length);
                    hxy = Biltong.pointOnLine(txy, mid, this.length);
                    if (this.direction === -1) {
                        var __ = txy;
                        txy = hxy;
                        hxy = __;
                    }
                } else {
                    hxy = connector.pointAlongPathFrom(this.location, this.direction * this.length / 2);
                    mid = connector.pointOnPath(this.location);
                    txy = Biltong.pointOnLine(hxy, mid, this.length);
                }

                tail = Biltong.perpendicularLineTo(hxy, txy, this.width);
                cxy = Biltong.pointOnLine(hxy, txy, this.foldback * this.length);

                var d = {hxy: hxy, tail: tail, cxy: cxy},
                    stroke = this.paintStyle.stroke || currentConnectionPaintStyle.stroke,
                    fill = this.paintStyle.fill || currentConnectionPaintStyle.stroke,
                    lineWidth = this.paintStyle.strokeWidth || currentConnectionPaintStyle.strokeWidth;

                return {
                    component: component,
                    d: d,
                    "stroke-width": lineWidth,
                    stroke: stroke,
                    fill: fill,
                    minX: Math.min(hxy.x, tail[0].x, tail[1].x),
                    maxX: Math.max(hxy.x, tail[0].x, tail[1].x),
                    minY: Math.min(hxy.y, tail[0].y, tail[1].y),
                    maxY: Math.max(hxy.y, tail[0].y, tail[1].y)
                };
            // } else {
            //     return {component: component, minX: 0, maxX: 0, minY: 0, maxY: 0};
            // }
        }
    }

    updateFrom(d: any): void { }

}

OverlayFactory.register("Arrow", ArrowOverlay);