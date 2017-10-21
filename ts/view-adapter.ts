import {ArrayLocation, LeftTopLocation} from "./jsplumb-defaults";
import {Connector} from "./connector/connector";
import {ConnectorRenderer} from "./renderer/ConnectorRenderer";

export interface ViewAdapter<EventType,ElementType> {
    getSelector(ctx:any, spec:string):any;

// DRAG/DROP
//     isDragSupported(el:ElementType):Boolean;
//     isDropSupported(el:ElementType):Boolean;
//     isAlreadyDraggable(el:ElementType):Boolean

    trigger(el:ElementType, event:string, originalEvent?:EventType):void;

    // on(el:ElementType, evt:string, fn:Function):any;
    // off(el:ElementType, fn:Function):any;

    appendToRoot(el:ElementType):void;

    getSize(el:ElementType):[number, number];

    getWidth(el:ElementType):number;

    getHeight(el:ElementType):number;

    getOffset(el:ElementType, relativeToRoot?:Boolean, container?:ElementType):LeftTopLocation

    createElement(tag:string, style?:Map<string, string>, clazz?:string, atts?:Map<string, string>):ElementType

    createElementNS(ns:string, tag:string, style?:Map<string, string>, clazz?:string, atts?:Map<string, string>):ElementType

    getAttribute(el:ElementType, attName:string):string;

    setAttribute(el:ElementType, attName:string, attValue:string):void;

    setAttributes(el:ElementType, atts:any):void;

    getClass(el:ElementType):string;

    addClass(el:ElementType, clazz:string):void;

    hasClass(el:ElementType, clazz:string):Boolean;

    removeClass(el:ElementType, clazz:string):void;

    updateClasses(el:ElementType, toAdd:string|Array<string>, toRemove?:string|Array<string>):void;

    setClass(el:ElementType, clazz:string):void;

    setPosition(el:ElementType, p:LeftTopLocation):void;

    getPosition(el:ElementType):LeftTopLocation;

    getStyle(el:ElementType, prop:string):string;

    getPositionOnElement(evt:EventType, el:ElementType, zoom:number):ArrayLocation;

    pageLocation(evt:EventType):ArrayLocation;
    screenLocation(evt:EventType):ArrayLocation;
    clientLocation(evt:EventType):ArrayLocation;

    getUIPosition(eventArgs:any, zoom:number):LeftTopLocation;

    createConnectorRenderer(connector:Connector<EventType, ElementType>):ConnectorRenderer;

    removeElement(el:ElementType):void;


// getHeadlessInstance:function(fnSize, fnPosition) {
//     var j = _jp.getInstance();
//     j.getSize = fnSize;
//     return j;
// }
}