import {Dictionary} from "@jsplumb/util"
import {Component} from "@jsplumb/core"
import { PaintStyle } from './paint-style'

export interface OverlayOptions extends Record<string, any> {
    id?:string
    cssClass?: string
    location?: number | number[] // 0.5
    events?:Dictionary<(value:any, event?:any)=>any>
}

export interface ArrowOverlayOptions extends OverlayOptions {
    width?: number; // 20
    length?: number; // 20
    direction?: number; // 1
    foldback?: number; // 0.623
    paintStyle?: PaintStyle
}

export interface LabelOverlayOptions extends OverlayOptions {
    label: string|Function
    labelLocationAttribute?:string
}

export interface CustomOverlayOptions extends OverlayOptions {
    create:(c:Component) => any
}

export type FullOverlaySpec = { type:string, options:OverlayOptions }
export type OverlaySpec = string | FullOverlaySpec
