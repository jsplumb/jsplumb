/*============ CREATE THE docsApp MODULE AND REGISTER FACTORIES, DIRECTIVES, CONTROLLERS ============*/

angular.module('docsApp', ['ngResource', 'ngCookies', 'ngSanitize', 'bootstrap', 'bootstrapPrettify']).
    config(function($locationProvider) {
        $locationProvider.html5Mode(true).hashPrefix('!');
    })
    .factory(docsApp.serviceFactory)
    .directive(docsApp.directive)
    .controller(docsApp.controller);