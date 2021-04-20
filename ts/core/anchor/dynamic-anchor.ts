import { Anchor } from "./anchor"
import { AnchorOptions, AnchorSpec, makeAnchorFromSpec } from "../factory/anchor-factory"

import {PointXY, Rotations, Size} from '../common'
import { JsPlumbInstance } from "../core"
import {findWithFunction} from "../util"


export type AnchorSelectorFunction = (xy:PointXY, wh:Size, txy:PointXY, twh:Size, rotation:Rotations, targetRotation:Rotations, anchors:Array<Anchor>) => Anchor

export interface DynamicAnchorOptions extends AnchorOptions {
    selector?:AnchorSelectorFunction
    elementId?:string
    anchors:Array<Anchor|AnchorSpec>
}

// helper method to calculate the distance between the centers of the two elements.
function _distance(anchor:Anchor, cx:number, cy:number, xy:PointXY, wh:Size, rotation:Rotations, targetRotation:Rotations):number {

    let ax = xy.x + (anchor.x * wh.w), ay = xy.y + (anchor.y * wh.h),
        acx = xy.x + (wh.w / 2), acy = xy.y + (wh.h / 2)

    if(rotation != null && rotation.length > 0) {
        const rotated = anchor.instance._applyRotations([ax,ay, 0, 0], rotation)
        ax = rotated.x
        ay = rotated.y
    }

    return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)))
}

const DEFAULT_ANCHOR_SELECTOR:AnchorSelectorFunction = (xy:PointXY, wh:Size,
                                 txy:PointXY, twh:Size,
                                 rotation:Rotations,
                                 targetRotation:Rotations,
                                 anchors:Array<Anchor>) => {

    let cx = txy.x + (twh.w / 2), cy = txy.y + (twh.h / 2)
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

    _anchorSelector:AnchorSelectorFunction = null

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

    setAnchor (a:Anchor):void {
        this._curAnchor = a
    }

    getCssClass ():string {
        return (this._curAnchor && this._curAnchor.getCssClass()) || ""
    }

    setAnchorCoordinates (coords: PointXY) {
        const idx = findWithFunction(this.anchors, (a:Anchor) => a.x === coords.x && a.y === coords.y)
        if (idx !== -1) {
            this.setAnchor(this.anchors[idx])
            return true
        } else {
            return false
        }
    }
}
