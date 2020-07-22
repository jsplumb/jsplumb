import {Dictionary, jsPlumbInstance, Offset} from "../core";
import {AnchorSpec, Connection, EndpointSpec, GroupManager, log, removeWithFunction, uuid} from "..";
import * as Constants from "../constants";

export interface GroupOptions {
    id?:string;
    droppable?:boolean;
    enabled?:boolean;
    orphan?:boolean;
    constrain?:boolean;
    proxied?:boolean;
    ghost?:boolean;
    revert?:boolean;
    prune?:boolean;
    dropOverride?:boolean;
    anchor?:AnchorSpec;
    endpoint?:EndpointSpec;
}

export class UINode {
    group:UIGroup;
    constructor(public instance:jsPlumbInstance, public el:any) { }
}

export class UIGroup extends UINode {

    children:Array<any> = [];
    childGroups:Array<UIGroup> = [];

    collapsed:boolean = false;

    droppable:boolean;
    enabled:boolean;
    orphan:boolean;
    constrain:boolean;
    proxied:boolean;
    ghost:boolean;
    revert:boolean;
    prune:boolean;
    dropOverride:boolean;
    anchor:AnchorSpec;
    endpoint:EndpointSpec;

    connections:{source:Array<Connection>, target:Array<Connection>, internal:Array<Connection>} = {source:[], target:[], internal:[]};
    groups:Array<UIGroup> = [];

    manager:GroupManager;

    id:string;

    constructor(public instance:jsPlumbInstance, el:any, options:GroupOptions) {
        super(instance, el);
        this.el[Constants.IS_GROUP_KEY] = true;
        this.el[Constants.GROUP_KEY] = this;
        this.revert = options.revert !== false;
        this.droppable = options.droppable !== false;
        this.ghost = options.ghost === true;
        this.enabled = options.enabled !== false;
        this.orphan = options.orphan === true;
        this.prune = options.prune === true;
        this.constrain = this.ghost || (options.constrain === true);
        this.proxied = options.proxied !== false;
        this.id = options.id || uuid();
        this.dropOverride = options.dropOverride === true;
        this.anchor = options.anchor;
        this.endpoint = options.endpoint;
        this.anchor = options.anchor;

        instance.setAttribute(el, Constants.ATTRIBUTE_GROUP, "");
    }

    overrideDrop(el:any, targetGroup:UIGroup):boolean {
        return this.dropOverride && (this.revert || this.prune || this.orphan);
    }

    getDragArea():any {
        let da = this.instance.getSelector(this.el, Constants.SELECTOR_GROUP_CONTAINER);
        return da && da.length > 0 ? da[0] : this.el;
    };

    // this function, and getEndpoint below, are stubs for a future setup in which we can choose endpoint
    // and anchor based upon the connection and the index (source/target) of the endpoint to be proxied.
    getAnchor (conn:Connection, endpointIndex:number) {
        return this.anchor || "Continuous";
    };

    getEndpoint (conn:Connection, endpointIndex:number) {
        return this.endpoint || [ "Dot", { radius:10 }];
    }

    add(_el:any, doNotFireEvent?:boolean) {
        const dragArea = this.getDragArea();
        this.instance.each(_el, (__el:any) => {

            if (__el[Constants.GROUP_KEY] != null) {
                if (__el[Constants.GROUP_KEY] === this) {
                    return;
                } else {
                    __el[Constants.GROUP_KEY].remove(__el, true, doNotFireEvent, false);
                }
            }

            __el[Constants.GROUP_KEY] = this;
            this.children.push(__el);
            this.manager.instance.appendElement(__el, dragArea);
        });

        this.manager._updateConnectionsForGroup(this);
    }

    remove (el:any | Array<any>, manipulateDOM?:boolean, doNotFireEvent?:boolean, doNotUpdateConnections?:boolean, targetGroup?:UIGroup) {

        this.instance.each(el, (__el:any) => {
            delete __el[Constants.GROUP_KEY];
            removeWithFunction(this.children, (e:any) => {
                return e === __el;
            });

            if (manipulateDOM) {
                try { (<any>this.getDragArea()).removeChild(__el); }
                catch (e) {
                    log("Could not remove element from Group " + e);
                }
            }
            if (!doNotFireEvent) {
                const p = {group: this, el: __el};
                if (targetGroup) {
                    (<any>p).targetGroup = targetGroup;
                }
                this.manager.instance.fire(Constants.EVENT_CHILD_REMOVED, p);
            }
        });
        if (!doNotUpdateConnections) {
            this.manager._updateConnectionsForGroup(this);
        }
    }

    removeAll(manipulateDOM?:boolean, doNotFireEvent?:boolean):void {
        for (let i = 0, l = this.children.length; i < l; i++) {
            let el = this.children[0];
            this.remove(el, manipulateDOM, doNotFireEvent, true);
            this.manager.instance.remove(el, true);
        }
        this.children.length = 0;
        this.manager._updateConnectionsForGroup(this);
    }

    private _orphan(_el:any):[string, Offset] {
        const id = this.manager.instance.getId(_el);
        let pos = this.manager.instance.getOffset(_el);
        (<any>_el).parentNode.removeChild(_el);

        this.instance.appendElement(_el, this.instance.getContainer()); // set back as child of container

        this.instance.setPosition(_el, pos);
        delete _el[Constants.GROUP_KEY];
        return [id, pos];
    }

    orphanAll ():Dictionary<Offset> {
        let orphanedPositions:Dictionary<Offset> = {};
        for (let i = 0; i < this.children.length; i++) {
            let newPosition = this._orphan(this.children[i]);
            orphanedPositions[newPosition[0]] = newPosition[1];
        }
        this.children.length = 0;

        return orphanedPositions;
    }

    addGroup(group:UIGroup):void {

        const elpos = this.instance.getOffset(group.el, true);
        const cpos = this.collapsed ? this.instance.getOffset(this.el, true) : this.instance.getOffset(this.getDragArea(), true);

        this.childGroups.push(group);
        this.instance.appendElement(group.el, this.getDragArea());
        group.group = this;
        let newPosition = { left: elpos.left - cpos.left, top: elpos.top - cpos.top };

        this.instance.setPosition(group.el, newPosition);

    }

    getGroups():Array<UIGroup> {
        return this.childGroups;
    }

    get collapseParent():UIGroup {
        let cg:UIGroup = null;
        if (this.group == null) {
            return null;
        } else {
            let g = this.group;
            while(g != null) {
                if (g.collapsed) {
                    cg = g;
                }
                g = g.group;
            }
            return cg;
        }
    }

}
