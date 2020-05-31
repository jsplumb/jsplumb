import { AbstractConnector } from "./abstract-connector";
import { Constructable, jsPlumbInstance } from "../core";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (instance: jsPlumbInstance<any>, connection: Connection<any>, name: string, params: any) => AbstractConnector<any>;
    register: (name: string, conn: Constructable<AbstractConnector<any>>) => void;
};
