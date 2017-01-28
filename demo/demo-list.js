//
// this file is just used to automate the process of adding links to the individual demos to their previous/next
// demo.  you don't need to concern yourself with what's going on in here.
//
;
(function () {
    var list = [
        [ "flowchart", "Flowchart" ],
        [ "statemachine", "State Machine" ],
        [ "draggableConnectors", "Drag and Drop"],
        [ "perimeterAnchors", "Perimeter Anchors"],
        [ "chart", "Hierarchical Chart" ],
        [ "sourcesAndTargets", "Sources and Targets" ],
        [ "dynamicAnchors", "Dynamic Anchors" ],
        [ "animation", "Animation" ],
        [ "groups", "Groups" ]
    ];

    jsPlumb.bind("ready", function () {
        var current = document.body.getAttribute("data-demo-id");

        if (current) {
            var idx = jsPlumbUtil.findWithFunction(list, function (i) {
                    return i[0] == current;
                }),
                prev = idx == 0 ? list.length - 1 : idx - 1,
                next = idx == list.length - 1 ? 0 : idx + 1,
                _d = function (tag, clazz, parent, html, atts, atStart) {
                    var d = document.createElement(tag);
                    d.className = clazz;
                    if (parent) {
                        if (atStart && parent.childNodes.length > 0)
                            parent.insertBefore(d, parent.firstChild);
                        else
                            parent.appendChild(d);
                    }
                    if (html) d.innerHTML = html;
                    if (atts) {
                        for (var i in atts)
                            d.setAttribute(i, atts[i]);
                    }
                    return d;
                };

            // next/previous links
            var d = _d("div", "demo-links", document.body),
                dp = _d("div", "", d, "<a href='../" + list[prev][0] + "/dom.html'>" + list[prev][1] + "<i class='fa fa-arrow-left'></i></a>"),
                dc = _d("div", "current-library", d, list[idx][1]),
                dn = _d("div", "", d, "<a href='../" + list[next][0] + "/dom.html'><i class='fa fa-arrow-right'></i>" + list[next][1] + "</a>");

            // make a drop down.
            var m = document.querySelectorAll(".menu")[0],
                sel = _d("select", "", m, null, null, true);
            for (var i = 0; i < list.length; i++) {
                var opts = {"data-href": "../" + list[i][0] + "/dom.html"};
                if (list[i][0] == current)
                    opts["selected"] = true;
                _d("option", "", sel, list[i][1], opts, null);
            }
            jsPlumb.on(sel, "change", function () {
                document.location = sel.options[sel.selectedIndex].getAttribute("data-href");
            });
            sel.style.marginRight = "20px";

        }

    });
})();