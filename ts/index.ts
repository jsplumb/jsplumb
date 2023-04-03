import {BrowserJsPlumbDefaults, BrowserJsPlumbInstance } from './browser-ui-renderer'

export * from './browser-ui-renderer'
export * from './browser-ui-lists'
export * from './common'
export * from './connector-bezier'
export * from './connector-flowchart'
export * from './core'
export * from './test'
export * from './util'


let _jsPlumbInstanceIndex = 0
function getInstanceIndex ():number {
    let i = _jsPlumbInstanceIndex + 1
    _jsPlumbInstanceIndex++
    return i
}

/**
 * Create a new BrowserJsPlumbInstance, optionally with the given defaults.
 * @param defaults
 * @public
 */
export function newInstance(defaults?:BrowserJsPlumbDefaults): BrowserJsPlumbInstance {
    return new BrowserJsPlumbInstance(getInstanceIndex(), defaults)
}

/**
 * Execute the given function when the DOM is ready, or if the DOM is already ready, execute the given function immediately.
 * @param f
 * @public
 */
export function ready(f:Function) {
    const _do = function () {
        if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
            f()
        }
        else {
            setTimeout(_do, 9)
        }
    }

    _do()
}
