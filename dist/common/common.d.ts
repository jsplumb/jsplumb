/**
 * This package contains common declarations and definitions for use by both jsPlumb Community and Toolkit editions.
 *
 * @packageDocumentation
 */

import { BoundingBox } from '@jsplumb/util';
import { Component } from '@jsplumb/core';
import { Extents } from '@jsplumb/util';
import { PointXY } from '@jsplumb/util';

/**
 * Base class for segments in connectors.
 *
 * @internal
 */
export declare abstract class AbstractSegment implements Segment {
    protected params: SegmentParams;
    x1: number;
    x2: number;
    y1: number;
    y2: number;
    extents: Extents;
    abstract type: string;
    /**
     * Abstract method that subclasses are required to implement. Returns the length of the segment.
     */
    abstract getLength(): number;
    abstract pointOnPath(location: number, absolute?: boolean): PointXY;
    abstract gradientAtPoint(location: number, absolute?: boolean): number;
    abstract pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    abstract getPath(isFirstSegment: boolean): string;
    constructor(params: SegmentParams);
    /**
     * Finds the closest point on this segment to the given x/y, returning both the x and y of the point plus its distance from
     * the supplied point, and its location along the length of the path inscribed by the segment.  This implementation returns
     * Infinity for distance and null values for everything else subclasses are expected to override.
     * @param x - X location to find closest point to
     * @param y - Y location to find closest point to
     * @returns a `PointNearPath` object, which contains the location of the closest point plus other useful information.
     */
    findClosestPointOnPath(x: number, y: number): PointNearPath;
    /**
     * Computes the list of points on the segment that intersect the given line.
     * @param x1 - X location of point 1
     * @param y1 - Y location of point 1
     * @param x2 - X location of point 2
     * @param y2 - Y location of point 2
     * @returns A list of intersecting points
     */
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the box with the given origin and size.
     * @param x - x origin of the box
     * @param y - y origin of the box
     * @param w - width of the box
     * @param h - height of the box
     * @returns A list of intersecting points
     */
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    /**
     * Computes the list of points on the segment that intersect the given bounding box.
     * @param box - Box to test for intersections.
     * @returns A list of intersecting points
     */
    boundingBoxIntersection(box: BoundingBox): Array<PointXY>;
}

/**
 * List of entries in the AnchorLocations enum
 * @public
 */
export declare type AnchorId = keyof typeof AnchorLocations;

/**
 * Default anchor locations.
 * @public
 */
export declare enum AnchorLocations {
    Assign = "Assign",
    /**
     * Chooses from Top, Left, Bottom or Right, depending on which is closest to the anchor at the other end of the connection.
     */
    AutoDefault = "AutoDefault",
    /**
     * Bottom middle of the element.
     */
    Bottom = "Bottom",
    /**
     * Bottom left corner of the element.
     */
    BottomLeft = "BottomLeft",
    /**
     * Bottom right corner of the element.
     */
    BottomRight = "BottomRight",
    /**
     * Center of the element.
     */
    Center = "Center",
    /**
     * Assigns a separate anchor point for each endpoint, choosing whichever face is closest to the element at the other end of each connection.
     */
    Continuous = "Continuous",
    /**
     * As with Continuous, but only use the bottom face.
     */
    ContinuousBottom = "ContinuousBottom",
    /**
     * As with Continuous, but only use the left face.
     */
    ContinuousLeft = "ContinuousLeft",
    /**
     * As with Continuous, but only use the right face.
     */
    ContinuousRight = "ContinuousRight",
    /**
     * As with Continuous, but only use the top face.
     */
    ContinuousTop = "ContinuousTop",
    /**
     * As with Continuous, but only use the left and right faces.
     */
    ContinuousLeftRight = "ContinuousLeftRight",
    /**
     * As with Continuous, but only use the top and bottom faces.
     */
    ContinuousTopBottom = "ContinuousTopBottom",
    /**
     * Center of the left edge of the element.
     */
    Left = "Left",
    /**
     * Tracks the perimeter of some shape.
     */
    Perimeter = "Perimeter",
    /**
     * Center of the right edge of the element.
     */
    Right = "Right",
    /**
     * Center of the top edge of the element.
     */
    Top = "Top",
    /**
     * Top left corner of the element.
     */
    TopLeft = "TopLeft",
    /**
     * Top right corner of the element.
     */
    TopRight = "TopRight"
}

/**
 * Common options for anchors.
 * @public
 */
export declare interface AnchorOptions extends Record<string, any> {
    /**
     * Optional css class that will be applied to any DOM element for an endpoint using this anchor.
     */
    cssClass?: string;
}

/**
 * Defines the current location that an anchor is placed at.
 * @internal
 */
export declare type AnchorPlacement = {
    curX: number;
    curY: number;
    x: number;
    y: number;
    ox: number;
    oy: number;
};

/**
 * Models the specification of anchor - which may be a SingleAnchorSpec, or an array of SingleAnchorSpec objects.
 * @public
 */
export declare type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>;

/**
 * An anchor spec in the form [ x, y, ox, oy ]
 */
