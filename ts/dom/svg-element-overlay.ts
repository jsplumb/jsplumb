import {_appendAtIndex, _attr, _node, Connection, Endpoint, SvgEndpoint} from "..";
import {SvgElementConnector} from "./svg-element-connector";

export abstract class SVGElementOverlay {

    static ensurePath(o:any):HTMLElement {
        if (o.path == null) {
            o.path = _node(o.instance, "path", {});
            let parent:SVGElement = null;

            if (o.component instanceof Connection) {
                let connector = (o.component as Connection<HTMLElement>).getConnector();// as SvgElementConnector;
                parent = (connector as any).canvas;
            } else if (o.component instanceof Endpoint) {
                let endpoint = (o.component as Endpoint<HTMLElement>).endpoint;//.renderer as SvgEndpoint<HTMLElement>;
                parent = (endpoint as any).svg;
            }

            if (parent != null) {
                _appendAtIndex(parent, o.path, 1);//params.paintStyle.outlineStroke ? 1 : 0);
            }

            o.instance.addClass(<any>o.path, o.instance.overlayClass);

            (<any>o.path).jtk = { overlay:o };
        }

        return o.path;
    }

    static paint(o:any, path:string, params:any, extents:any):void {

        this.ensurePath(o);

        let offset = [0, 0];

        if (extents.xmin < 0) {
            offset[0] = -extents.xmin;
        }
        if (extents.ymin < 0) {
            offset[1] = -extents.ymin;
        }

        let a = {
            "d": path,//this.makePath(params.d),
            stroke: params.stroke ? params.stroke : null,
            fill: params.fill ? params.fill : null,
            transform: "translate(" + offset[0] + "," + offset[1] + ")",
            "pointer-events": "visibleStroke"
        };

        _attr(o.path, a);
    }

    static destroy(o:any, force?:boolean) {

        if (o.path != null) {
            o.path.parentNode.removeChild(o.path);
        }

        if (o.bgPath != null) {
            o.bgPath.parentNode.removeChild(o.bgPath);
        }

        delete o.path;
        delete o.bgPath;


    }
}

