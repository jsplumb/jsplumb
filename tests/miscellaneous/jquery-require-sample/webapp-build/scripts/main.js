
$.fn.alpha = function() {
    return this.append('<p>Alpha is Go!</p>');
};
define("jquery.alpha", function(){});

$.fn.beta = function() {
    return this.append('<p>Beta is Go!</p>');
};

define("jquery.beta", function(){});

require(["jquery", "jquery.alpha", "jquery.beta"], function($) {
    //the jquery.alpha.js and jquery.beta.js plugins have been loaded.
    $(function() {
        $('body').alpha().beta();
        
    });
});

require(["jsplumb"], function(_jsPlumb) {
    _jsPlumb.ready(function() {        
        _jsPlumb.connect({
            source:"one",
            target:"two"
        });
    })
});

define("main", function(){});
