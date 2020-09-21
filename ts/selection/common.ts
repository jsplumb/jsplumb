import {jsPlumbInstance} from "../core"
import {Dictionary, OverlayCapableComponent, OverlaySpec, PaintStyle} from ".."

export class SelectionBase<T extends OverlayCapableComponent>{

    constructor(protected instance:jsPlumbInstance, protected entries:Array<T>) {

    }

    get length():number {
        return this.entries.length
    }

    each( handler:(arg0:T) => void ) {
        this.entries.forEach( (e:T) => handler(e) )
    }

    get(index:number) {
        return this.entries[index]
    }

    addClass(clazz:string, updateAttachedElements?:boolean) {
        this.each((c:T) => c.addClass(clazz, updateAttachedElements))
    }

    removeClass(clazz:string, updateAttachedElements?:boolean) {
        this.each((c:T) => c.removeClass(clazz, updateAttachedElements))
    }

    removeAllOverlays() {
        this.each((c:T) => c.removeAllOverlays())
    }

    setLabel(label:string) {
        this.each((c:T) => c.setLabel(label))
    }

    clear() {
        this.entries.length = 0
    }

    map<Q>(fn:(entry:T) => Q):Array<Q> {
        const a:Array<Q> = []
        this.each((e:T) => a.push(fn(e)))
        return a
    }

    addOverlay(spec:OverlaySpec) {
        this.each((c:T) => c.addOverlay(spec))
    }

    removeOverlay(id:string) {
        this.each((c:T) => c.removeOverlay(id))
    }

    removeOverlays() {
        this.each((c:T) => c.removeOverlays())
    }

    showOverlay(id:string) {
        this.each((c:T) => c.showOverlay(id))
    }

    hideOverlay(id:string) {
        this.each((c:T) => c.hideOverlay(id))
    }

    setPaintStyle(style:PaintStyle) {
        this.each((c:T) => c.setPaintStyle(style))
    }

    setHoverPaintStyle(style:PaintStyle) {
        this.each((c:T) => c.setHoverPaintStyle(style))
    }

    setSuspendEvents(suspend:boolean) {
        this.each((c:T) => c.setSuspendEvents(suspend))
    }

    setParameter(name:string, value:string) {
        this.each((c:T) => c.setParameter(name, value))
    }

    setParameters(p:Dictionary<string>) {
        this.each((c:T) => c.setParameters(p))
    }

    setVisible(v:boolean) {
        this.each((c:T) => c.setVisible(v))
    }

    addType(name:string) {
        this.each((c:T) => c.addType(name))
    }
    toggleType(name:string) {
        this.each((c:T) => c.toggleType(name))
    }
    removeType(name:string) {
        this.each((c:T) => c.removeType(name))
    }

    bind(evt:string, handler:Function) {
        this.each((c:T) => c.bind(evt, handler))
    }

    unbind(evt:string, handler:Function) {
        this.each((c:T) => c.unbind(evt, handler))
    }
}
