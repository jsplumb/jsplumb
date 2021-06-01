export interface ConnectorOptions extends Record<string, any> {
    stub?: number | number[];
    gap?: number;
    cssClass?: string;
    hoverClass?: string;
}
export declare type ConnectorId = string;
export declare type ConnectorWithOptions = {
    type: ConnectorId;
    options: ConnectorOptions;
};
export declare type ConnectorSpec = ConnectorId | ConnectorWithOptions;
export declare type PaintAxis = "y" | "x";
