/**
 * Created by Siro on 2017/4/4.
 */

var clientHeight, clientWidth;
var searchfirstClick = false;
$(document).ready(function () {
    clientHeight = window.innerHeight;
    clientWidth = window.innerWidth;

    //set body's height
    // $('body').css({height: clientHeight + "px"});

    //init carousel
    $('.owl-carousel').owlCarousel({
        items: 1,
        autoplay: true,
        loop: true
    });
    //init loading main-content's club
    init();

    //show search-bar & hide it
    $('.navbar-show-search').on('click', function () {
        $('.home-bar').hide();
        $('.search-bar').fadeIn();
    });
    $('.close-btn').on('click', function () {
        $('.search-bar').hide()
        $('.home-bar').fadeIn();
        $('#result-content').slideUp(200);
    });

    //Handle search event
    //1. can't be empty
    //2. if searchContent is as same as the old one, will not get new data
    //3. add 'key-enter' listener,trigger the search-btn
    //4. when get new content, we should refresh 'club click' event, because of ajax
    $('.search-content').on('keydown', function (e) {
        if (e.keyCode == 13) {
            $('.search-btn').trigger('click');
        }
    });

    var rsScroller;
    $('.search-btn').on('click', function () {
        var searchContent = $('.search-content').val();
        var resultContainer = $('#result-content');

        if (searchContent == "") {
            alert('搜索内容不能为空');
        }

        else {

            resultContainer.fadeIn();
            resultContainer.loadingAnimation('show');

            $.get('controller/json.php', {type: 'search', content: searchContent}, function (data, status) {

                output("Result: " + data);

                if (status == 'success') {
                    var Obj = JSON.parse(data);
                    var headObj = Obj.head;
                    var clubObjArray = Obj.data;

                    if (headObj.status == 'success') {
                        appendIntoRsContent({
                            coArr: clubObjArray
                        });
                    }
                    else {
                        var htm = '<div>' + headObj.extraInfo + '</div>';
                        $('#result-content .scroller').html(htm);
                    }
                }


                refreshClubClickEvent();
                if (!searchfirstClick) {
                    rsScroller = initScroller('#result-content');
                    searchfirstClick = true;
                }
                else {
                    rsScroller.refresh();
                }
                resultContainer.loadingAnimation('hide');
            });
        }
    });


    //Handle uni-rank-tab's click
    //1. only execute once
    //2. get the rank info by ajax
    $('.uni-rank-tab').one('click', function () {
        $.get('controller/json.php',{type: "uni_rank"},function (data,status) {
            if(status == "success"){
                var Obj = JSON.parse(data);
                var headObj = Obj.head;
                var uniObj_1Array = Obj.data;

                if(headObj.status == "success"){
                    var uniLen = uniObj_1Array.length;

                    for(var i = 0; i < uniLen; i++){
                        var uniObj = uniObj_1Array[i];
                        var clubObjArray = uniObj.clubObjectArray;
                        appendIntoUniRankContent({
                            uni_name: uniObj.uni_name,
                            coArr:  clubObjArray
                        });
                    }
                }
                else{
                    alert(headObj.extraInfo);
                }

                refreshClubNameClickEvent();
            }
        });

        setTimeout(function () {
            initScroller('#uni-rank-content');
        }, 300);
    });

    //Handle sum-rank-tab's click
    //1. only execute once
    //2. get the rank info by ajax
    $('.sum-rank-tab').one('click', function () {
        $.get('controller/json.php',{type: "all_rank"},function (data,status) {
            if(status == 'success'){
                var Obj = JSON.parse(data);
                var headObj = Obj.head;
                var clubObjArray = Obj.data;

                if(headObj.status == "success"){
                    appendIntoSumRankContent({
                        coArr: clubObjArray
                    });
                }
                else{
                    alert(headObj.extraInfo);
                }
            }
            refreshClubNameClickEvent();
        });
        // appendIntoSumRankContent();
        setTimeout(function () {
            initScroller('#sum-rank-content');
        }, 300);
    });


    //check for rank-flag
    var flag = sessionStorage.getItem('rank_flag');
    if (flag) {
        $('.sum-rank-tab').trigger('click');
        $('.main-tab').removeClass('active');
        $('#main-content').removeClass('active').removeClass('in');
        $('.sum-rank-tab').addClass('active');
        $('#sum-rank-content').addClass('active').addClass('in');
        sessionStorage.removeItem('rank_flag');
    }
});


