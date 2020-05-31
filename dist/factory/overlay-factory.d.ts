import { Overlay } from "../overlay/overlay";
import { Constructable, jsPlumbInstance } from "../core";
import { Component } from "../component/component";
export declare const OverlayFactory: {
    get: (instance: jsPlumbInstance<any>, name: string, component: Component<any>, params: any) => Overlay<any>;
    register: (name: string, overlay: Constructable<Overlay<any>>) => void;
};
