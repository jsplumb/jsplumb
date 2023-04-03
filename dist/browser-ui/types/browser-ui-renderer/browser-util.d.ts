import { jsPlumbDOMElement } from './element-facade';
import { BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
import { PointXY, Size } from "../util/util";
export declare function matchesSelector(el: jsPlumbDOMElement, selector: string, ctx?: Element): boolean;
/**
 * Consume the given event, using `stopPropagation()` if present or `returnValue` if not, and optionally
 * also calling `preventDefault()`.
 * @param e
 * @param doNotPreventDefault
 */
export declare function consume(e: Event, doNotPreventDefault?: boolean): void;
export declare function findParent(el: jsPlumbDOMElement, selector: string, container: Element, matchOnElementAlso: boolean): jsPlumbDOMElement;
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
/**
 * Gets the position of the given element relative to the browser viewport's origin. This method is safe for
 * both HTML and SVG elements.
 * @param el
 * @internal
 */
export declare function offsetRelativeToRoot(el: Element): PointXY;
/**
 * Gets the offset width and offset height of the given element. Not safe for SVG elements. This method was previously
 * exported as `size` but has been renamed in order to reflect the fact that it uses offsetWidth and offsetHeight,
 * which are not set on SVG elements.
 * @param el
 * @public
 */
export declare function offsetSize(el: Element): Size;
export declare function svgWidthHeightSize(el: Element): Size;
export declare function svgXYPosition(el: Element): PointXY;
/**
 * Gets the position of this element with respect to the container's origin, in container coordinates.
 *
 * Previously, drag handlers would use getOffset method from the underlying instance but as part of updating the code
 * to support dragging SVG elements this method, using getBoundingClientRect, has been introduced. Ideally this
 * method would be what all the positioning code uses, but there are a few edge cases, particularly
 * involving scrolling, that need to be investigated.
 *
 * Note that we divide the position coords by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 *
 * Note also that currently this method fails when an element is rotated, as getBoundingClientRect() returns the
 * rotated bounds. In fact "fails" is perhaps not precise: it fails at behaving the way the previous getOffset method
 * worked, but depending on the use case, it may be desirable to get the rotated bounds. Currently this method is used
 * by endpoint drag code, in which we know the elements are not rotated.
 *
 * @param el
 * @internal
 */
export declare function getElementPosition(el: Element, instance: BrowserJsPlumbInstance): {
    x: number;
    y: number;
};
/**
 * Gets the size of this element, in container coordinates. Note that we divide the size values from
 * getBoundingClientRect by the current zoom, as getBoundingClientRect() returns values that
 * correspond to what the user sees.
 * @param el
 * @internal
 */
export declare function getElementSize(el: Element, instance: BrowserJsPlumbInstance): Size;
export declare enum ElementTypes {
    SVG = "SVG",
    HTML = "HTML"
}
export declare type ElementType = keyof typeof ElementTypes;
export declare function getElementType(el: Element): ElementType;
export declare function isSVGElement(el: Element): boolean;
/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export declare function onDocumentReady(f: Function): void;
//# sourceMappingURL=browser-util.d.ts.map