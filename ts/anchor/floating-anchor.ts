
import {Anchor} from "./abstract-anchor";
import {AnchorComputeParams, AnchorLocation, AnchorSize} from "./anchors";
import {Endpoint} from "../endpoint";

export class FloatingAnchor<EventType, ElementType> extends Anchor<EventType, ElementType> {

    ref:Anchor<EventType, ElementType>;
    refCanvas:ElementType;
    xDir:any;
    yDir:any;
    _lastResult:AnchorLocation;
    size:AnchorSize;


    constructor(params:any) {
        super(params);

        this.x = 0;
        this.y = 0;
        this.ref = params.reference;
        this.refCanvas = params.referenceCanvas;
        this.size = this.jsPlumbInstance.getSize(this.refCanvas);
        this.orientation = null;
        this.isFloating = true;
    }

    compute(params:AnchorComputeParams) {
        let xy = params.xy,
            result:[ number, number ] = [ xy[0] + (this.size[0] / 2), xy[1] + (this.size[1] / 2) ]; // return origin of the element. we may wish to improve this so that any object can be the drag proxy.

        this._lastResult = result;
        return result;
    }

    getOrientation(_endpoint:Endpoint<EventType, ElementType>) {
        if (this.orientation) {
            return this.orientation;
        }
        else {
            let o = this.ref.getOrientation(_endpoint);
            // here we take into account the orientation of the other
            // anchor: if it declares zero for some direction, we declare zero too. this might not be the most awesome. perhaps we can come
            // up with a better way. it's just so that the line we draw looks like it makes sense. maybe this wont make sense.
            return [ Math.abs(o[0]) * this.xDir * -1,
                Math.abs(o[1]) * this.yDir * -1 ];
        }
    }

    /**
     * notification the endpoint associated with this anchor is hovering
     * over another anchor; we want to assume that anchor's orientation
     * for the duration of the hover.
     */
    over(anchor:Anchor<EventType, ElementType>, endpoint:Endpoint<EventType, ElementType>) {
        this.orientation = anchor.getOrientation(endpoint);
    }

    /**
     * notification the endpoint associated with this anchor is no
     * longer hovering over another anchor; we should resume calculating
     * orientation as we normally do.
     */
    out() {
        this.orientation = null;
    }

    getCurrentLocation(params:any) {
        return this._lastResult == null ? this.compute(params) : this._lastResult;
    }

    anchorType = "Floating"
}
