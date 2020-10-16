import {jsPlumbInstance, Offset, PointArray} from "../core"
import {EventGenerator} from "../event-generator"
import {Endpoint} from "../endpoint/endpoint-impl"
import { AnchorComputeParams, AnchorId, AnchorOptions, AnchorOrientationHint, Orientation } from "../factory/anchor-factory"
import {AnchorPlacement} from "../anchor-manager"
import {rotatePoint} from "../util"

export class Anchor extends EventGenerator {

    type: AnchorId
    isDynamic: boolean = false
    isContinuous: boolean = false
    isFloating:boolean = false
    cssClass: string = ""
    elementId: string
    id: string
    locked: boolean
    offsets: [number, number]
    orientation: Orientation
    x: number
    y: number
    timestamp:string
    lastReturnValue: AnchorPlacement

    private _unrotatedOrientation:Orientation

    positionFinder:(dropPosition:Offset, elPosition:Offset, elSize:PointArray, constructorParams:any) => any

    clone:() => Anchor

    constructor(public instance:jsPlumbInstance,  params?:AnchorOptions) {
        super()
        params = params || {}
        this.cssClass = params.cssClass || ""
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
    }

    getOrientation(endpoint?: Endpoint): Orientation {
        return this.orientation
    }

    getCurrentLocation(params:AnchorComputeParams):AnchorPlacement {
        params = params || {}
        return (this.lastReturnValue == null || (params.timestamp != null && this.timestamp !== params.timestamp)) ? this.compute(params) : this.lastReturnValue
    }

    setPosition (x:number, y:number, ox:AnchorOrientationHint, oy:AnchorOrientationHint, overrideLock?:boolean):void {
        if (!this.locked || overrideLock) {
            this.x = x
            this.y = y
            this.orientation = [ ox, oy ]
            this._unrotatedOrientation = [ ox, oy ]
            this.lastReturnValue = null
        }
    }

    setInitialOrientation(ox:number, oy:number) {
        this.orientation = [ ox, oy ]
        this._unrotatedOrientation = [ ox, oy ]
    }

    compute (params:AnchorComputeParams):AnchorPlacement {

        let xy = params.xy, wh = params.wh, timestamp = params.timestamp

        if (timestamp && timestamp === this.timestamp) {
            return this.lastReturnValue
        }

        const candidate:[ number, number, number, number ] = [ xy[0] + (this.x * wh[0]) + this.offsets[0], xy[1] + (this.y * wh[1]) + this.offsets[1], this.x, this.y ]

        const rotation = params.rotation;
        if (rotation != null && rotation !== 0) {
           const c2 = rotatePoint(candidate, [ xy[0] + (wh[0] / 2), xy[1] + (wh[1] / 2)], rotation)

            this.orientation[0] = Math.round((this._unrotatedOrientation[0] * c2[2]) - (this._unrotatedOrientation[1] * c2[3]));
            this.orientation[1] = Math.round((this._unrotatedOrientation[1] * c2[2]) + (this._unrotatedOrientation[0] * c2[3]));

            this.lastReturnValue = c2
        } else {
            this.orientation[0] = this._unrotatedOrientation[0];
            this.orientation[1] = this._unrotatedOrientation[1];
            this.lastReturnValue = candidate;
        }

        this.timestamp = timestamp
        return this.lastReturnValue
    }

    equals(anchor:Anchor):boolean {
        if (!anchor) {
            return false
        }
        let ao = anchor.getOrientation(),
            o = this.getOrientation()
        return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1]
    }

    getCssClass():string {
        return this.cssClass
    }

    lock ():void { this.locked = true; }
    unlock ():void { this.locked = false; }
    isLocked ():boolean { return this.locked; }

    over (anchor:Anchor, endpoint:Endpoint):void { }

    out ():void { }
}
