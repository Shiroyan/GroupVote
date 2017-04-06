/**
 * Created by Siro on 2017/4/4.
 */
(function ($) {
    //mode: show / hide
    var html = '<div class="loader"><div class="loading"><i></i><i></i><i></i><i></i><i></i></div></div>';

    $.fn.loadingAnimation = function (mode) {
        if(mode == 'show'){
            $(this).append(html);
            var eleHeight = $(this).css('height');
            $('.loader').css({display: "flex",
            height:eleHeight});

        }
        else {
            $('.loader').remove();
        }
    };
})(jQuery);