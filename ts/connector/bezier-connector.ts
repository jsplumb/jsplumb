import {AbstractBezierConnector, AbstractBezierOptions} from "./abstract-bezier-connector";
import {PaintParams, PaintGeometry, ConnectorComputeParams} from "./abstract-connector";
import {jsPlumbInstance, PointArray} from "../core";
import {BezierSegment} from "./bezier-segment";
import {Connectors} from "./connectors";
import {ComputedAnchorPosition} from "../factory/anchor-factory";

export class Bezier<E> extends AbstractBezierConnector<E> {

    type = "Bezier";

    majorAnchor:number;
    minorAnchor:number;

    constructor(instance:jsPlumbInstance<E>, params:AbstractBezierOptions) {
        super(instance, params);
        this.majorAnchor = params.curviness || 150;
        this.minorAnchor = 10;
    }

    getCurviness ():number {
        return this.majorAnchor;
    }

    private _findControlPoint (point:any, sourceAnchorPosition:any, targetAnchorPosition:any, soo:any, too:any) {
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

    _computeBezier (paintInfo:PaintGeometry, p:ConnectorComputeParams<E>, sp:ComputedAnchorPosition, tp:ComputedAnchorPosition, _w:number, _h:number):void {

        let _CP, _CP2,
            _sx = sp[0] < tp[0] ? _w : 0,
            _sy = sp[1] < tp[1] ? _h : 0,
            _tx = sp[0] < tp[0] ? 0 : _w,
            _ty = sp[1] < tp[1] ? 0 : _h;

        _CP = this._findControlPoint([_sx, _sy], sp, tp, paintInfo.so, paintInfo.to);
        _CP2 = this._findControlPoint([_tx, _ty], tp, sp, paintInfo.to, paintInfo.so);


        this._addSegment(BezierSegment, {
            x1: _sx, y1: _sy, x2: _tx, y2: _ty,
            cp1x: _CP[0], cp1y: _CP[1], cp2x: _CP2[0], cp2y: _CP2[1]
        });
    }


}

Connectors.register("Bezier", Bezier);
