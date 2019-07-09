import {ElementDragHandler} from "./element-drag-handler";

export class GroupDragHandler extends ElementDragHandler {

    selector: string = "> [jtk-group] [jtk-managed]";


    // onBeforeStart(beforeStartParams: any):void {
    //     console.log("on before start, inside group");
    // }
    //
    onDrag(params: any) {
        console.log("on drag, inside a group");
        super.onDrag(params);
    }
    //
    // onStart(params: any) {
    //     console.log("on start, inside group. could have a group lock function and return false from here");
    //     return true;
    // }
    //
    onStop(params: any) {
        console.log("on stop, inside a group. here we should test for orphan, prune etc");
        super.onStop(params);
    }

}