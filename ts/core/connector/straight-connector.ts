import {AbstractConnector, ConnectorComputeParams, PaintGeometry} from "./abstract-connector"
import {StraightSegment} from "./straight-segment"
import {AnchorPlacement} from "../../common/anchor"

export interface StraightConnectorGeometry {
    source:AnchorPlacement
    target:AnchorPlacement
}

export class StraightConnector extends AbstractConnector {

    static type = "Straight"
    type = StraightConnector.type

    getDefaultStubs(): [number, number] {
        return [0, 0]
    }

    _compute (paintInfo:PaintGeometry, p:ConnectorComputeParams):void {
        this._addSegment(StraightSegment, {x1: paintInfo.sx, y1: paintInfo.sy, x2: paintInfo.startStubX, y2: paintInfo.startStubY})
        this._addSegment(StraightSegment, {x1: paintInfo.startStubX, y1: paintInfo.startStubY, x2: paintInfo.endStubX, y2: paintInfo.endStubY})
        this._addSegment(StraightSegment, {x1: paintInfo.endStubX, y1: paintInfo.endStubY, x2: paintInfo.tx, y2: paintInfo.ty})

        this.geometry = {source:p.sourcePos, target:p.targetPos}
    }


    transformGeometry(g: StraightConnectorGeometry, dx: number, dy: number): StraightConnectorGeometry {
        return {
            source:this.transformAnchorPlacement(g.source, dx, dy),
            target:this.transformAnchorPlacement(g.target, dx, dy)
        }
    }
}


