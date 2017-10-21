import {Connector} from "./connector";
import {AnchorOrientation} from "../anchor/anchors";
import {JsPlumbInstance} from "../core";
/**
 * Created by simon on 20/10/2017.
 */

export type Position = [ number, number ]

export abstract class AbstractBezierConnector<EventType, ElementType> extends Connector<EventType, ElementType> {

    abstract _computeBezier(paintInfo:any, p:any, sp:Position, tp:Position, _w:number, _h:number):void;

    showLoopback:Boolean;
    curviness:number;
    margin:number;
    proximityLimit:number;
    clockwise:Boolean;
    loopbackRadius:number;
    isLoopbackCurrently:Boolean = false;

    constructor(params:any) {
        super(params);
        params = params || {};

        this.showLoopback = params.showLoopback !== false;
        this.curviness = params.curviness || 10;
        this.margin = params.margin || 5;
        this.proximityLimit = params.proximityLimit || 80;
        this.clockwise = params.orientation && params.orientation === "clockwise";
        this.loopbackRadius = params.loopbackRadius || 25;
    }

    _compute(paintInfo:any, p:any) {

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
            this._addSegment(this, "Arc", {
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

    cleanup(force?: Boolean): void { }

    reattach(instance: JsPlumbInstance<EventType, ElementType>, component?: any): void { }
}

export class BezierConnector<EventType, ElementType> extends AbstractBezierConnector<EventType, ElementType> {

    majorAnchor:number;
    minorAnchor:number = 10;
    type = "Bezier";

    constructor(params:any) {
        super(params);
        params = params || {};
        this.majorAnchor = params.curviness || 150;
    }

    getCurviness () {
        return this.majorAnchor;
    }

    _findControlPoint(point:Position, sourceAnchorPosition:Position, targetAnchorPosition:Position, sourceEndpoint:any, targetEndpoint:any, soo:AnchorOrientation, too:AnchorOrientation) {
        // determine if the two anchors are perpendicular to each other in their orientation.  we swap the control
        // points around if so (code could be tightened up)
        let perpendicular = soo[0] !== too[0] || soo[1] === too[1],
            p = [];

        if (!perpendicular) {
            if (soo[0] === 0) {
                p.push(sourceAnchorPosition[0] < targetAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
            }
            else {
                p.push(point[0] - (this.majorAnchor * soo[0]));
            }

            if (soo[1] === 0) {
                p.push(sourceAnchorPosition[1] < targetAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
            }
            else {
                p.push(point[1] + (this.majorAnchor * too[1]));
            }
        }
        else {
            if (too[0] === 0) {
                p.push(targetAnchorPosition[0] < sourceAnchorPosition[0] ? point[0] + this.minorAnchor : point[0] - this.minorAnchor);
            }
            else {
                p.push(point[0] + (this.majorAnchor * too[0]));
            }

            if (too[1] === 0) {
                p.push(targetAnchorPosition[1] < sourceAnchorPosition[1] ? point[1] + this.minorAnchor : point[1] - this.minorAnchor);
            }
            else {
                p.push(point[1] + (this.majorAnchor * soo[1]));
            }
        }

        return p;
    }

    _computeBezier(paintInfo:any, p:any, sp:Position, tp:Position, _w:number, _h:number):void {

        let geometry = this.getGeometry(), _CP, _CP2,
            _sx = sp[0] < tp[0] ? _w : 0,
            _sy = sp[1] < tp[1] ? _h : 0,
            _tx = sp[0] < tp[0] ? 0 : _w,
            _ty = sp[1] < tp[1] ? 0 : _h;


        _CP = this._findControlPoint([_sx, _sy], sp, tp, p.sourceEndpoint, p.targetEndpoint, paintInfo.so, paintInfo.to);
        _CP2 = this._findControlPoint([_tx, _ty], tp, sp, p.targetEndpoint, p.sourceEndpoint, paintInfo.to, paintInfo.so);

        this._addSegment(this, "Bezier", {
            x1: _sx, y1: _sy, x2: _tx, y2: _ty,
            cp1x: _CP[0], cp1y: _CP[1], cp2x: _CP2[0], cp2y: _CP2[1]
        });
    }
}

Connector.map["Bezier"] = BezierConnector;
