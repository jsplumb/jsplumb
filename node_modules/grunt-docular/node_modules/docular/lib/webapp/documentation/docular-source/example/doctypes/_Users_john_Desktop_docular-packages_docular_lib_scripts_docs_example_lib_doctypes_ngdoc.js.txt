
//just so this looks like a valid js file we should include the global namespace
var doctypes_ngdoc = {};


/**
 * @ngdoc module
 * @name doctypes_ngdoc
 * @description
 * This module houses example's of docTypes for the @ngdoc documentation plugin.
 */


/**
 * @ngdoc directive
 * @name doctypes_ngdoc.directive:directive_example
 * @param {string} booyah Incoming string value
 * @description
 *
 * This is an example of an directive.
 *
 */
doctypes_ngdoc.directive = function () {

};

/**
 * @ngdoc filter
 * @name doctypes_ngdoc.filter:filter_example
 * @description
 *
 * The is how a filter renders
 *
 */
doctypes_ngdoc.filter = function () {

};

/**
 * @ngdoc service
 * @name doctypes_ngdoc.service:service_example
 * @description
 * @param {string} booyah this is a param
 * @returns {function} Returns a service value
 * The is how a service renders
 */
doctypes_ngdoc.service = function () {

    return function () {};

};

/**
 * @ngdoc method
 * @methodOf doctypes_ngdoc.service:service_example
 * @param {string} jeah Some parameter jeah!
 * @name doctypes_ngdoc.service:service_example#yayer
 * @return {string} some string value
 */
doctypes_ngdoc.service.yayer = function (jeah) {
    return jeah + ' ah jeah';
};
