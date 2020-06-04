import { AbstractConnector } from "./abstract-connector";
import { Constructable, jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (instance: jsPlumbInstance, connection: Connection, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
