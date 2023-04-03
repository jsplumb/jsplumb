import { BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from './browser-ui-renderer';
export * from './browser-ui-renderer';
export * from './browser-ui-lists';
export * from './common';
export * from './connector-bezier';
export * from './connector-flowchart';
export * from './core';
export * from './test';
export * from './util';
/**
 * Create a new BrowserJsPlumbInstance, optionally with the given defaults.
 * @param defaults
 * @public
 */
export declare function newInstance(defaults?: BrowserJsPlumbDefaults): BrowserJsPlumbInstance;
/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export declare function ready(f: Function): void;
//# sourceMappingURL=index.d.ts.map