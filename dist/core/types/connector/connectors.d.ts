import { AbstractConnector } from "./abstract-connector";
import { Constructable } from "../common";
import { JsPlumbInstance } from "..";
import { Connection } from "./connection-impl";
export declare const Connectors: {
    get: (instance: JsPlumbInstance<any>, connection: Connection<any>, name: string, params: any) => AbstractConnector;
    register: (name: string, conn: Constructable<AbstractConnector>) => void;
};
