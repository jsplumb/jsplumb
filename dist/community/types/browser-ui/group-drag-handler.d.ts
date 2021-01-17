import { ElementDragHandler } from "./element-drag-handler";
import { DragEventParams, GhostProxyingDragHandler, DragStopEventParams } from "./drag-manager";
import { BrowserJsPlumbInstance, jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Drag } from "./collicat";
export declare class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {
    protected instance: BrowserJsPlumbInstance;
    selector: string;
    doRevalidate: (el: jsPlumbDOMElement) => void;
    constructor(instance: BrowserJsPlumbInstance);
    reset(): void;
    private _revalidate;
    init(drag: Drag): void;
    useGhostProxy(container: any, dragEl: jsPlumbDOMElement): boolean;
    makeGhostProxy(el: jsPlumbDOMElement): jsPlumbDOMElement;
    onDrag(params: DragEventParams): void;
    onDragAbort(el: jsPlumbDOMElement): void;
    onStop(params: DragStopEventParams): void;
    private _isInsideParent;
    private _pruneOrOrphan;
}
