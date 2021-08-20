/**
 * This package is a renderer for the jsPlumb Community edition that uses a single SVG element per connection, and can
 * connect HTML/SVG elements in the DOM.  For users of version of jsPlumb prior to 5.x, this package is the equivalent to
 * what used to just be known as "jsPlumb".
 *
 * In actual fact only this renderer exists for the 5.x Community edition, but the code in 5.x is now architected in such a way
 * that alternative renderers could be implemented.
 *
 * @packageDocumentation
 */
import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from "./browser-jsplumb-instance";
export * from './constants';
export * from './browser-jsplumb-instance';
export * from './collicat';
export { EVENT_DRAG_START, EVENT_DRAG_MOVE, EVENT_DRAG_STOP, EVENT_CONNECTION_DRAG, EVENT_CONNECTION_ABORT } from './constants';
export { EventManager, pageLocation, touches, touchCount, getTouch } from './event-manager';
export * from "./browser-util";
export * from './element-facade';
export * from './element-drag-handler';
export declare function newInstance(defaults?: BrowserJsPlumbDefaults): BrowserJsPlumbInstance;
export declare function ready(f: Function): void;
//# sourceMappingURL=index.d.ts.map