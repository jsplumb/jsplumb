import {Connector} from "./connector";
import {JsPlumbInstance} from "../core";
export class StraightConnector<EventType, ElementType> extends Connector<EventType, ElementType> {

    type = "Straight";

    constructor(params:any) {
        super(params)
    }

    _compute (paintInfo:any, p:any) {
        this._addSegment(this, "Straight", {x1: paintInfo.sx, y1: paintInfo.sy, x2: paintInfo.startStubX, y2: paintInfo.startStubY});
        this._addSegment(this, "Straight", {x1: paintInfo.startStubX, y1: paintInfo.startStubY, x2: paintInfo.endStubX, y2: paintInfo.endStubY});
        this._addSegment(this, "Straight", {x1: paintInfo.endStubX, y1: paintInfo.endStubY, x2: paintInfo.tx, y2: paintInfo.ty});
    }

    cleanup(force?: Boolean): void {
    }

    reattach(instance: JsPlumbInstance<EventType, ElementType>, component?: any): void {
    }
}

Connector.map["Straight"] = StraightConnector;
