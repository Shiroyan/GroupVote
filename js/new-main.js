/**
 * Created by Siro on 2017/4/4.
 */
$(document).ready(function () {
    $(window).on('load',function (e) {
        var clientHeight = window.innerHeight;
        var clientWidth = window.innerWidth;
        var carouselImgHeight = clientWidth * 0.4;

        // $('#owl-demo .item img').css({height: carouselImgHeight + "px"});
        $('.c1, .c2, .c3').css({height: carouselImgHeight + "px"});
        var contentHeight = clientHeight - $('#main-content').offset().top;

        output(contentHeight + ' ' + clientHeight);
        $('#main-content').css({height: contentHeight + "px"});
        $('#uni-rank-content').css({height: contentHeight + "px"});
        $('#sum-rank-content').css({height: contentHeight + "px"});

        initScroller(e,"#main-content");
    })

    $('.navbar-show-search').on('click', function () {
        $('.my-navbar').fadeOut(1000);
        $('.search-bar').fadeIn(800);
    });
    $('.close-btn').on('click', function () {
        $('.search-bar').fadeOut(1000);
        $('.my-navbar').fadeIn(800);
    });
    //处理搜索事件
    $('.search-btn').on('click', function () {
        var searchContent = $('.search-content');

        var searchVal = searchContent.val();
        $.get("./controller/search.php", {search: searchVal}, function (data, status) {
            // output(searchContent);

            $(".active-content").removeClass("active-content");
            $(".active-tab").removeClass("active-tab");
            $(".main-tab").addClass("active-tab");
            $(".result-content").addClass("active-content");

            var temp = "";
            for (var i = 0; i < 3; i++) {
                temp += ('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
                '<!-- 社团展示 --> <div class="group"> <div class="group-picture"> <img src="images/group_pic.png" alt="社团图片"> </div>' +
                '<div class="group-header"> <p class="order"> No.001</p> </div> <div class="group-mask"> <img src="images/white-heart.png">' +
                '<p class="fav-count">223</p> </div> <div class="group-footer"> <p class="text-center name">街头传播协会</p> </div> </div> </div>');
            }
            $('.result-content').html(temp);

            if (status == "success") {
                $('.result-content').html(data);
            }
        })

    });

    $('.main-tab').on('click', function (e) {
        e.preventDefault();
    });

    $('.club').on('click',function () {
        output('Club click');
    });

    $('.uni-rank-tab').one('click',function (e) {
        setTimeout(function() {
            initScroller(e, "#uni-rank-content");
        },500);
    });
    $('.sum-rank-tab').one('click',function (e) {
        setTimeout(function() {
            initScroller(e, "#sum-rank-content");
        },500);
    })
});

function output(m) {
    console.log(m);
}