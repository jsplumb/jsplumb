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
import { PaintGeometry } from '@jsplumb/core';

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
}

export declare interface FlowchartConnectorOptions extends ConnectorOptions {
    alwaysRespectStubs?: boolean;
    midpoint?: number;
    cornerRadius?: number;
    loopbackRadius?: number;
}

export { }
