/**
 * Common options for anchors.
 * @public
 */
import { AnchorOrientationHint } from "../core/factory/anchor-record-factory";
export interface AnchorOptions extends Record<string, any> {
    /**
     * Optional css class that will be applied to any DOM element for an endpoint using this anchor.
     */
    cssClass?: string;
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
 * Constructor options for a Perimeter Anchor.
 * @public
 */
export interface PerimeterAnchorOptions extends AnchorOptions {
    shape: keyof PerimeterAnchorShapes;
    rotation?: number;
    anchorCount?: number;
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
    ox: AnchorOrientationHint;
    oy: AnchorOrientationHint;
};
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
 * List of entries in the AnchorLocations enum
 * @public
 */
export declare type AnchorId = keyof typeof AnchorLocations;
/**
 * An anchor spec in the form `{type:..., options:{ ... }}`
 * @public
 */
export declare type FullAnchorSpec = {
    type: AnchorId;
    options: AnchorOptions;
};
/**
 * An anchor spec in the form [ x, y, ox, oy ]
 */
export declare type ArrayAnchorSpec = [number, number, AnchorOrientationHint, AnchorOrientationHint, number?, number?];
/**
 * Models the specification of a single anchor.
 * @public
 */
export declare type SingleAnchorSpec = AnchorId | FullAnchorSpec | ArrayAnchorSpec;
/**
 * Models the specification of anchor - which may be a SingleAnchorSpec, or an array of SingleAnchorSpec objects.
 * @public
 */
export declare type AnchorSpec = SingleAnchorSpec | Array<SingleAnchorSpec>;
//# sourceMappingURL=anchor.d.ts.map