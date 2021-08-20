/**
 * Common options for connectors.
 */
export interface ConnectorOptions extends Record<string, any> {
    /**
     * Stub defines a number of pixels that the connector travels away from its element before the connector's actual path begins.
     */
    stub?:number|number[]
    /**
     * Defines a number of pixels between the end of the connector and its anchor point. Defaults to zero.
     */
    gap?:number
    /**
     * Optional class to set on the element used to render the connector.
     */
    cssClass?:string
    /**
     * Optional class to set on the element used to render the connector when the mouse is hovering over the connector.
     */
    hoverClass?:string
}

/**
 * Alias for the use case that a Connector is referenced just by its `type`.
 */
export type ConnectorId = string
/**
 * Connector spec in the form `{type:.., options:{.. }}`
 */
export type ConnectorWithOptions = { type:ConnectorId, options:ConnectorOptions}
/**
 * Specification of a connector - either the type id of some Connector, a type+options object.
 */
export type ConnectorSpec = ConnectorId | ConnectorWithOptions
/**
 * Used internally by connectors.
 * @internal
 */
export type PaintAxis = "y" | "x"

/**
 * High level definition of a Connector.
 */
export interface Connector {
    /**
     * The connector's type.
     */
    type:string
}

/**
 * Geometry defines the path along which a connector travels. The internal contents of a Geometry vary widely between connectors.
 */
export interface Geometry {
    source:any,
    target:any
}
