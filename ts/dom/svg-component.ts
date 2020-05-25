
import {_attr, _pos} from "../svg/svg-util";
import {PaintStyle} from "../styles";
import {sizeElement} from "../browser-util";

export class SvgComponent {

    static paint<E>(connector:any, useDivWrapper:boolean, paintStyle:PaintStyle, extents?:any):void {
        if (paintStyle != null) {

            let xy = [ connector.x, connector.y ],
                wh = [ connector.w, connector.h ], p;

            if (extents != null) {
                if (extents.xmin < 0) {
                    xy[0] += extents.xmin;
                }
                if (extents.ymin < 0) {
                    xy[1] += extents.ymin;
                }
                wh[0] = extents.xmax + ((extents.xmin < 0) ? -extents.xmin : 0);
                wh[1] = extents.ymax + ((extents.ymin < 0) ? -extents.ymin : 0);
            }

            if (useDivWrapper) {
                sizeElement((connector as any).canvas, xy[0], xy[1], wh[0], wh[1]);
                xy[0] = 0;
                xy[1] = 0;
                p = _pos([ 0, 0 ]);

                _attr(connector.svg, {
                    "style": p,
                    "width": "" + (wh[0] || 0),
                    "height": "" + (wh[1] || 0)
                });
            }
            else {
                p = _pos([ xy[0], xy[1] ]);
                _attr(connector.canvas, {
                    "style": p,
                    "width": "" + (wh[0] || 0),
                    "height": "" + (wh[1] || 0)
                });
            }
        }
    }
}
