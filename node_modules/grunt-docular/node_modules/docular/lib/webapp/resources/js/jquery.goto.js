(function($) {
    $.fn.goTo = function() {
        $('html, body').animate({
            scrollTop: $(this).offset().top - 128 + 'px'
        }, 500);
        return this; // for chaining...
    };
})(jQuery);