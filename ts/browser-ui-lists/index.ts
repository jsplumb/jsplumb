import {BrowserJsPlumbInstance} from "@jsplumb/browser-ui"
import {ListManagerOptions, JsPlumbListManager} from "./lists"

export * from './constants'
export * from './lists'

export function newInstance(instance:BrowserJsPlumbInstance, params?:ListManagerOptions) {
    return new JsPlumbListManager(instance, params)
}
