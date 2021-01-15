import { jsPlumbDOMElement } from "./browser-jsplumb-instance";
import { Dictionary, Offset } from '../core/common';
export declare function matchesSelector(el: HTMLElement, selector: string, ctx?: HTMLElement): boolean;
export declare function consume(e: Event, doNotPreventDefault?: boolean): void;
export declare function sizeElement(el: HTMLElement, x: number, y: number, w: number, h: number): void;
export declare function findParent(el: HTMLElement, selector: string, container: HTMLElement): jsPlumbDOMElement;
export declare function getEventSource(e: Event): jsPlumbDOMElement;
export declare function getClass(el: HTMLElement): string;
export declare function addClass(el: HTMLElement, clazz: string): void;
export declare function hasClass(el: HTMLElement, clazz: string): boolean;
export declare function removeClass(el: HTMLElement, clazz: string): void;
export declare function toggleClass(el: HTMLElement, clazz: string): void;
export declare function createElement(tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string>): jsPlumbDOMElement;
export declare function createElementNS(ns: string, tag: string, style?: Dictionary<any>, clazz?: string, atts?: Dictionary<string | number>): jsPlumbDOMElement;
export declare function offsetRelativeToRoot(el: any): Offset;
