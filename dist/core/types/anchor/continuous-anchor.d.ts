import { AnchorId, Face, AnchorOptions } from "../factory/anchor-factory";
import { Anchor } from "./anchor";
import { Dictionary } from '../common';
import { JsPlumbInstance } from "../core";
export interface ContinuousAnchorOptions extends AnchorOptions {
    faces?: Array<Face>;
    clockwise?: boolean;
}
export declare type FACE_MAP = Dictionary<boolean>;
export declare class ContinuousAnchor extends Anchor {
    instance: JsPlumbInstance;
    static type: AnchorId;
    type: AnchorId;
    isDynamic: boolean;
    isContinuous: boolean;
    private clockwise;
    private faces;
    private secondBest;
    private lastChoice;
    private _currentFace;
    private _lockedFace;
    private _lockedAxis;
    private availableFaces;
    constructor(instance: JsPlumbInstance, anchorParams: ContinuousAnchorOptions);
    getDefaultFace(): Face;
    verifyEdge(edge: Face): Face;
    isEdgeSupported(edge: Face): boolean;
    setCurrentFace(face: Face, overrideLock?: boolean): void;
    getCurrentFace(): Face;
    getSupportedFaces(): Array<Face>;
    lock(): void;
    unlock(): void;
    lockCurrentAxis(): void;
    unlockCurrentAxis(): void;
    getCssClass(): string;
}
