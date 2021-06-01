
import {BezierConnector} from "./bezier-connector"
import {Connectors} from "@jsplumb/core"
import {StateMachineConnector} from "./statemachine-connector"

export * from "./bezier"
export * from "./bezier-segment"
export * from "./abstract-bezier-connector"
export * from "./bezier-connector"
export * from "./statemachine-connector"

Connectors.register(BezierConnector.type, BezierConnector)
Connectors.register(StateMachineConnector.type, StateMachineConnector)
