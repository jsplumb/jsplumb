import { Overlay } from '../overlay/overlay';
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
import { Constructable } from "../../util/util";
export declare const OverlayFactory: {
    get: (instance: JsPlumbInstance, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};
//# sourceMappingURL=overlay-factory.d.ts.map