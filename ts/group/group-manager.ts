import {jsPlumbInstance} from "../core";
import {Group} from "./group";
export class GroupManager<E> {

    groups:Array<Group<E>> = [];

    constructor(public instance:jsPlumbInstance<E>) {

    }

    addToGroup(targetGroup:Group<E>, el:E, aBoolean?:boolean) {

    }

}