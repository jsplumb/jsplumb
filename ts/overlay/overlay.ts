import {OverlayCapableComponent} from "./overlay-capable-component";
import {UIComponent} from "../component/ui-component";
import {ArrayLocation} from "../jsplumb-defaults";
/**
 * Created by simon on 19/10/2017.
 */

export abstract class Overlay<EventType, ElementType> extends UIComponent<EventType, ElementType> {

    visible:Boolean = true;
    isAppendedAtRootLevel:Boolean = true;
    component:OverlayCapableComponent<EventType, ElementType>;
    loc:number = 0.5;
    endpointLoc:Array<number> = [0.5, 0.5];
    canvas:ElementType;
    _jsPlumb:any;

    abstract overlayType:string;

    idPrefix:string = "_jsplumb_o";

    constructor(params:any) {
        super(params);

        this._jsPlumb = params._jsPlumb;
        this.component = params.component;
        if (params.location != null) {
            this.loc = params.location;
        }
        if (params.endpointLocation != null) {
            this.endpointLoc = params.endpointLocation;
        }
        this.visible = params.visible !== false;
    }

    abstract draw(component:OverlayCapableComponent<EventType, ElementType>, currentConnectionPaintStyle:any):void;

    getTypeDescriptor():string {
        return "overlay"
    }

    cleanup(force?:Boolean) {
        if (force) {
            this.component = null;
            this.canvas = null;
            this.endpointLoc = null;
        }
    }

    setVisible(val:Boolean) {
        this.visible = val;
        this.component.repaint();
    }

    isVisible():Boolean {
        return this.visible;
    }

    hide() {
        this.setVisible(false);
    }

    show() {
        this.setVisible(true);
    }

    incrementLocation(amount:number) {
        this.loc += amount;
        this.component.repaint();
    }

    setLocation(l:number) {
        this.loc = l;
        this.component.repaint();
    }

    getLocation():number {
        return this.loc;
    }

    updateFrom(d:any) { }


    shouldFireEvent(event: string, value: any, originalEvent?: EventType): Boolean {
        return true;
    }

    /**
     * Overriden and currently not implemented. It is almost certainly the case that
     * the paint cycle of an Overlay is not the same as that of a Connection or
     * Endpoint.
     * @overridden
     * @param params
     */
    repaint(params?:any) {}

    protected _getDimensions(forceRefresh?:Boolean) {
        if (this._jsPlumb.cachedDimensions == null || forceRefresh) {
            this._jsPlumb.cachedDimensions = this.getDimensions();
        }
        return this._jsPlumb.cachedDimensions;
    }

    abstract getDimensions():ArrayLocation;
}