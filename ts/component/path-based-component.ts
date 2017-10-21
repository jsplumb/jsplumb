import {Point} from "./ui-component";

export interface PathBasedComponent<EventType, ElementType> {

    pointOnPath(location:number, absolute?:Boolean):Point;

    gradientAtPoint(location:number, absolute?:Boolean):number;

    pointAlongPathFrom(location:number, distance:number, absolute?:Boolean):Point;
}

export function isPathBasedComponent<EventType, ElementType>(component:any): component is PathBasedComponent<EventType, ElementType> {
    return component.pointOnPath != null && component.gradientAtPoint != null && component.pointAlongPathFrom != null;
}