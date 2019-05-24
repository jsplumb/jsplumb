import {Overlay} from "../overlay/overlay";
import {Constructable, Dictionary, jsPlumbInstance} from "../core";
import {Component} from "../component/component";
const overlayMap:Dictionary<Constructable<Overlay<any>>> = {};

export const OverlayFactory = {
    get:(instance:jsPlumbInstance<any>, name:string, component:Component<any>, params:any):Overlay<any> => {

        let c:Constructable<Overlay<any>> = overlayMap[name];
        if (!c) {
            throw {message:"jsPlumb: unknown overlay type '" + name + "'"};
        } else {
            return new c(instance, component, params) as Overlay<any>;
        }
    },

    register:(name:string, overlay:Constructable<Overlay<any>>) => {
        overlayMap[name] = overlay;
    }
};
