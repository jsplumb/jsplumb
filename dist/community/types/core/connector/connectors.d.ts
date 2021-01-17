import { AbstractConnector } from "./abstract-connector";
import { Constructable } from "../common";
import { JsPlumbInstance } from "..";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (instance: JsPlumbInstance, connection: Connection, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
