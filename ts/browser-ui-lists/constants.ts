import {att} from "../core/constants"
import {AnchorLocations} from "../common/anchor"
import {Endpoint} from "../core/endpoint/endpoint"
import {Connection} from "../core/connector/connection-impl"

export enum SupportedEdge {
    top, bottom
}

const DEFAULT_ANCHOR_LOCATIONS:Map<SupportedEdge, [string, string]> = new Map()
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.top, [AnchorLocations.TopRight, AnchorLocations.TopLeft])
DEFAULT_ANCHOR_LOCATIONS.set(SupportedEdge.bottom, [AnchorLocations.BottomRight, AnchorLocations.BottomLeft])

export const DEFAULT_LIST_OPTIONS = {
    deriveAnchor:(edge:SupportedEdge, index:number, ep:Endpoint, conn:Connection) => {
        return DEFAULT_ANCHOR_LOCATIONS.get(edge)[index]
    }
}

export const ATTR_SCROLLABLE_LIST = "jtk-scrollable-list"
export const SELECTOR_SCROLLABLE_LIST = att(ATTR_SCROLLABLE_LIST)
export const EVENT_SCROLL = "scroll"
