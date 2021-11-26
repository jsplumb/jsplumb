import { jsPlumbDOMElement } from './element-facade';
import { PointXY, Size } from "@jsplumb/util";
export declare function matchesSelector(el: jsPlumbDOMElement, selector: string, ctx?: Element): boolean;
export declare function consume(e: Event, doNotPreventDefault?: boolean): void;
export declare function findParent(el: jsPlumbDOMElement, selector: string, container: HTMLElement, matchOnElementAlso: boolean): jsPlumbDOMElement;
export declare function getEventSource(e: Event): jsPlumbDOMElement;
export declare function isNodeList(el: any): el is NodeListOf<Element>;
export declare function isArrayLike(el: any): el is ArrayLike<Element>;
export declare function getClass(el: Element): string;
export declare function addClass(el: Element | NodeListOf<Element>, clazz: string): void;
export declare function hasClass(el: Element, clazz: string): boolean;
export declare function removeClass(el: Element | NodeListOf<Element>, clazz: string): void;
export declare function toggleClass(el: Element | NodeListOf<Element>, clazz: string): void;
export declare function createElement(tag: string, style?: Record<string, any>, clazz?: string, atts?: Record<string, string>): jsPlumbDOMElement;
export declare function createElementNS(ns: string, tag: string, style?: Record<string, any>, clazz?: string, atts?: Record<string, string | number>): jsPlumbDOMElement;
export declare function offsetRelativeToRoot(el: Element): PointXY;
export declare function size(el: Element): Size;
//# sourceMappingURL=browser-util.d.ts.map