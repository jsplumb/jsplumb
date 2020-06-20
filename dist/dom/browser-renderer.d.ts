import { Renderer } from "../renderer";
import { Segment } from "../connector/abstract-segment";
import { Component, RepaintOptions } from "../component/component";
import { jsPlumbInstance, TypeDescriptor } from "../core";
import { Overlay } from "../overlay/overlay";
import { AbstractConnector } from "../connector/abstract-connector";
import { LabelOverlay } from "../overlay/label-overlay";
import { BrowserJsPlumbInstance, Connection, Endpoint, OverlayCapableComponent, PaintStyle } from "..";
export declare type EndpointHelperFunctions = {
    makeNode: (instance: jsPlumbInstance, ep: any, paintStyle: PaintStyle) => void;
    updateNode: (ep: any, node: SVGElement) => void;
};
export declare function registerEndpointRenderer<C>(name: string, fns: EndpointHelperFunctions): void;
export interface UIComponent {
    canvas: HTMLElement;
    svg: SVGElement;
}
export declare class BrowserRenderer implements Renderer {
    instance: BrowserJsPlumbInstance;
    getPath(segment: Segment, isFirstSegment: boolean): string;
    repaint(component: Component, typeDescriptor: string, options?: RepaintOptions): void;
    private static getLabelElement;
    private static getCustomElement;
    private static cleanup;
    private static setVisible;
    addOverlayClass(o: Overlay, clazz: string): void;
    removeOverlayClass(o: Overlay, clazz: string): void;
    paintOverlay(o: Overlay, params: any, extents: any): void;
    setOverlayVisible(o: Overlay, visible: boolean): void;
    moveOverlayParent(o: Overlay, newParent: HTMLElement): void;
    reattachOverlay(o: Overlay, c: OverlayCapableComponent): any;
    setOverlayHover(o: Overlay, hover: boolean): any;
    destroyOverlay(o: Overlay): void;
    drawOverlay(o: Overlay, component: any, paintStyle: PaintStyle, absolutePosition?: [number, number]): any;
    updateLabel(o: LabelOverlay): void;
    setHover(component: Component, hover: boolean): void;
    paintConnector(connector: AbstractConnector, paintStyle: PaintStyle, extents?: any): void;
    setConnectorHover(connector: AbstractConnector, h: boolean, doNotCascade?: boolean): void;
    destroyConnection(connection: Connection): void;
    addConnectorClass(connector: AbstractConnector, clazz: string): void;
    removeConnectorClass(connector: AbstractConnector, clazz: string): void;
    getConnectorClass(connector: AbstractConnector): string;
    setConnectorVisible(connector: AbstractConnector, v: boolean): void;
    applyConnectorType(connector: AbstractConnector, t: TypeDescriptor): void;
    addEndpointClass(ep: Endpoint, c: string): void;
    applyEndpointType<C>(ep: Endpoint, t: TypeDescriptor): void;
    private getEndpointCanvas;
    destroyEndpoint(ep: Endpoint): void;
    paintEndpoint<C>(ep: Endpoint, paintStyle: PaintStyle): void;
    removeEndpointClass<C>(ep: Endpoint, c: string): void;
    getEndpointClass(ep: Endpoint): string;
    private static getEndpointCanvas;
    refreshEndpoint(endpoint: Endpoint): void;
    setEndpointHover(endpoint: Endpoint, h: boolean, doNotCascade?: boolean): void;
    setEndpointVisible<C>(ep: Endpoint, v: boolean): void;
}
