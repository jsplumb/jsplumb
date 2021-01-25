import { Overlay } from '../overlay/overlay';
import { Constructable } from '../common';
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
export declare const OverlayFactory: {
    get: (instance: JsPlumbInstance<any>, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};
