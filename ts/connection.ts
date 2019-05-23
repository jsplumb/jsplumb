import {Overlay} from "./overlay";
import {Endpoint} from "./endpoint/endpoint-impl";
import {OffsetAndSize, Size} from "./core";
import {ComponentConfig} from "./component/component";

export type ConnectionId = string;

// export interface Connection<E> {
//     id: ConnectionId;
//     setDetachable(detachable: boolean): void;
//     setParameter(name: string, value: any): void;
//     endpoints: [Endpoint<E>, Endpoint<E>];
//     getOverlay(s: string): Overlay<E>;
//     showOverlay(s: string): void;
//     hideOverlay(s: string): void;
//     setLabel(s: string): void;
//    // getElement(): Connection<E>;
//     repaint():void;
//     scope:string;
//     sourceId:string;
//     source:E;
//     targetId:string;
//     target:E;
//     proxies?:Array<ProxyConnection<E>>;
//     pending?:boolean;
//
//     _jsPlumb:ComponentConfig<E>;
//
//     // TODO move to common
//     cleanup(force?:boolean):void;
//     destroy(force?:boolean):void;
//     setHover(h:boolean, ):void;
//     moveParent(newParent:E):void;
//
//     paint(params:{ timestamp?: string, offset?: OffsetAndSize, dimensions?: Size, recalc?:boolean, elId?:string }):void;
//
//     setVisible(v:boolean):void;
//     isVisible():boolean;
// }

export interface ProxyConnection<E>{//} extends Connection<E> {
    originalEp:Endpoint<E>;
}