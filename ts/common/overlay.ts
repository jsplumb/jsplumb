import { PaintStyle } from './paint-style'

/**
 * @public
 */
export interface OverlayOptions extends Record<string, any> {
    id?:string
    cssClass?: string
    location?: number | number[] // 0.5
    events?:Record<string, (value:any, event?:any)=>any>
    attributes?:Record<string, string>
}

/**
 * @public
 */
export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number; // 20
    length?: number; // 20
    direction?: number; // 1
    foldback?: number; // 0.623
    paintStyle?: PaintStyle
}

/**
 * @public
 */
export interface LabelOverlayOptions extends OverlayOptions {
    label: string|Function
    labelLocationAttribute?:string
}

/**
 * @public
 */
export type FullOverlaySpec = { type:string, options:OverlayOptions }
/**
 * @public
 */
export type OverlaySpec = string | FullOverlaySpec
