/**
 * This package contains the Bezier and StateMachine connectors. Prior to version 5.x these connectors were shipped
 * along with the core.
 *
 * @packageDocumentation
 */

import {BezierConnector} from "./bezier-connector"
import {StateMachineConnector} from "./statemachine-connector"
import {Connectors} from "../core/connector/connectors"

export * from "./bezier"
export * from "./bezier-segment"
export * from "./abstract-bezier-connector"
export * from "./bezier-connector"
export * from "./statemachine-connector"

Connectors.register(BezierConnector.type, BezierConnector)
Connectors.register(StateMachineConnector.type, StateMachineConnector)
