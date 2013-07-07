/**
 * @doc overview
 * @name index
 * @description
 *
 * # Example's
 *
 * This section shows rendered examples listed throughout the overview
 * and tutorials that describe documentation for actual code. Click around to see how the examples
 * show up within the Docular UI.
 *
 */


/**
 * @doc module
 * @name utils
 * @description
 *
 * ## Global Utilities
 *
 * This module houses utillities that can be used across the app. There are some pretty cool and
 * uncool methods in this module so check it outizzle.
 *
 * Note, if you do not define the module using @doc module and the @name with the module id, then this page won't exist!!
 *
 */

//utils namespace
var utils = utils || {};

/**
 * @doc function
 * @name utils.global:makeCooler
 * @param  {string} string_in any ol' string
 * @return {string} adds on the 'izzle'
 * @description
 * Man this function is the functionizzle of the heezy for sheezy.
 *
 * In fact, sometimes I like to use it to coolify everything
 * ```js
 * for(var thing in window) {
 *     if(typeof(window[thing]) === "string") {
 *         window[thing] = util.makeCooler(window[thing]);
 *     }
 * }
 * ```
 */
utils.makeCooler = function (string_in) {
    return string_in + 'izzle';
};

/**
 * @doc function
 * @name utils.global:makeUncooler
 * @param  {string} string_in any ol' string
 * @return {string} removes 'izzle'
 * @description
 *
 * Nothin cool about this function...
 *
 */
utils.makeUncooler = function (string_in) {
    return string_in.replace(/izzle/gi,'');
};