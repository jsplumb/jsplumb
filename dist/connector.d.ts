/**
 * Created by simon on 14/05/2019.
 */
export interface ConnectorOptions {
}
export declare type UserDefinedConnectorId = string;
export declare type ConnectorId = "Bezier" | "StateMachine" | "Flowchart" | "Straight" | UserDefinedConnectorId;
export declare type ConnectorSpec = ConnectorId | [ConnectorId, ConnectorOptions];
