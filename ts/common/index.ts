/**
 * This package contains common declarations and definitions for use by both jsPlumb Community and Toolkit editions.
 *
 * @packageDocumentation
 */

/**
 * Constant for matching JS 'undefined'.
 */
export const UNDEFINED = "undefined"
/**
 * Constant used im various places internally, and in the Toolkit edition used as the key for default node, edge, port and group definitions.
 */
export const DEFAULT = "default"
/**
 * Constant for the term "true"
 */
export const TRUE = "true"
/**
 * Constant for the term "false"
 */
export const FALSE = "false"
/**
 * Constant representing the wildcard used in several places in the API.
 */
export const WILDCARD = "*"

export * from './anchor'
export * from './abstract-segment'
export * from './connector'
export * from './endpoint'
export * from './overlay'
export * from "./paint-style"
