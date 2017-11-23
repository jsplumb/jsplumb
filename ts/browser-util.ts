
/*
 * Function: sizeElement
 * Helper to size and position an element. You would typically use
 * this when writing your own Connector or Endpoint implementation.
 *
 * Parameters:
 *  x - [int] x position for the element origin
 *  y - [int] y position for the element origin
 *  w - [int] width of the element
 *  h - [int] height of the element
 *
 */
import {RawElement} from "./dom/dom-adapter";
export function sizeElement (el:RawElement, x:number, y:number, w:number, h:number) {
    if (el) {
        el.style.height = h + "px";
        el.height = h;
        el.style.width = w + "px";
        el.width = w;
        el.style.left = x + "px";
        el.style.top = y + "px";
    }
}