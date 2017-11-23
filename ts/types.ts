import {UIComponent} from "./component/ui-component";
import {merge, populate} from "./util";
/**
 * Created by simon on 19/10/2017.
 */
export class Types {

    static split(t:string):Array<string> {
        return t == null ? null : t.split(" ");
    }

    static map(map:any, obj:any, typeId:string) {
        for (let i in obj) {
            map[i] = typeId;
        }
    }

    static apply<EventType, ElementType>(component:UIComponent<EventType, ElementType>, params:any, doNotRepaint?:Boolean) {
        if (component.getDefaultType) {
            let td = component.getTypeDescriptor(), map = {};
            let defType = component.getDefaultType();
            let o = merge({}, defType);
            Types.map(map, defType, "__default");
            for (let i = 0, j = component._jsPlumb.types.length; i < j; i++) {
                let tid = component._jsPlumb.types[i];
                if (tid !== "__default") {
                    let _t = component.instance.getType(tid, td);
                    if (_t != null) {
                        o = merge(o, _t, [ "cssClass" ]);
                        Types.map(map, _t, tid);
                    }
                }
            }

            if (params) {
                o = populate(o, params, "_");
            }

            component.applyType(o, doNotRepaint, map);
            if (!doNotRepaint) {
                component.repaint();
            }
        }
    }

    static cleanupCss<EventType, ElementType>(component:UIComponent<EventType, ElementType>, typeIndex:number) {
        let typeId = component._jsPlumb.types[typeIndex],
            type = component.instance.getType(typeId, component.getTypeDescriptor());

        if (type != null && type.cssClass && component.canvas) {
            component.instance.removeClass(component.canvas, type.cssClass);

        }
    }
}