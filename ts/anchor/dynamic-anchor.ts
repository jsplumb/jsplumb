import {
    Anchor
} from "./anchor";

import {
    AnchorComputeParams, AnchorOptions, AnchorSpec, ComputedAnchorPosition, makeAnchorFromSpec,
    Orientation
} from "./anchors";

import {jsPlumbInstance, PointArray} from "../core";
import {Endpoint} from "../endpoint/endpoint-impl";

export interface DynamicAnchorOptions<E> extends AnchorOptions {
    selector?:(xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray, anchors:Array<Anchor<E>>) => Anchor<E>;
    elementId?:string;
    anchors:Array<Anchor<E>>;
}

// helper method to calculate the distance between the centers of the two elements.
function _distance<E>(anchor:Anchor<E>, cx:number, cy:number, xy:PointArray, wh:PointArray):number {

    let ax = xy[0] + (anchor.x * wh[0]), ay = xy[1] + (anchor.y * wh[1]),
        acx = xy[0] + (wh[0] / 2), acy = xy[1] + (wh[1] / 2);

    return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)));
}

const DEFAULT_ANCHOR_SELECTOR = (xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray, anchors:Array<Anchor<any>>) => {
    let cx = txy[0] + (twh[0] / 2), cy = txy[1] + (twh[1] / 2);
    let minIdx = -1, minDist = Infinity;
    for (let i = 0; i < anchors.length; i++) {
        let d = _distance(anchors[i], cx, cy, xy, wh);
        if (d < minDist) {
            minIdx = i + 0;
            minDist = d;
        }
    }
    return anchors[minIdx];
};

function _convertAnchor<E>(anchor:Anchor<E> | AnchorSpec, instance:jsPlumbInstance<E>, elementId:string):Anchor<E> {
    return anchor instanceof Anchor ? (anchor as Anchor<E>) : makeAnchorFromSpec(instance, anchor as AnchorSpec, elementId);
}

export class DynamicAnchor<E> extends Anchor<E> {

    anchors:Array<Anchor<E>>;
    private _curAnchor:Anchor<E>;
    private _lastAnchor:Anchor<E>;

    private _anchorSelector:(xy:PointArray, wh:PointArray, txy:PointArray, twh:PointArray, anchors:Array<Anchor<E>>) => Anchor<E> = null;

    constructor(public instance:jsPlumbInstance<E>, options:DynamicAnchorOptions<E>) {
        super(instance, options);

        this.isDynamic = true;
        this.anchors = [];
        this.elementId = options.elementId;

        for (let i = 0; i < options.anchors.length; i++) {
            this.anchors[i] = _convertAnchor(options.anchors[i], instance, this.elementId);
        }

        this._curAnchor = this.anchors.length > 0 ? this.anchors[0] : null;
        this._lastAnchor = this._curAnchor;

        // default method uses distance between element centers.  you can provide your own method in the dynamic anchor
        // constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays:
        // xy - xy loc of the anchor's element
        // wh - anchor's element's dimensions
        // txy - xy loc of the element of the other anchor in the connection
        // twh - dimensions of the element of the other anchor in the connection.
        // anchors - the list of selectable anchors
        this._anchorSelector = options.selector || DEFAULT_ANCHOR_SELECTOR;

    }

    getAnchors ():Array<Anchor<E>> {
        return this.anchors;
    }

    compute (params:AnchorComputeParams<E>):ComputedAnchorPosition {
        let xy = params.xy, wh = params.wh, txy = params.txy, twh = params.twh;

        this.timestamp = params.timestamp;

        // if anchor is locked or an opposite element was not given, we
        // maintain our state. anchor will be locked
        // if it is the source of a drag and drop.
        if (this.isLocked() || txy == null || twh == null) {
            return this._curAnchor.compute(params);
        }
        else {
            params.timestamp = null; // otherwise clear this, i think. we want the anchor to compute.
        }

        this._curAnchor = this._anchorSelector(xy, wh, txy, twh, this.anchors);
        this.x = this._curAnchor.x;
        this.y = this._curAnchor.y;

        if (this._curAnchor !== this._lastAnchor) {
            this.fire("anchorChanged", this._curAnchor);
        }

        this._lastAnchor = this._curAnchor;

        return this._curAnchor.compute(params);
    };

    getCurrentLocation (params:AnchorComputeParams<E>):ComputedAnchorPosition {
        return (this._curAnchor != null ? this._curAnchor.getCurrentLocation(params) : null);
    };

    getOrientation (_endpoint?:Endpoint<E>):Orientation {
        return this._curAnchor != null ? this._curAnchor.getOrientation(_endpoint) : [ 0, 0 ];
    }

    over (anchor:Anchor<E>, endpoint:Endpoint<E>):void {
        if (this._curAnchor != null) {
            this._curAnchor.over(anchor, endpoint);
        }
    }

    out ():void {
        if (this._curAnchor != null) {
            this._curAnchor.out();
        }
    }

    setAnchor (a:Anchor<E>):void {
        this._curAnchor = a;
    }

    getCssClass ():string {
        return (this._curAnchor && this._curAnchor.getCssClass()) || "";
    }
}
