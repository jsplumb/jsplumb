import { BrowserJsPlumbInstance, Endpoint, EndpointRenderer, PaintStyle, TypeDescriptor } from "..";
import { ImageEndpoint } from "../endpoint/image-endpoint";
export declare class DOMImageEndpointRenderer implements EndpointRenderer<HTMLElement> {
    protected endpoint: Endpoint<HTMLElement>;
    ep: ImageEndpoint<HTMLElement>;
    canvas: HTMLElement;
    instance: BrowserJsPlumbInstance;
    _initialized: boolean;
    img: any;
    constructor(endpoint: Endpoint<HTMLElement>, ep: ImageEndpoint<HTMLElement>, options?: any);
    addClass(c: string): void;
    removeClass(c: string): void;
    moveParent(newParent: HTMLElement): void;
    applyType(t: TypeDescriptor): void;
    cleanup(force?: boolean): void;
    destroy(force?: boolean): void;
    getElement(): HTMLElement;
    private actuallyPaint;
    paint(paintStyle: PaintStyle): void;
    setHover(h: boolean): void;
    setVisible(v: boolean): void;
}
