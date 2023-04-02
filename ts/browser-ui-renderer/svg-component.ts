import {extend, Extents} from "../util/util"

import { _attr, _pos, _size  } from './svg-util'
import {BrowserJsPlumbInstance} from "./browser-jsplumb-instance"
import {ElementTypes} from "./browser-util"
import {PaintStyle} from "../common/paint-style"

export class SvgComponent {

    static paint<E>(connector:any, instance:BrowserJsPlumbInstance, paintStyle:PaintStyle, extents?:Extents):void {
        if (paintStyle != null) {

            let xy = [ connector.x, connector.y ],
                wh = [ connector.w, connector.h ]

            if (extents != null) {
                if (extents.xmin < 0) {
                    xy[0] += extents.xmin
                }
                if (extents.ymin < 0) {
                    xy[1] += extents.ymin
                }
                wh[0] = extents.xmax + ((extents.xmin < 0) ? -extents.xmin : 0)
                wh[1] = extents.ymax + ((extents.ymin < 0) ? -extents.ymin : 0)
            }

            if (isFinite(wh[0]) && isFinite(wh[1])) {

                const attrs = {
                    "width": "" + (wh[0] || 0),
                    "height": "" + (wh[1] || 0)
                }

                if (instance.containerType === ElementTypes.HTML) {
                    _attr(connector.canvas, extend(attrs as any,{
                        style:_pos([xy[0], xy[1]])
                    }))
                } else {
                    _attr(connector.canvas, extend(attrs as any,{
                        x:xy[0],
                        y:xy[1]
                    }))
                }
            }
        }
    }
}
