
export interface AnchorOptions extends Record<string, any> {
    cssClass?:string
}

/**
 * Constructor options for a Perimeter Anchor.
 */
export interface PerimeterAnchorOptions extends AnchorOptions {
    shape:string
    rotation?:number
    anchorCount?:number
}

export type AnchorPlacement = {
    curX:number,
    curY:number,
    x:number,
    y:number,
    ox:number,
    oy:number
}

export enum AnchorLocations {
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

export type AnchorId = keyof typeof AnchorLocations

export type FullAnchorSpec = {type:AnchorId, options:AnchorOptions}
export type SingleAnchorSpec = AnchorId | FullAnchorSpec | AnchorPlacement | Array<AnchorPlacement>
export type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>
