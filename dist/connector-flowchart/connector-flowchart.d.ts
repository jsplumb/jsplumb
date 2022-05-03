/**
 * This package contains the Flowchart connector. Prior to version 5.x this connector was shipped
 * along with the core.
 *
 * @packageDocumentation
 */

import { AbstractConnector } from '@jsplumb/core';
import { Connection } from '@jsplumb/core';
import { ConnectorComputeParams } from '@jsplumb/core';
import { ConnectorOptions } from '@jsplumb/common';
import { Geometry } from '@jsplumb/common';
import { PaintGeometry } from '@jsplumb/core';

/**
 * Flowchart connector inscribes a path consisting of a series of horizontal and vertical segments.
 * @public
 */
export declare class FlowchartConnector extends AbstractConnector {
    connection: Connection;
    static type: string;
    type: string;
    private internalSegments;
    midpoint: number;
    alwaysRespectStubs: boolean;
    cornerRadius: number;
    lastx: number;
    lasty: number;
    lastOrientation: any;
    loopbackRadius: number;
    isLoopbackCurrently: boolean;
    getDefaultStubs(): [number, number];
    constructor(connection: Connection, params: FlowchartConnectorOptions);
    private addASegment;
    private writeSegments;
    _compute(paintInfo: PaintGeometry, params: ConnectorComputeParams): void;
    transformGeometry(g: Geometry, dx: number, dy: number): Geometry;
}

/**
 * Options for a flowchart connector
 * @public
 */
export declare interface FlowchartConnectorOptions extends ConnectorOptions {
    /**
     * Always paint stubs at the end of a connector, even if the elements are closer together than the length of the stubs.
     */
    alwaysRespectStubs?: boolean;
    /**
     * Optional midpoint to use for the connector, defaults to 0.5.
     */
    midpoint?: number;
    /**
     * Optional curvature between segments. Defaults to 0, ie. no curve.
     */
    cornerRadius?: number;
    /**
     * How large to make a connector whose source and target is the same element.
     */
    loopbackRadius?: number;
}

export { }
