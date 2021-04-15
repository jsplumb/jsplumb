import { ElementDragHandler } from "./element-drag-handler";
import { GhostProxyingDragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { DragEventParams, Drag, DragStopEventParams } from "./collicat";
export declare class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {
    protected instance: BrowserJsPlumbInstance;
    selector: string;
    doRevalidate: (el: jsPlumbDOMElement) => void;
    constructor(instance: BrowserJsPlumbInstance);
    reset(): void;
    private _revalidate;
    init(drag: Drag): void;
    useGhostProxy(container: any, dragEl: Element): boolean;
    /**
     * Makes the element that acts as a ghost proxy.
     * @param el
     */
    makeGhostProxy(el: Element): Element;
    onDrag(params: DragEventParams): void;
    onDragAbort(el: jsPlumbDOMElement): void;
    onStop(params: DragStopEventParams): void;
    private _isInsideParent;
    private _pruneOrOrphan;
}
