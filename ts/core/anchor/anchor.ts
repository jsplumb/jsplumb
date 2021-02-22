import {PointXY, Size} from '../common'
import { JsPlumbInstance } from "../core"
import {EventGenerator} from "../event-generator"
import { AnchorId, AnchorOptions, AnchorOrientationHint, Orientation } from "../factory/anchor-factory"
import {AnchorPlacement} from "../router/router"

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

    _unrotatedOrientation:Orientation

    positionFinder:(dropPosition:PointXY, elPosition:PointXY, elSize:Size, constructorParams:any) => any

    clone:() => Anchor

    constructor(public instance:JsPlumbInstance,  params?:AnchorOptions) {
        super()
        params = params || {}
        this.cssClass = params.cssClass || ""
    }

    shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
        return true
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

    equals(anchor:Anchor):boolean {
        if (!anchor) {
            return false
        }
        let ao = this.instance.router.getAnchorOrientation(anchor),
            o = this.instance.router.getAnchorOrientation(this)
        return this.x === anchor.x && this.y === anchor.y && this.offsets[0] === anchor.offsets[0] && this.offsets[1] === anchor.offsets[1] && o[0] === ao[0] && o[1] === ao[1]
    }

    getCssClass():string {
        return this.cssClass
    }

    lock ():void { this.locked = true; }
    unlock ():void { this.locked = false; }
    isLocked ():boolean { return this.locked; }

}
