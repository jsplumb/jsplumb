import { PaintStyle } from "../styles";
import { TypeDescriptor } from "../core";
export interface ConnectorRenderer<E> {
    paint(paintStyle: PaintStyle, extents?: any): void;
    setHover(h: boolean): void;
    cleanup(force?: boolean): void;
    destroy(force?: boolean): void;
    addClass(clazz: string): void;
    removeClass(clazz: string): void;
    getClass(): string;
    setVisible(v: boolean): void;
    applyType(t: TypeDescriptor): void;
    moveParent(newParent: E): void;
}
