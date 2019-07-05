export interface GroupOptions {
    droppable?:boolean;
    enabled?:boolean;
    orphan?:boolean;
    constrain?:boolean;

}

export class Group<E> {

    children:Array<E> = [];

    el:E;

    droppable:boolean;
    enabled:boolean;
    orphan:boolean;
    constrain:boolean;

    constructor(el:E, options:GroupOptions) {
        this.el = el;
        this.droppable = options.droppable !== false;
        this.enabled = options.enabled !== false;
        this.orphan = options.orphan !== false;
        this.constrain = options.constrain !== false;


    }

    overrideDrop(el:E, targetGroup:Group<E>):boolean {
        return false;
    }



}
