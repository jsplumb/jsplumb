import { PaintStyle } from '../styles'
import { OverlaySpec } from '../overlay/overlay'
import {OverlayCapableComponent } from "../component/overlay-capable-component"
import { Dictionary } from '../common'
import { JsPlumbInstance } from "../core"

export class SelectionBase<T extends OverlayCapableComponent>{

    constructor(protected instance:JsPlumbInstance, protected entries:Array<T>) { }

    get length():number {
        return this.entries.length
    }

    each( handler:(arg0:T) => void ):SelectionBase<T> {
        this.entries.forEach( (e:T) => handler(e) )
        return this
    }

    get(index:number) {
        return this.entries[index]
    }

    addClass(clazz:string, updateAttachedElements?:boolean):SelectionBase<T> {
        this.each((c:T) => c.addClass(clazz, updateAttachedElements))
        return this
    }

    removeClass(clazz:string, updateAttachedElements?:boolean):SelectionBase<T> {
        this.each((c:T) => c.removeClass(clazz, updateAttachedElements))
        return this
    }

    removeAllOverlays():SelectionBase<T> {
        this.each((c:T) => c.removeAllOverlays())
        return this
    }

    setLabel(label:string):SelectionBase<T> {
        this.each((c:T) => c.setLabel(label))
        return this
    }

    clear() {
        this.entries.length = 0
    }

    map<Q>(fn:(entry:T) => Q):Array<Q> {
        const a:Array<Q> = []
        this.each((e:T) => a.push(fn(e)))
        return a
    }

    addOverlay(spec:OverlaySpec):SelectionBase<T> {
        this.each((c:T) => c.addOverlay(spec))
        return this
    }

    removeOverlay(id:string):SelectionBase<T> {
        this.each((c:T) => c.removeOverlay(id))
        return this
    }

    removeOverlays():SelectionBase<T> {
        this.each((c:T) => c.removeOverlays())
        return this
    }

    showOverlay(id:string):SelectionBase<T> {
        this.each((c:T) => c.showOverlay(id))
        return this
    }

    hideOverlay(id:string):SelectionBase<T> {
        this.each((c:T) => c.hideOverlay(id))
        return this
    }

    setPaintStyle(style:PaintStyle):SelectionBase<T> {
        this.each((c:T) => c.setPaintStyle(style))
        return this
    }

    setHoverPaintStyle(style:PaintStyle):SelectionBase<T> {
        this.each((c:T) => c.setHoverPaintStyle(style))
        return this
    }

    setSuspendEvents(suspend:boolean):SelectionBase<T> {
        this.each((c:T) => c.setSuspendEvents(suspend))
        return this
    }

    setParameter(name:string, value:string):SelectionBase<T> {
        this.each((c:T) => c.setParameter(name, value))
        return this
    }

    setParameters(p:Dictionary<string>):SelectionBase<T> {
        this.each((c:T) => c.setParameters(p))
        return this
    }

    setVisible(v:boolean):SelectionBase<T> {
        this.each((c:T) => c.setVisible(v))
        return this
    }

    addType(name:string):SelectionBase<T> {
        this.each((c:T) => c.addType(name))
        return this
    }

    toggleType(name:string):SelectionBase<T> {
        this.each((c:T) => c.toggleType(name))
        return this
    }

    removeType(name:string):SelectionBase<T> {
        this.each((c:T) => c.removeType(name))
        return this
    }

    bind(evt:string, handler:Function):SelectionBase<T> {
        this.each((c:T) => c.bind(evt, handler))
        return this
    }

    unbind(evt:string, handler:Function):SelectionBase<T> {
        this.each((c:T) => c.unbind(evt, handler))
        return this
    }

    setHover(h:boolean):SelectionBase<T> {
        this.each((c:T) => this.instance.renderer.setHover(c, h))
        return this
    }
}
