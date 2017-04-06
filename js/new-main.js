/**
 * Created by Siro on 2017/4/4.
 */
$(document).ready(function () {
    init();

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
        output('Search content: ' + searchContent);
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

function appendIntoMainContent(options) {
    var defaults = {
        club_id: 1,
        club_pic: "images/club-pic.png",
        club_name: "深大荔知",
        club_from: "深圳大学",
        club_fav_count: "666"
    }
    options = $.extend(defaults,options);

    var htm = '<div class="club"><div class="club-header"><div class="club-id"><p>' +
        //id
        options.club_id +

        "</p></div><div class=\"club-pic\" style=\"background-image: url('"+
        //club_pic
        options.club_pic +

        "')\"></div></div><div class=\"club-info\"><div class=\"club-name\">" +
        //club_name
        options.club_name +

        '</div><div class="club-from">' +
        //club_from
        options.club_from +

        '</div><div class="club-fav-count"><span class="glyphicon glyphicon-heart"></span><span class="num">' +
        //club_fav_count
        options.club_fav_count +

        '</span></div></div></div>';

    $('#main-content .scroller .content').append(htm);

}
function init() {
    for(var i = 0; i < 5; i++){
        appendIntoMainContent({club_id: i+1});
    }

}
function output(m) {
    console.log(m);
}