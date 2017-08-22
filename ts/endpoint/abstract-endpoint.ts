export abstract class AbstractEndpoint {
    abstract tipe:string;
    abstract _compute (anchorPoint:number[], orientation:string, endpointStyle:any, connectorPaintStyle:any):number[];

    constructor(params:any) {

    }
}