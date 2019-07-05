/**
 * Created by simon on 14/05/2019.
 */
export  interface ConnectorOptions { }
export type UserDefinedConnectorId = string;
export type ConnectorId = "Bezier" | "StateMachine" | "Flowchart" | "Straight" | UserDefinedConnectorId;
export type ConnectorSpec = ConnectorId | [ConnectorId, ConnectorOptions];