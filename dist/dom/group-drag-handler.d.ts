import { ElementDragHandler } from "./element-drag-handler";
import { GhostProxyingDragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { Drag } from "./collicat";
export declare class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {
    protected instance: BrowserJsPlumbInstance;
    selector: string;
    doRevalidate: (el: any) => void;
    constructor(instance: BrowserJsPlumbInstance);
    reset(): void;
    private _revalidate;
    init(drag: Drag): void;
    useGhostProxy(container: any, dragEl: any): boolean;
    makeGhostProxy(el: any): any;
    onDrag(params: any): void;
    onDragInit(el: HTMLElement): HTMLElement;
    onDragAbort: (el: HTMLElement) => void;
    onStop(params: any): void;
    private _isInsideParent;
    private _pruneOrOrphan;
}
