import {Overlay} from "../overlay/overlay"
import {Constructable, Dictionary, jsPlumbInstance} from "../core"
import {Component} from "../component/component"
const overlayMap:Dictionary<Constructable<Overlay>> = {}

export const OverlayFactory = {
    get:(instance:jsPlumbInstance, name:string, component:Component, params:any):Overlay => {

        let c:Constructable<Overlay> = overlayMap[name]
        if (!c) {
            throw {message:"jsPlumb: unknown overlay type '" + name + "'"}
        } else {
            return new c(instance, component, params) as Overlay
        }
    },

    register:(name:string, overlay:Constructable<Overlay>) => {
        overlayMap[name] = overlay
    }
}
