import {Component } from "../component/component"
import { JsPlumbInstance } from "../core"
import {OverlaySpec} from "../../common/overlay"
import {forEach} from "../../util/util"
import {PaintStyle} from "../../common/paint-style"


export class SelectionBase<T extends Component>{

    constructor(protected instance:JsPlumbInstance, protected entries:Array<T>) { }

    get length():number {
        return this.entries.length
    }

    each( handler:(arg0:T) => void ):SelectionBase<T> {
        forEach(this.entries, (e:T) => handler(e) )
        return this
    }

    get(index:number) {
        return this.entries[index]
    }

    addClass(clazz:string, cascade?:boolean):SelectionBase<T> {
        this.each((c:T) => c.addClass(clazz, cascade))
        return this
    }

    removeClass(clazz:string, cascade?:boolean):SelectionBase<T> {
        this.each((c:T) => c.removeClass(clazz, cascade))
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
        return this
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
        this.each((c:T) => c.parameters[name] = value)
        return this
    }

    setParameters(p:Record<string, string>):SelectionBase<T> {
        this.each((c:T) => c.parameters = p)
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

    bind(evt:string, handler:(a:any, e?:any) => any):SelectionBase<T> {
        this.each((c:T) => c.bind(evt, handler))
        return this
    }

    unbind(evt:string, handler:Function):SelectionBase<T> {
        this.each((c:T) => c.unbind(evt, handler))
        return this
    }

    setHover(h:boolean):SelectionBase<T> {
        this.each((c:T) => this.instance.setHover(c, h))
        return this
    }
}
