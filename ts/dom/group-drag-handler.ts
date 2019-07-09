import {DragHandler} from "./drag-manager";
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance";

export class GroupDragHandler implements DragHandler {

    selector: string = "> [jtk-group] [jtk-managed]";

    constructor(protected instance:BrowserJsPlumbInstance) {

    }

    onBeforeStart(beforeStartParams: any):void {
        console.log("on before start");
    }

    onDrag(params: any) {
        console.log("on drag");
    }

    onStart(params: any) {
        console.log("on start");
        return true;
    }

    onStop(params: any) {
        console.log("on stop");
    }

}