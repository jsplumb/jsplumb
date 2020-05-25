import {AbstractConnector, ConnectorComputeParams, PaintGeometry} from "./abstract-connector";
import {Connectors} from "./connectors";
import {StraightSegment} from "./straight-segment";

export class StraightConnector<E> extends AbstractConnector<E> {

    type = "Straight";

    _compute (paintInfo:PaintGeometry, _:ConnectorComputeParams<E>):void {
        this._addSegment(StraightSegment, {x1: paintInfo.sx, y1: paintInfo.sy, x2: paintInfo.startStubX, y2: paintInfo.startStubY});
        this._addSegment(StraightSegment, {x1: paintInfo.startStubX, y1: paintInfo.startStubY, x2: paintInfo.endStubX, y2: paintInfo.endStubY});
        this._addSegment(StraightSegment, {x1: paintInfo.endStubX, y1: paintInfo.endStubY, x2: paintInfo.tx, y2: paintInfo.ty});
    }
}

Connectors.register("Straight", StraightConnector);
