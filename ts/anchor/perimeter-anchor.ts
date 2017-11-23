
import { Anchor } from "./abstract-anchor";
import {JsPlumb} from "../core";
import {Anchors} from "./anchors";

export class PerimeterAnchor<EventType, ElementType> extends Anchor<EventType, ElementType> {
     constructor(params:any) {
         super(params);

         let anchorCount = params.anchorCount || 60,
             shape = params.shape;

         if (!shape) {
             throw new Error("no shape supplied to Perimeter Anchor type");
         }

         let _circle = function () {
                 let r = 0.5, step = Math.PI * 2 / anchorCount, current = 0, a = [];
                 for (let i = 0; i < anchorCount; i++) {
                     let x = r + (r * Math.sin(current)),
                         y = r + (r * Math.cos(current));
                     a.push([x, y, 0, 0]);
                     current += step;
                 }
                 return a;
             },
             _path = function (segments:Array<any>) {
                 let anchorsPerFace = anchorCount / segments.length, a:Array<any> = [],
                     _computeFace = function (x1:number, y1:number, x2:number, y2:number, fractionalLength:number) {
                         anchorsPerFace = anchorCount * fractionalLength;
                         let dx = (x2 - x1) / anchorsPerFace, dy = (y2 - y1) / anchorsPerFace;
                         for (let i = 0; i < anchorsPerFace; i++) {
                             a.push([
                                 x1 + (dx * i),
                                 y1 + (dy * i),
                                 0,
                                 0
                             ]);
                         }
                     };

                 for (let i = 0; i < segments.length; i++) {
                     _computeFace.apply(null, segments[i]);
                 }

                 return a;
             },
             _shape = function (faces:Array<any>) {
                 let s = [];
                 for (let i = 0; i < faces.length; i++) {
                     s.push([faces[i][0], faces[i][1], faces[i][2], faces[i][3], 1 / faces.length]);
                 }
                 return _path(s);
             },
             _rectangle = function () {
                 return _shape([
                     [0, 0, 1, 0],
                     [1, 0, 1, 1],
                     [1, 1, 0, 1],
                     [0, 1, 0, 0]
                 ]);
             };

         let _shapes = {
                 "Circle": _circle,
                 "Ellipse": _circle,
                 "Diamond": function () {
                     return _shape([
                         [0.5, 0, 1, 0.5],
                         [1, 0.5, 0.5, 1],
                         [0.5, 1, 0, 0.5],
                         [0, 0.5, 0.5, 0]
                     ]);
                 },
                 "Rectangle": _rectangle,
                 "Square": _rectangle,
                 "Triangle": function () {
                     return _shape([
                         [0.5, 0, 1, 1],
                         [1, 1, 0, 1],
                         [0, 1, 0.5, 0]
                     ]);
                 },
                 "Path": function (params:any) {
                     let points = params.points, p = [], tl = 0;
                     for (let i = 0; i < points.length - 1; i++) {
                         let l = Math.sqrt(Math.pow(points[i][2] - points[i][0], 2) + Math.pow(points[i][3] - points[i][1], 2));
                         tl += l;
                         p.push([points[i][0], points[i][1], points[i + 1][0], points[i + 1][1], l]);
                     }
                     for (let j = 0; j < p.length; j++) {
                         p[j][4] = p[j][4] / tl;
                     }
                     return _path(p);
                 }
             },
             _rotate = function (points:Array<any>, amountInDegrees:number) {
                 let o = [], theta = amountInDegrees / 180 * Math.PI;
                 for (let i = 0; i < points.length; i++) {
                     let _x = points[i][0] - 0.5,
                         _y = points[i][1] - 0.5;

                     o.push([
                         0.5 + ((_x * Math.cos(theta)) - (_y * Math.sin(theta))),
                         0.5 + ((_x * Math.sin(theta)) + (_y * Math.cos(theta))),
                         points[i][2],
                         points[i][3]
                     ]);
                 }
                 return o;
             };

         if (!_shapes[shape]) {
             throw new Error("Shape [" + shape + "] is unknown by Perimeter Anchor type");
         }

         let da = _shapes[shape](params);
         if (params.rotation) {
             da = _rotate(da, params.rotation);
         }
         let a = params.jsPlumbInstance.makeDynamicAnchor(da);
         a.type = "Perimeter";
         return a;
     }
}

Anchors.map["Perimeter"] = PerimeterAnchor;