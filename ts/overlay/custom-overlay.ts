import {CustomOverlayOptions, Overlay} from "./overlay";
import {Dictionary, jsPlumbInstance} from "../core";
import {Component, Connection, OverlayFactory, PaintStyle, SegmentBounds} from "..";


export class CustomOverlay<E> extends Overlay<E> {

    create:(c:Component<E>) => E;

    constructor(protected instance:jsPlumbInstance<E>, public component:Component<E>,
                p:CustomOverlayOptions<E>) {

        super(instance, component, p);

        this.create = p.create;
        this.setRenderer(this.instance.renderer.assignOverlayRenderer(this.instance, this));

    }

    events: Dictionary<Function>;

    type:string = "Custom";

    draw(component: any, paintStyle: PaintStyle, absolutePosition?: any): SegmentBounds {
        return this.getRenderer().draw(component, paintStyle, absolutePosition);
    }

    updateFrom(d: any): void {

    }



}

OverlayFactory.register("Custom", CustomOverlay);