export declare type ArrayAnchorSpec = [number, number, number, number, number?, number?];

/**
 * @public
 */
export declare interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}

/**
 * @public
 */
export declare interface BlankEndpointParams extends EndpointRepresentationParams {
}

/**
 * High level definition of a Connector.
 * @public
 */
export declare interface Connector {
    /**
     * The connector's type.
     */
    type: string;
}

/**
 * Alias for the use case that a Connector is referenced just by its `type`.
 * @public
 */
export declare type ConnectorId = string;

/**
 * Common options for connectors.
 * @public
 */
export declare interface ConnectorOptions extends Record<string, any> {
    /**
     * Stub defines a number of pixels that the connector travels away from its element before the connector's actual path begins.
     */
    stub?: number | number[];
    /**
     * Defines a number of pixels between the end of the connector and its anchor point. Defaults to zero.
     */
    gap?: number;
    /**
     * Optional class to set on the element used to render the connector.
     */
    cssClass?: string;
    /**
     * Optional class to set on the element used to render the connector when the mouse is hovering over the connector.
     */
    hoverClass?: string;
}

/**
 * Specification of a connector - either the type id of some Connector, a type+options object.
 * @public
 */
export declare type ConnectorSpec = ConnectorId | ConnectorWithOptions;

/**
 * Connector spec in the form `{type:.., options:{.. }}`
 * @public
 */
export declare type ConnectorWithOptions = {
    type: ConnectorId;
    options: ConnectorOptions;
};

/**
 * @public
 */
export declare interface CustomOverlayOptions extends OverlayOptions {
    create: (c: Component) => any;
}

/**
 * Constant used im various places internally, and in the Toolkit edition used as the key for default node, edge, port and group definitions.
 * @public
 */
export declare const DEFAULT = "default";

/**
 * @public
 */
export declare interface DotEndpointParams extends EndpointRepresentationParams {
    radius?: number;
}

/**
 * Returns an empty bounds object, used in certain initializers internally.
 * @internal
 */
export declare function EMPTY_BOUNDS(): Extents;

/**
 * @public
 */
export declare type EndpointId = "Rectangle" | "Dot" | "Blank" | UserDefinedEndpointId;

/**
 * @public
 */
export declare type EndpointParams = any;

/**
 * @public
 */
export declare interface EndpointRepresentationParams {
    cssClass?: string;
}

/**
 * @public
 */
export declare type EndpointSpec = EndpointId | FullEndpointSpec;

/**
 * @public
 */
export declare interface EndpointStyle extends PaintStyle, Record<string, any> {
}

/**
 * Constant for the term "false"
 * @public
 */
export declare const FALSE = "false";

/**
 * An anchor spec in the form `{type:..., options:{ ... }}`
 * @public
 */
export declare type FullAnchorSpec = {
    type: AnchorId;
    options: AnchorOptions;
};

/**
 * @public
 */
export declare type FullEndpointSpec = {
    type: EndpointId;
    options: EndpointParams;
};

/**
 * @public
 */
export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};

/**
 * Geometry defines the path along which a connector travels. The internal contents of a Geometry vary widely between connectors.
 * @public
 */
export declare interface Geometry {
    source: any;
    target: any;
}

/**
 * @public
 */
export declare interface LabelOverlayOptions extends OverlayOptions {
    label: string | Function;
    labelLocationAttribute?: string;
}

/**
 * @public
 */
export declare interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Record<string, (value: any, event?: any) => any>;
}

/**
 * @public
 */
export declare type OverlaySpec = string | FullOverlaySpec;

/**
 * Used internally by connectors.
 * @internal
 */
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
 * @public
 */
export declare interface PerimeterAnchorOptions extends AnchorOptions {
    shape: keyof PerimeterAnchorShapes;
    rotation?: number;
    anchorCount?: number;
}

/**
 * Supported shapes for a Perimeter anchor.
 * @public
 */
export declare enum PerimeterAnchorShapes {
    Circle = "Circle",
    Ellipse = "Ellipse",
    Triangle = "Triangle",
    Diamond = "Diamond",
    Rectangle = "Rectangle",
    Square = "Square"
}

/**
 * @internal
 */
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

/**
 * @public
 */
export declare interface RectangleEndpointParams extends EndpointRepresentationParams {
    width?: number;
    height?: number;
}

/**
 * Definition of a segment. This is an internal class that users of the API need not access.
 * @internal
 */
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

/**
 * @internal
 */
export declare interface SegmentParams {
    x1: number;
    x2: number;
    y1: number;
    y2: number;
}

/**
 * Models the specification of a single anchor.
 * @public
 */
export declare type SingleAnchorSpec = AnchorId | FullAnchorSpec | ArrayAnchorSpec;

/**
 * Constant for the term "true"
 * @public
 */
export declare const TRUE = "true";

/**
 * Constant for matching JS 'undefined'.
 * @public
 */
export declare const UNDEFINED = "undefined";

/**
 * @public
 */
export declare type UserDefinedEndpointId = string;

/**
 * Constant representing the wildcard used in several places in the API.
 * @public
 */
export declare const WILDCARD = "*";

export { }
