/**
 * Created by Siro on 2017/4/4.
 */

var clientHeight, clientWidth;
var searchfirstClick = false;
$(document).ready(function () {

    clientHeight = window.innerHeight;
    clientWidth = window.innerWidth;
    var carouselImgHeight = clientWidth * 0.4;

    $('.c1, .c2, .c3').css({height: carouselImgHeight + "px"});

    $(window).on('load',function (e) {


        var contentHeight = clientHeight - $('#main-content').offset().top;
        output(contentHeight + ' ' + clientHeight);
        $('#main-content').css({height: contentHeight + "px"});
        $('#uni-rank-content').css({height: contentHeight + "px"});
        $('#sum-rank-content').css({height: contentHeight + "px"});
        $('#result-content').css({height: clientHeight-43 + "px"});
        init();

    });

    $('.navbar-show-search').on('click', function () {
        $('.my-navbar').fadeOut();
        $('.search-bar').fadeIn();
    });
    $('.close-btn').on('click', function () {
        $('.search-bar').fadeOut();
        $('.my-navbar').fadeIn();
        $('#result-content').slideUp(200);
    });
    //处理搜索事件
    $('.search-content').on('keydown',function (e) {
        if(e.keyCode == 13){
            $('.search-btn').trigger('click');
        }

    });

    var rsScroller;
    $('.search-btn').on('click', function () {
        var searchContent = $('.search-content').val();
        var resultContainer = $('#result-content');

        resultContainer.fadeIn();

        for(var i = 0; i < 7; i++){
            appendIntoMainContent({target: '#result-content .scroller'});
        }

        if(!searchfirstClick){
            rsScroller = initScroller('#result-content');
            searchfirstClick = true;
        }
        else{
            rsScroller.refresh();
        }
    });

    $('.main-tab').on('click', function (e) {
        e.preventDefault();
    });

    $('.club').on('click',function () {
        output('Club click');
    });

    $('.uni-rank-tab').one('click',function () {
       setTimeout(function () {
           initScroller('#uni-rank-content');
       },500);
    });
    $('.sum-rank-tab').one('click',function () {
        setTimeout(function () {
            initScroller('#sum-rank-content');
        },500);
    })
});

function appendIntoMainContent(options) {
    var defaults = {
        club_id: 1,
        club_pic: "images/club-pic.png",
        club_name: "深大荔知",
        club_from: "深圳大学",
        club_fav_count: "666",
        target: '#main-content .scroller .content'
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

    $(options.target).append(htm);

}
function init() {

    // $.get('http://192.168.220.129:8888',{type: 'init'},function (data,status) {
    //     if(status == 'success'){
    //         var dataObj = JSON.parse(data);
    //
    //         var headObj = dataObj.head;
    //         var clubObjArr = dataObj.data;
    //
    //         if(headObj.status == "success"){
    //             var len = clubObjArr.length;
    //             for(var i = 0; i < len; i++){
    //                 var co = clubObjArr[i]; // co = clubObject
    //                 appendIntoMainContent({
    //                     club_id: co.club_id,
    //                     club_pic: co.club_pic,
    //                     club_name: co.club_name,
    //                     club_from: co.club_from,
    //                     club_fav_count: co.club_fav_count
    //                 });
    //             }
    //             setTimeout(function () {
    //                 initScroller("#main-content");
    //             },500);
    //         }
    //         else{
    //             alert(headObj.extraInfo);
    //         }
    //     }
    // });
    for(var i = 0; i < 5; i++){
        appendIntoMainContent({club_id: i+1});
    }
    setTimeout(function () {
        initScroller("#main-content");
    },500);

}
function output(m) {
    console.log(m);
}