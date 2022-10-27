import { Grid, Size } from "@jsplumb/util";
/**
 * Options for the grid
 */
export interface GridOptions {
    /**
     * width/height of the grid
     */
    size?: Size;
    /**
     * Whether or not to snap elements to the grid when dragging. Defaults to false.
     */
    snap?: boolean;
    /**
     * Whether or not to ensure calculated group sizes (from auto sized groups) are a multiple of the grid size in
     * each axis. Defaults to false.
     */
    fitGroupsToGrid?: boolean;
    thresholdX?: number;
    thresholdY?: number;
}
/**
 * Models the behaviour of a grid.
 * @internal
 */
export declare class GridProfile {
    grid: Grid;
    snap: boolean;
    fitGroupsToGrid: boolean;
    constructor(opts: GridOptions);
}
//# sourceMappingURL=grid-profile.d.ts.map