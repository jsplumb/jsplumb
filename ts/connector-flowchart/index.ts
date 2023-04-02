/**
 * This package contains the Flowchart connector. Prior to version 5.x this connector was shipped
 * along with the core.
 *
 * @packageDocumentation
 */

import {FlowchartConnector} from "./flowchart-connector"
import {Connectors} from "../core/connector/connectors"


export * from "./flowchart-connector"

Connectors.register(FlowchartConnector.type, FlowchartConnector)
