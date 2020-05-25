import {AbstractConnector, ConnectorComputeParams, PaintGeometry, PaintParams} from "./abstract-connector";
import {jsPlumbInstance} from "../core";
import {ComputedAnchorPosition} from "../factory/anchor-factory";
import {ArcSegment} from "./arc-segment";
import {Connection} from "./connection-impl";

export interface AbstractBezierOptions {
    showLoopback?:boolean;
    curviness?:number;
    margin?:number;
    proximityLimit?:number;
    orientation?:string;
    loopbackRadius?:number;
}

export abstract class AbstractBezierConnector<E> extends AbstractConnector<E> {

    showLoopback:boolean;
    curviness:number;
    margin:number;
    proximityLimit:number;
    orientation:string;
    loopbackRadius:number;
    clockwise:boolean;
    isLoopbackCurrently:boolean;

    constructor(instance:jsPlumbInstance<E>, public connection:Connection<E>, params:any) {

        super(instance, connection, params);

        params = params || {};
        this.showLoopback = params.showLoopback !== false;
        this.curviness = params.curviness || 10;
        this.margin = params.margin || 5;
        this.proximityLimit = params.proximityLimit || 80;
        this.clockwise = params.orientation && params.orientation === "clockwise";
        this.loopbackRadius = params.loopbackRadius || 25;
        this.isLoopbackCurrently = false;
    }

    _compute (paintInfo:PaintGeometry, p:ConnectorComputeParams<E>) {

        let sp = p.sourcePos,
            tp = p.targetPos,
            _w = Math.abs(sp[0] - tp[0]),
            _h = Math.abs(sp[1] - tp[1]);

        if (!this.showLoopback || (p.sourceEndpoint.elementId !== p.targetEndpoint.elementId)) {
            this.isLoopbackCurrently = false;
            this._computeBezier(paintInfo, p, sp, tp, _w, _h);
        } else {
            this.isLoopbackCurrently = true;
            // a loopback connector.  draw an arc from one anchor to the other.
            let x1 = p.sourcePos[0], y1 = p.sourcePos[1] - this.margin,
                cx = x1, cy = y1 - this.loopbackRadius,
                // canvas sizing stuff, to ensure the whole painted area is visible.
                _x = cx - this.loopbackRadius,
                _y = cy - this.loopbackRadius;

            _w = 2 * this.loopbackRadius;
            _h = 2 * this.loopbackRadius;

            paintInfo.points[0] = _x;
            paintInfo.points[1] = _y;
            paintInfo.points[2] = _w;
            paintInfo.points[3] = _h;

            // ADD AN ARC SEGMENT.
            this._addSegment(ArcSegment, {
                loopback: true,
                x1: (x1 - _x) + 4,
                y1: y1 - _y,
                startAngle: 0,
                endAngle: 2 * Math.PI,
                r: this.loopbackRadius,
                ac: !this.clockwise,
                x2: (x1 - _x) - 4,
                y2: y1 - _y,
                cx: cx - _x,
                cy: cy - _y
            });
        }
    }

    abstract _computeBezier(paintInfo:PaintGeometry, p:ConnectorComputeParams<E>, sp:ComputedAnchorPosition, tp:ComputedAnchorPosition, _w:number, _h:number):void;
}
