import { Overlay } from "../overlay/overlay";
import { Constructable, jsPlumbInstance } from "../core";
import { Component } from "../component/component";
export declare const OverlayFactory: {
    get: (instance: jsPlumbInstance, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};
