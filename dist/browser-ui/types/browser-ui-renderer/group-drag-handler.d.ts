import { ElementDragHandler } from "./element-drag-handler";
import { GhostProxyingDragHandler } from "./drag-manager";
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { jsPlumbDOMElement } from './element-facade';
import { Drag } from "./collicat";
import { DragSelection } from "./drag-selection";
export declare class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {
    protected instance: BrowserJsPlumbInstance;
    protected dragSelection: DragSelection;
    selector: string;
    doRevalidate: (el: jsPlumbDOMElement) => void;
    constructor(instance: BrowserJsPlumbInstance, dragSelection: DragSelection);
    reset(): void;
    private _revalidate;
    init(drag: Drag): void;
    useGhostProxy(container: any, dragEl: Element): boolean;
    /**
     * Makes the element that acts as a ghost proxy.
     * @param el
     */
    makeGhostProxy(el: Element): Element;
}
//# sourceMappingURL=group-drag-handler.d.ts.map