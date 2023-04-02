
import {ElementDragHandler} from "./element-drag-handler"
import {GhostProxyingDragHandler} from "./drag-manager"
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import { jsPlumbDOMElement} from './element-facade'
import {Drag} from "./collicat"
import {EVENT_REVERT, SELECTOR_GROUP} from "./constants"
import {DragSelection} from "./drag-selection"
import {SELECTOR_MANAGED_ELEMENT} from "../core/constants"


export class GroupDragHandler extends ElementDragHandler implements GhostProxyingDragHandler {

    selector: string = [">" , SELECTOR_GROUP, SELECTOR_MANAGED_ELEMENT].join(" ")

    doRevalidate:(el:jsPlumbDOMElement) => void

    constructor(protected instance:BrowserJsPlumbInstance, protected dragSelection:DragSelection) {
        super(instance, dragSelection)

        this.doRevalidate = this._revalidate.bind(this)
    }

    reset() {
        this.drag.off(EVENT_REVERT, this.doRevalidate)
    }

    private _revalidate(el:any) {
        this.instance.revalidate(el)
    }

    init(drag:Drag) {
        this.drag = drag
        drag.on(EVENT_REVERT, this.doRevalidate)
    }

    useGhostProxy(container:any, dragEl:Element) {
        let group = (dragEl as jsPlumbDOMElement)._jsPlumbParentGroup
        return group == null ? false : group.ghost === true
    }

    /**
     * Makes the element that acts as a ghost proxy.
     * @param el
     */
    makeGhostProxy (el: Element):Element {
        // do not believe an IDE if it tells you this method can be static. It can't.
        const jel = el as unknown as jsPlumbDOMElement
        const newEl = jel.cloneNode(true)
        newEl._jsPlumbParentGroup = jel._jsPlumbParentGroup
        return newEl
    }

}
