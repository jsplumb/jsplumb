import {AnchorOrientationHint, AnchorComputeParams, AnchorOptions, Orientation} from "../factory/anchor-factory"
import { Anchor } from "../anchor/anchor"
import {jsPlumbInstance, Size} from "../core"
import {Endpoint} from "../endpoint/endpoint-impl"
import {AnchorPlacement} from "../anchor-manager"


export interface FloatingAnchorOptions extends AnchorOptions {
    reference:Anchor
    referenceCanvas:HTMLElement
}

export class FloatingAnchor extends Anchor {

    ref:Anchor
    refCanvas:HTMLElement
    size:Size
    xDir:number
    yDir:number
    _lastResult:AnchorPlacement

    constructor(public instance:jsPlumbInstance,  params:FloatingAnchorOptions) {
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
        this._lastResult = [ xy[0] + (this.size[0] / 2), xy[1] + (this.size[1] / 2), 0, 0 ] as AnchorPlacement; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.
        return this._lastResult
    }

    getOrientation (_endpoint:Endpoint):Orientation {
        if (this.orientation) {
            return this.orientation
        }
        else {
            let o = this.ref.getOrientation(_endpoint)
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
        this.orientation = anchor.getOrientation(endpoint)
    }

    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out ():void {
        this.orientation = null
    }

    getCurrentLocation (params:AnchorComputeParams):AnchorPlacement {
        return this._lastResult == null ? this.compute(params) : this._lastResult
    }
}
