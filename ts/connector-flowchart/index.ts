import {FlowchartConnector} from "./flowchart-connector"
import {Connectors} from "@jsplumb/core"

export * from "./flowchart-connector"

Connectors.register(FlowchartConnector.type, FlowchartConnector)