function appendIntoMainContent(options) {
    var defaults = {
        club_id: 1,
        club_pic: "images/group_pic.png",
        club_name: "深大荔知",
        club_from: "深圳大学",
        club_fav_count: "666"
    }
    options = $.extend(defaults, options);

    var htm = '<div class="club"><div class="club-header"><div class="club-id"><p>' +
        //id
        options.club_id +

        "</p></div><div class=\"club-pic\" style=\"background-image: url('" +
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
function appendIntoUniRankContent(options) {
    var defaults = {
        uni_name: "深圳大学",
        coArr: [{club_id: 22, club_name: "信工义修组", club_fav_count: 8888, uni_icon: "images/uni_icon.jpg"},
            {club_id: 22, club_name: "信工义修组", club_fav_count: 8888, uni_icon: "images/uni_icon.jpg"},
            {club_id: 22, club_name: "信工义修组", club_fav_count: 8888, uni_icon: "images/uni_icon.jpg"},
            {club_id: 22, club_name: "信工义修组", club_fav_count: 8888, uni_icon: "images/uni_icon.jpg"},
            {club_id: 22, club_name: "信工义修组", club_fav_count: 8888, uni_icon: "images/uni_icon.jpg"}]
    };

    options = $.extend(defaults, options);

    var coArr = options.coArr;

    var htm = '<div class="uni-rank-table"><div class="uni-rank-table-header">' +
        "<div class=\"uni-icon\" style=\"background-image: url('" +

        // uni-icon
        coArr[0].uni_icon +

        "')\"></div><a href=\"#\" class=\"uni-name\">" +

        //uni-name
        options.uni_name +

        "</a></div><div class=\"line-1\"></div>";

    var len = coArr.length;

    for (var i = 0; i < len; i++) {
        var co = coArr[i];
        var fragment = '<div class="uni-rank-table-row"><div class="club-rank">' +
            //club-rank
            (i + 1) +

            '</div><div class="club-id">' +

            //club-id  hidden
            co.club_id +

            '</div><a class="club-name">' +

            //club-name
            co.club_name +

            '</a><div class="club-fav-count"><span class="glyphicon glyphicon-heart"></span><span class="num">' +

            //club_fav_count
            co.club_fav_count +

            '</span></div></div>';

        htm += fragment;
    }
    htm += '</div><div class="line-2"></div>';
    $('#uni-rank-content .scroller').append(htm);
}
function appendIntoSumRankContent(options) {
    var defaults = {
        coArr: [{uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233},
            {uni_icon: "images/uni_icon.jpg", club_id: 66, club_name: "校学生会", club_fav_count: 233}]
    }
    options = $.extend(defaults, options);

    var htm = '<div class="sum-rank-table">';
    var coArr = options.coArr;
    var len = coArr.length;
    for (var i = 0; i < len; i++) {
        var co = coArr[i];

        var fragment = '<div class="sum-rank-table-row"><div class="uni-icon"' +
            " style=\"background-image: url('" +

            //uni-icon
            co.uni_icon +

            "')\"></div><div class=\"club-id\">" +

            //club-id
            co.club_id +

            '</div><a class="club-name">' +

            //club-name
            co.club_name +

            '</a><div class="club-fav-count"><span class="glyphicon glyphicon-heart"></span><span class="num">' +

            //club-fav-count
            co.club_fav_count +

            '</span></div><p class="club-rank">' +

            //club-rank
            (i + 1) +

            '</p></div>';


        htm += fragment;
    }
    htm += '</div>';
    $('#sum-rank-content .scroller').append(htm);

}
function appendIntoRsContent(options) {
    var defaults = {
        coArr: [{
            club_id: 23,
            club_pic: "images/group_pic.png",
            club_name: "深大荔知",
            club_from: "深圳大学",
            club_fav_count: 666
        },
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666},
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666},
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666},
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666},
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666},
            {club_id: 23, club_pic: "images/group_pic.png", club_name: "深大荔知", club_from: "深圳大学", club_fav_count: 666}]
    }

    options = $.extend(defaults, options);

    var coArr = options.coArr;
    var len = coArr.length;
    var htm = "";
    for (var i = 0; i < len; i++) {
        var co = coArr[i];

        var fragment = '<div class="club"><div class="club-header"><div class="club-id"><p>' +
            //id
            co.club_id +

            "</p></div><div class=\"club-pic\" style=\"background-image: url('" +
            //club_pic
            co.club_pic +

            "')\"></div></div><div class=\"club-info\"><div class=\"club-name\">" +
            //club_name
            co.club_name +

            '</div><div class="club-from">' +
            //club_from
            co.club_from +

            '</div><div class="club-fav-count"><span class="glyphicon glyphicon-heart"></span><span class="num">' +
            //club_fav_count
            co.club_fav_count +

            '</span></div></div></div>';

        htm += fragment;
    }
    $('#result-content .scroller').html(htm);
}
function init() {

    $.get('controller/json.php', {type: "init"}, function (data, status) {
        if (status == 'success') {

            var dataObj = JSON.parse(data);

            var headObj = dataObj.head;
            var clubObjArr = dataObj.data;

            if (headObj.status == "success") {
                var len = clubObjArr.length;
                for (var i = 0; i < len; i++) {
                    var co = clubObjArr[i]; // co = clubObject
                    appendIntoMainContent({
                        club_id: co.club_id,
                        club_pic: co.club_pic,
                        club_name: co.club_name,
                        club_from: co.club_from,
                        club_fav_count: co.club_fav_count
                    });
                }
                refreshClubClickEvent();
                initScroller("#main-content");
            }
            else {
                alert(headObj.extraInfo);
            }
        }
    });

    //test
    // for (var i = 0; i < 5; i++) {
    //     appendIntoMainContent({club_id: i + 1});
    // }
}

