import {Anchor} from "./abstract-anchor";
import {JsPlumbInstance} from "../core";
import {AnchorComputeParams, Anchors} from "./anchors";

export class DynamicAnchor<EventType, ElementType> extends Anchor<EventType, ElementType> {

    anchors:Array<any> = [];
    locked:Boolean = false;
    _curAnchor:Anchor<EventType, ElementType>;
    _lastAnchor:Anchor<EventType, ElementType>;

    static convertAnchor<EventType, ElementType>(anchor:any, jsPlumbInstance:JsPlumbInstance<EventType, ElementType>, elementId:string) {
        return anchor.constructor === Anchor ? anchor : Anchors.makeAnchor(anchor, elementId, jsPlumbInstance);
    }

    static distance(anchor:Anchor<any,any>, cx:number, cy:number, xy:number[], wh:number[]) {
        let ax = xy[0] + (anchor.x * wh[0]), ay = xy[1] + (anchor.y * wh[1]),
            acx = xy[0] + (wh[0] / 2), acy = xy[1] + (wh[1] / 2);

        return (Math.sqrt(Math.pow(cx - ax, 2) + Math.pow(cy - ay, 2)) + Math.sqrt(Math.pow(acx - ax, 2) + Math.pow(acy - ay, 2)));
    }

    // default method uses distance between element centers.  you can provide your own method in the dynamic anchor
            // constructor (and also to jsPlumb.makeDynamicAnchor). the arguments to it are four arrays:
            // xy - xy loc of the anchor's element
            // wh - anchor's element's dimensions
            // txy - xy loc of the element of the other anchor in the connection
            // twh - dimensions of the element of the other anchor in the connection.
            // anchors - the list of selectable anchors
    private _anchorSelector:Function;

    constructor(params:any) {
        super(params);

        this.isDynamic = true;
        this.elementId = params.elementId;

        for (let i = 0; i < params.anchors.length; i++) {
            this.anchors[i] = DynamicAnchor.convertAnchor(params.anchors[i], this.jsPlumbInstance, this.elementId);
        }

        this._curAnchor = this.anchors.length > 0 ? this.anchors[0] : null;
        this._lastAnchor = this._curAnchor;

        this._anchorSelector = params.selector || function (xy:number[], wh:number[], txy:number[], twh:number[], anchors:Anchor<any,any>[]) {
                let cx = txy[0] + (twh[0] / 2), cy = txy[1] + (twh[1] / 2);
                let minIdx = -1, minDist = Infinity;
                for (let i = 0; i < anchors.length; i++) {
                    let d = DynamicAnchor.distance(anchors[i], cx, cy, xy, wh);
                    if (d < minDist) {
                        minIdx = i + 0;
                        minDist = d;
                    }
                }
                return anchors[minIdx];
            };

    }

    getAnchors() {
        return this.anchors;
    }

    compute(params:AnchorComputeParams) {
        let xy = params.xy, wh = params.wh, txy = params.txy, twh = params.twh;

        this.timestamp = params.timestamp;

        let udl = this.getUserDefinedLocation();
        if (udl != null) {
            return udl;
        }

        // if anchor is locked or an opposite element was not given, we
        // maintain our state. anchor will be locked
        // if it is the source of a drag and drop.
        if (this.locked || txy == null || twh == null) {
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
    }

    getCurrentLocation(params:any) {
        return this.getUserDefinedLocation() || (this._curAnchor != null ? this._curAnchor.getCurrentLocation(params) : null);
    };

    getOrientation(_endpoint:any) {
        return this._curAnchor != null ? this._curAnchor.getOrientation(_endpoint) : Anchors.AMBIVALENT_ORIENTATION;
    }

    over(anchor:any, endpoint:any) {
        if (this._curAnchor != null) {
            this._curAnchor.over(anchor, endpoint);
        }
    }

    out() {
        if (this._curAnchor != null) {
            this._curAnchor.out();
        }
    }

    /**
     * @override
     * @returns {string}
     */
    getCssClass() {
        return (this._curAnchor && this._curAnchor.getCssClass()) || "";
    }

    anchorType = "Dynamic"
}