import { PaintStyle } from './paint-style';
/**
 * @public
 */
export interface OverlayOptions extends Record<string, any> {
    id?: string;
    cssClass?: string;
    location?: number | number[];
    events?: Record<string, (value: any, event?: any) => any>;
    attributes?: Record<string, string>;
}
/**
 * @public
 */
export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number;
    length?: number;
    direction?: number;
    foldback?: number;
    paintStyle?: PaintStyle;
}
/**
 * @public
 */
export interface LabelOverlayOptions extends OverlayOptions {
    label: string | Function;
    labelLocationAttribute?: string;
}
/**
 * @public
 */
export declare type FullOverlaySpec = {
    type: string;
    options: OverlayOptions;
};
/**
 * @public
 */
export declare type OverlaySpec = string | FullOverlaySpec;
//# sourceMappingURL=overlay.d.ts.map