function refreshClubClickEvent() {
    $('.club').off('click');
    $('.club').on('click', handleClubClick);
}

function refreshClubNameClickEvent() {
    $('#uni-rank-content .club-name').off('click');
    $('#sum-rank-content .club-name').off('click');

    $('#uni-rank-content .club-name').on('click', handleClubNameClick);
    $('#sum-rank-content .club-name').on('click', handleClubNameClick);

}

//Handle club click event
//1. get the id, and add it to href
//2. redirect introduction.html?id=
//3. when opening introduction.html, execute ajax to get more info by this id
function handleClubClick() {
    var id = Number($(this).find('.club-id').text());
    saveIdAndRedirect(id);
}

// as same as club click event
function handleClubNameClick() {
    var id = Number($(this).parent().find('.club-id').text());
    saveIdAndRedirect(id);
}

function saveIdAndRedirect(id) {
    window.location.href = './introduction.html?id=' + id;
}

function output(m) {
    console.log(m);
}


// js about loading animation
(function ($) {
    //mode: show / hide
    var html = '<div class="loader"><div class="loading"><i></i><i></i><i></i><i></i><i></i></div></div>';

    $.fn.loadingAnimation = function (mode) {
        if (mode == 'show') {
            $(this).append(html);
            var eleHeight = $(this).css('height');
            $('.loader').css({
                display: "flex",
                height: eleHeight
            });

        }
        else {
            $('.loader').remove();
        }
    };
})(jQuery);


