
export interface ConnectorOptions {
    stub?:number|number[]
    gap?:number
    cssClass?:string
    hoverClass?:string
}
export type ConnectorId = string
export type ConnectorWithOptions = { type:ConnectorId, options:ConnectorOptions}
export type ConnectorSpec = ConnectorId | ConnectorWithOptions
export type PaintAxis = "y" | "x"
