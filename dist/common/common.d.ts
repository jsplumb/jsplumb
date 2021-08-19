import { BoundingBox } from '@jsplumb/util';
import { Component } from '@jsplumb/core';
import { Dictionary } from '@jsplumb/util';
import { Extents } from '@jsplumb/util';
import { PointXY } from '@jsplumb/util';

export declare abstract class AbstractSegment implements Segment {
    protected params: SegmentParams;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    extents: Extents;
    abstract type: string;
    abstract getLength(): number;
    abstract pointOnPath(location: number, absolute?: boolean): PointXY;
    abstract gradientAtPoint(location: number, absolute?: boolean): number;
    abstract pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    abstract getPath(isFirstSegment: boolean): string;
    constructor(params: SegmentParams);
    /**
     * Function: findClosestPointOnPath
     * Finds the closest point on this segment to the given [x, y],
     * returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the
     * path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else
     * subclasses are expected to override.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    /**
     * Computes the list of points on the segment that intersect the given line.
     * @method lineIntersection
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @returns {Array<PointXY>}
     */
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @method boxIntersection
     * @param {number} x
     * @param {number} y
     * @param {number} w
     * @param {number} h
     * @returns {Array<PointXY>}
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the given bounding box, which is an object of the form { x:.., y:.., w:.., h:.. }.
     * @method lineIntersection
     * @param {BoundingBox} box
     * @returns {Array<[number, number]>}
     */
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
}

export declare type AnchorId = keyof typeof AnchorLocations;

export declare enum AnchorLocations {
    Assign = "Assign",
    AutoDefault = "AutoDefault",
    Bottom = "Bottom",
    BottomLeft = "BottomLeft",
    BottomRight = "BottomRight",
    Center = "Center",
    Continuous = "Continuous",
    ContinuousBottom = "ContinuousBottom",
    ContinuousLeft = "ContinuousLeft",
    ContinuousRight = "ContinuousRight",
    ContinuousTop = "ContinuousTop",
    ContinuousLeftRight = "ContinuousLeftRight",
    ContinuousTopBottom = "ContinuousTopBottom",
    Left = "Left",
    Perimeter = "Perimeter",
    Right = "Right",
    Top = "Top",
    TopLeft = "TopLeft",
    TopRight = "TopRight"
}

export declare interface AnchorOptions extends Record<string, any> {
    cssClass?: string;
}

export declare type AnchorPlacement = {
    curX: number;
    curY: number;
    x: number;
    y: number;
    ox: number;
    oy: number;
};

export declare type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>;

export declare interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}

export declare interface BlankEndpointParams extends EndpointRepresentationParams {
}

export declare interface Connector {
    type: string;
}

export declare type ConnectorId = string;

export declare interface ConnectorOptions extends Record<string, any> {
    stub?: number | number[];
    gap?: number;
    cssClass?: string;
    hoverClass?: string;
}

export declare type ConnectorSpec = ConnectorId | ConnectorWithOptions;

export declare type ConnectorWithOptions = {
    type: ConnectorId;
    options: ConnectorOptions;
};

export declare interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}

export declare const DEFAULT = "default";

export declare interface DotEndpointParams extends EndpointRepresentationParams {
    radius?: number;
}

export declare function EMPTY_BOUNDS(): Extents;

export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;

export declare type EndpointParams = any;

export declare interface EndpointRepresentationParams {
    cssClass?: string;
}

export declare type EndpointSpec = EndpointId | FullEndpointSpec;

export declare interface EndpointStyle extends PaintStyle, Record<string, any> {
}

export declare const FALSE = "false";

export declare type FullAnchorSpec = {
    type: AnchorId;
    options: AnchorOptions;
};

export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};

export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};

export declare interface Geometry {
    source: any;
    target: any;
}

export declare interface LabelOverlayOptions extends OverlayOptions {
    label: string | Function;
    labelLocationAttribute?: string;
}

export declare interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Dictionary<(value: any, event?: any) => any>;
}

export declare type OverlaySpec = string | FullOverlaySpec;

export declare type PaintAxis = "y" | "x";

export declare interface PaintStyle {
    stroke?: string;
    fill?: string;
    strokeWidth?: number;
    outlineStroke?: string;
    outlineWidth?: number;
    dashstyle?: string;
}

/**
 * Constructor options for a Perimeter Anchor.
 */
export declare interface PerimeterAnchorOptions extends AnchorOptions {
    shape: string;
    rotation?: number;
    anchorCount?: number;
}

export declare type PointNearPath = {
    s?: Segment;
    d: number;
    x: number;
    y: number;
    l: number;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
};

export declare interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?: number;
    height?: number;
}

export declare interface Segment {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    type: string;
    extents: Extents;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
    getLength(): number;
    pointOnPath(location: number, absolute?: boolean): PointXY;
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    getPath(isFirstSegment: boolean): string;
}

export declare interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

export declare type SingleAnchorSpec = AnchorId | FullAnchorSpec | AnchorPlacement | Array<AnchorPlacement>;

export declare const TRUE = "true";

export declare const UNDEFINED = "undefined";

export declare type UserDefinedEndpointId = string;

export declare const WILDCARD = "*";

export { }
