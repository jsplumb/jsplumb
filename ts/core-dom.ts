/**
 extra bits of core when running inside the browser
 */

import {JsPlumb} from "./core";

export class JsPlumbDOM extends JsPlumb {

    static  ready(f:Function) {
        let _do = function () {
            if (/complete|loaded|interactive/.test(document.readyState) && typeof(document.body) !== "undefined" && document.body != null) {
                f();
            }
            else {
                setTimeout(_do, 9);
            }
        };

        _do();
    }

}

