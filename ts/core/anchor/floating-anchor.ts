import { Anchor } from './anchor'

import { Endpoint } from '../endpoint/endpoint'
import { JsPlumbInstance } from '../core'

import { Orientation, AnchorComputeParams, AnchorOptions, AnchorOrientationHint } from '../factory/anchor-factory'

import { Size } from '../common'
import {AnchorPlacement} from "../router/router"

export interface FloatingAnchorOptions extends AnchorOptions {
    reference:Anchor
    referenceCanvas:Element
}

export class FloatingAnchor extends Anchor {

    ref:Anchor
    refCanvas:Element
    size:Size
    xDir:number
    yDir:number
    _lastResult:AnchorPlacement

    constructor(public instance:JsPlumbInstance,  params:FloatingAnchorOptions) {
        super(instance, params)

        // this is the anchor that this floating anchor is referenced to for
        // purposes of calculating the orientation.

        this.ref = params.reference
            // the canvas this refers to.
        this.refCanvas = params.referenceCanvas

        this.size = instance.getSize(this.refCanvas)

        // these are used to store the current relative position of our
        // anchor wrt the reference anchor. they only indicate
        // direction, so have a value of 1 or -1 (or, very rarely, 0). these
        // values are written by the compute method, and read
        // by the getOrientation method.
        this.xDir = 0
        this.yDir = 0
        // temporary member used to store an orientation when the floating
        // anchor is hovering over another anchor.

        // clear from parent. we want floating anchor orientation to always be computed.
        this.orientation = null
        this._lastResult = null

        // set these to 0 each; they are used by certain types of connectors in the loopback case,
        // when the connector is trying to clear the element it is on. but for floating anchor it's not
        // very important.
        this.x = 0
        this.y = 0

        this.isFloating = true
    }

    compute(params:AnchorComputeParams):AnchorPlacement{
        let xy = params.xy
        this._lastResult = [ xy[0] + (this.size.w / 2), xy[1] + (this.size.h / 2), 0, 0 ] as AnchorPlacement; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
        return this._lastResult
    }

    getOrientation (_endpoint:Endpoint):Orientation {
        if (this.orientation) {
            return this.orientation
        }
        else {
            let o = this.instance.router.getAnchorOrientation(this.ref, _endpoint)
            // here we take into account the orientation of the other
            // anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
            // up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.
            return [ (Math.abs(o[0]) * this.xDir * -1) as AnchorOrientationHint,
                (Math.abs(o[1]) * this.yDir * -1) as AnchorOrientationHint ]
        }
    }

    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over (anchor:Anchor, endpoint:Endpoint) {
        this.orientation = this.instance.router.getAnchorOrientation(anchor, endpoint)
    }

    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out ():void {
        this.orientation = null
    }
}
