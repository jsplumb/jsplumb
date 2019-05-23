
import {Constructable, Dictionary, jsPlumbInstance} from "../core";
import {Endpoint} from "./endpoint-impl";
import {ComputedAnchorPosition, Orientation} from "../anchor/anchors";
import {Anchor} from "../anchor/anchor";
import {PaintStyle} from "../styles";
import {EndpointRenderer} from "./endpoint-renderer";

const endpointMap:Dictionary<Constructable<EndpointRepresentation<any, any>>> = {};

export const Endpoints = {
    get:(instance:jsPlumbInstance<any>, name:string, params:any):EndpointRepresentation<any, any> => {

        let e:Constructable<EndpointRepresentation<any, any>> = endpointMap[name];
        if (!e) {
            throw {message:"jsPlumb: unknown endpoint type '" + name + "'"};
        } else {
            return new e(instance, params) as EndpointRepresentation<any, any>;
        }
    },

    register:(name:string, ep:Constructable<EndpointRepresentation<any, any>>) => {
        endpointMap[name] = ep;
    }
}

export abstract class EndpointRepresentation<E, C> {

    typeId:string;

    renderer:EndpointRenderer<E>;

    x:number;
    y:number;
    w:number;
    h:number;

    abstract type:string;
    abstract _compute(anchorPoint:ComputedAnchorPosition, orientation:Orientation, endpointStyle:any):C;

    constructor(protected instance:jsPlumbInstance<E>) {
        this.renderer = instance.renderer.assignRenderer(instance, this);
    }

    paint(paintStyle:PaintStyle, anchor:Anchor<any>) {
        console.log("paint endpoint");
    }

    clone():EndpointRepresentation<E, C> {
        return null;
    }

    cleanup(force?:boolean) {

    }

    destroy(force?:boolean) {

    }

    setHover(h:boolean) {

    }
}




