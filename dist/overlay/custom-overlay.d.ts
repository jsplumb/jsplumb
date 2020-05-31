import { CustomOverlayOptions, Overlay } from "./overlay";
import { jsPlumbInstance } from "../core";
import { Component } from "..";
export declare class CustomOverlay<E> extends Overlay<E> {
    instance: jsPlumbInstance<E>;
    component: Component<E>;
    create: (c: Component<E>) => E;
    constructor(instance: jsPlumbInstance<E>, component: Component<E>, p: CustomOverlayOptions<E>);
    type: string;
    updateFrom(d: any): void;
}
