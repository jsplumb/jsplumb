import {OverlayCapableComponent} from "../overlay/overlay-capable-component";
import {Point} from "./ui-component";
export abstract class PathBasedComponent<EventType, ElementType> extends OverlayCapableComponent<EventType, ElementType> {

    abstract pointOnPath(location:number, absolute?:Boolean):Point;

    abstract gradientAtPoint(location:number, absolute?:Boolean):number;

    abstract pointAlongPathFrom(location:number, distance:number, absolute?:Boolean):Point;
}
