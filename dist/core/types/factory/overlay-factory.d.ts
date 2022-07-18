import { Overlay } from '../overlay/overlay';
import { Constructable } from '@jsplumb/util';
import { JsPlumbInstance } from "../core";
import { Component } from '../component/component';
export declare const OverlayFactory: {
    get: (instance: JsPlumbInstance, name: string, component: Component, params: any) => Overlay;
    register: (name: string, overlay: Constructable<Overlay>) => void;
};
//# sourceMappingURL=overlay-factory.d.ts.map