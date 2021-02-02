import {
    Anchor
} from "./anchor"

import {
    AnchorComputeParams, AnchorOptions, AnchorSpec, makeAnchorFromSpec,
    Orientation
} from "../factory/anchor-factory"

import { PointArray} from '../common'
import { JsPlumbInstance } from "../core"
import {Endpoint} from "../endpoint/endpoint"
import {AnchorPlacement} from "../router/router"
import {rotatePoint} from "../util"

export interface DynamicAnchorOptions extends AnchorOptions {
    selector?:(xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray, rotation:number, targetRotation:number, anchors:Array<Anchor>) => Anchor
    elementId?:string
    anchors:Array<Anchor>
}

// helper method to calculate the distance between the centers of the two elements.
function _distance(anchor:Anchor, cx:number, cy:number, xy:PointArray, wh:PointArray, rotation:number, targetRotation:number):number {

    let ax = xy[0] + (anchor.x * wh[0]), ay = xy[1] + (anchor.y * wh[1]),
        acx = xy[0] + (wh[0] / 2), acy = xy[1] + (wh[1] / 2)

    if(rotation != null && rotation !== 0) {
        const rotated = rotatePoint([ax,ay], [acx, acy], rotation)
        ax = rotated[0]
        ay = rotated[1]
    }

    return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)))
}

const DEFAULT_ANCHOR_SELECTOR = (xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray,
                                 rotation:number,
                                 targetRotation:number,
                                 anchors:Array<Anchor>) => {

    let cx = txy[0] + (twh[0] / 2), cy = txy[1] + (twh[1] / 2)
    let minIdx = -1, minDist = Infinity
    for (let i = 0; i < anchors.length; i++) {
        let d = _distance(anchors[i], cx, cy, xy, wh, rotation, targetRotation)
        if (d < minDist) {
            minIdx = i + 0
            minDist = d
        }
    }
    return anchors[minIdx]
}

function _convertAnchor(anchor:Anchor | AnchorSpec, instance:JsPlumbInstance, elementId:string):Anchor {
    return anchor instanceof Anchor ? (anchor as Anchor) : makeAnchorFromSpec(instance, anchor as AnchorSpec, elementId)
}

export class DynamicAnchor extends Anchor {

    anchors:Array<Anchor>
    _curAnchor:Anchor
    _lastAnchor:Anchor

    _anchorSelector:(xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray, rotation:number, targetRotation:number, anchors:Array<Anchor>) => Anchor = null

    constructor(public instance:JsPlumbInstance, options:DynamicAnchorOptions) {
        super(instance, options)

        this.isDynamic = true
        this.anchors = []
        this.elementId = options.elementId

        for (let i = 0; i < options.anchors.length; i++) {
            this.anchors[i] = _convertAnchor(options.anchors[i], instance, this.elementId)
        }

        this._curAnchor = this.anchors.length > 0 ? this.anchors[0] : null
        this._lastAnchor = this._curAnchor

        // default method uses distance between element centers.  you can provide your own method in the dynamic anchor
        // constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays:
        // xy - xy loc of the anchor's element
        // wh - anchor's element's dimensions
        // txy - xy loc of the element of the other anchor in the connection
        // twh - dimensions of the element of the other anchor in the connection.
        // anchors - the list of selectable anchors
        this._anchorSelector = options.selector || DEFAULT_ANCHOR_SELECTOR

    }

    getAnchors ():Array<Anchor> {
        return this.anchors
    }

    getOrientation (_endpoint?:Endpoint):Orientation {
        return this._curAnchor != null ? this._curAnchor.getOrientation(_endpoint) : [ 0, 0 ]
    }

    over (anchor:Anchor, endpoint:Endpoint):void {
        if (this._curAnchor != null) {
            this._curAnchor.over(anchor, endpoint)
        }
    }

    out ():void {
        if (this._curAnchor != null) {
            this._curAnchor.out()
        }
    }

    setAnchor (a:Anchor):void {
        this._curAnchor = a
    }

    getCssClass ():string {
        return (this._curAnchor && this._curAnchor.getCssClass()) || ""
    }

    setAnchorCoordinates (coords: PointArray) {
        const idx = this.anchors.findIndex((a:Anchor) => a.x === coords[0] && a.y === coords[1])
        if (idx !== -1) {
            this.setAnchor(this.anchors[idx])
            return true
        } else {
            return false
        }
    }
}
