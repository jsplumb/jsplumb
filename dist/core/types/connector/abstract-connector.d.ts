import { PointXY, Extents, Constructable } from "@jsplumb/util";
import { Connection } from '../connector/connection-impl';
import { Orientation } from '../factory/anchor-record-factory';
import { Endpoint } from '../endpoint/endpoint';
import { ViewportElement } from "../viewport";
import { AnchorPlacement, ConnectorOptions, PaintAxis, Segment } from "@jsplumb/common";
declare type SegmentForPoint = {
    d: number;
    s: Segment;
    x: number;
    y: number;
    l: number;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    index: number;
    connectorLocation: number;
};
export declare type ConnectorComputeParams = {
    sourcePos: AnchorPlacement;
    targetPos: AnchorPlacement;
    sourceEndpoint: Endpoint;
    targetEndpoint: Endpoint;
    strokeWidth: number;
    sourceInfo: ViewportElement<any>;
    targetInfo: ViewportElement<any>;
};
export interface PaintGeometry {
    sx: number;
    sy: number;
    tx: number;
    ty: number;
    xSpan: number;
    ySpan: number;
    mx: number;
    my: number;
    so: Orientation;
    to: Orientation;
    x: number;
    y: number;
    w: number;
    h: number;
    segment: number;
    startStubX: number;
    startStubY: number;
    endStubX: number;
    endStubY: number;
    isXGreaterThanStubTimes2: boolean;
    isYGreaterThanStubTimes2: boolean;
    opposite: boolean;
    perpendicular: boolean;
    orthogonal: boolean;
    sourceAxis: PaintAxis;
    points: [number, number, number, number, number, number, number, number];
    stubs: [number, number];
    anchorOrientation?: string;
}
export interface Connector {
    type: string;
}
export interface Geometry {
    source: any;
    target: any;
}
export declare abstract class AbstractConnector implements Connector {
    connection: Connection;
    abstract type: string;
    edited: boolean;
    stub: number | number[];
    sourceStub: number;
    targetStub: number;
    maxStub: number;
    typeId: string;
    gap: number;
    sourceGap: number;
    targetGap: number;
    segments: Array<Segment>;
    totalLength: number;
    segmentProportions: Array<[number, number]>;
    segmentProportionalLengths: Array<number>;
    protected paintInfo: PaintGeometry;
    strokeWidth: number;
    x: number;
    y: number;
    w: number;
    h: number;
    segment: number;
    bounds: Extents;
    cssClass: string;
    hoverClass: string;
    abstract getDefaultStubs(): [number, number];
    geometry: Geometry;
    constructor(connection: Connection, params: ConnectorOptions);
    getTypeDescriptor(): string;
    getIdPrefix(): string;
    protected setGeometry(g: any, internal: boolean): void;
    /**
     * Subclasses can override this. By default we just pass back the geometry we are using internally.
     */
    exportGeometry(): any;
    /**
     * Subclasses can override this. By default we just set the given geometry as our internal representation.
     */
    importGeometry(g: any): boolean;
    resetGeometry(): void;
    abstract _compute(geometry: PaintGeometry, params: ConnectorComputeParams): void;
    resetBounds(): void;
    /**
     * Function: findSegmentForPoint
     * Returns the segment that is closest to the given [x,y],
     * null if nothing found.  This function returns a JS
     * object with:
     *
     *   d   -   distance from segment
     *   l   -   proportional location in segment
     *   x   -   x point on the segment
     *   y   -   y point on the segment
     *   s   -   the segment itself.
     */
    findSegmentForPoint(x: number, y: number): SegmentForPoint;
    lineIntersection(x1: number, y1: number, x2: number, y2: number): Array<PointXY>;
    boxIntersection(x: number, y: number, w: number, h: number): Array<PointXY>;
    boundingBoxIntersection(box: any): Array<PointXY>;
    _updateSegmentProportions(): void;
    /**
     * returns [segment, proportion of travel in segment, segment index] for the segment
     * that contains the point which is 'location' distance along the entire path, where
     * 'location' is a decimal between 0 and 1 inclusive. in this connector type, paths
     * are made up of a list of segments, each of which contributes some fraction to
     * the total length.
     * From 1.3.10 this also supports the 'absolute' property, which lets us specify a location
     * as the absolute distance in pixels, rather than a proportion of the total path.
     */
    _findSegmentForLocation(location: number, absolute?: boolean): {
        segment: Segment;
        proportion: number;
        index: number;
    };
    _addSegment(clazz: Constructable<Segment>, params: any): void;
    _clearSegments(): void;
    getLength(): number;
    private _prepareCompute;
    updateBounds(segment: Segment): void;
    private dumpSegmentsToConsole;
    pointOnPath(location: number, absolute?: boolean): PointXY;
    gradientAtPoint(location: number, absolute?: boolean): number;
    pointAlongPathFrom(location: number, distance: number, absolute?: boolean): PointXY;
    compute(params: ConnectorComputeParams): void;
    setAnchorOrientation(idx: number, orientation: number[]): void;
}
export {};
