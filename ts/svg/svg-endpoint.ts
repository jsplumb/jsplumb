// import {SvgComponent} from "./svg-component";
// import {Component, RepaintOptions} from "../component";
//
// export class SvgEndpoint extends SvgComponent {
//
//     typeId:null;
//
//     clone(): Component<HTMLElement> {
//         return null;
//     }
//
//     getIdPrefix(): string {
//         return "ep_";
//     }
//
//     shouldFireEvent(event: string, value: any, originalEvent?: Event): boolean {
//         return true;
//     }
//
//     getTypeDescriptor ():string {
//         return "endpoint";
//     }
//
//     repaint(options?:RepaintOptions) {
//
//     }
//
// }

import {EndpointRepresentation} from "../endpoint/endpoints";
import {SvgComponent, SvgComponentOptions} from "./svg-component";
import {jsPlumbInstance} from "../core";
import {EndpointRenderer} from "../endpoint/endpoint-renderer";

export class SvgEndpoint extends SvgComponent implements EndpointRenderer<HTMLElement> {

    constructor(protected instance:jsPlumbInstance<HTMLElement>, protected ep:EndpointRepresentation<HTMLElement, any>, options?:SvgComponentOptions) {
        super(instance, ep, options);
    }


}