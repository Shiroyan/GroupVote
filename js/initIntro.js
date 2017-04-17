/**
 * Created by Siro on 2017/4/11.
 */
$(document).ready(function () {

    var code = getQueryString('code');
    var isRedirect = sessionStorage.getItem('isRedirect');
    if (isRedirect != "true" || code == null) {
        reDirect();
    }

    //init introduction.html, get more info by id (on sessionStorage)
    init();

    //jump to main-tab
    $('.to-main').on('click', function () {
        window.location.href = "./index.html";
    });
    // jump to rank-tab
    $('.to-rank').on('click', function () {
        sessionStorage.setItem('rank_flag', true);
        window.location.href = "./index.html";
    });

    //like
    $('.like').on('click', function () {

        // $.get('controller/json.php',{type: 'like', code: code},function (data,status) {
        //     if(status == "success"){
        //         var data = JSON.parse(data);
        //         var type = Number(data.type);
        //
        //         if(type == 1){
        //             var flag = confirm('你尚未关注，是否跳转至关注页面？');
        //             if(flag == true){
        //                 window.location.href = "https://www.baidu.com";
        //             }
        //         }
        //         else if(type == 2){
        //             var iconUrl = "./images/user_icon.png";
        //             var num = $('.club-fav-count .num');
        //             var fav_count = Number(num.text());
        //             num.text(fav_count+1);
        //             var htm = '<div class="user-icon" style="background-image: url(\'' +
        //                 iconUrl +
        //                 '\')"></div>';
        //
        //             $('.user-icon-list').append(htm);
        //             alert('点赞成功~');
        //         }
        //         else if(type == 3){
        //             alert('你今天已点赞过了哟，请明日再来~_(:з」∠)_');
        //         }
        //     }
        // });


        //离线测试用代码，上线请注释
        var type = 2;
        if(type == 1){
            var flag = confirm('你尚未关注，是否跳转至关注页面？');
            if(flag == true){
                window.location.href = "https://www.baidu.com";
            }
        }
        else if(type == 2){
            var iconUrl = "./images/user_icon.png";
            var num = $('.club-fav-count .num');
            var fav_count = Number(num.text());
            num.text(fav_count+1);
            var htm = '<div class="user-icon" style="background-image: url(\'' +
                 iconUrl +
                '\')"></div>';

            $('.user-icon-list').append(htm);
            alert('点赞成功~');
        }
        else if(type == 3){
            alert('你今天已点赞过了哟，请明日再来~_(:з」∠)_');
        }
    });

});

function init() {
    //get id
    var id = getQueryString('id');
    output(id);
    $('.club-id').text(id + "号");

    //send request
    $.get('controller/json.php', {type: 'intro', id: id}, function (data, status) {

        if (status == "success") {
            var Obj = JSON.parse(data);
            var headObj = Obj.head;
            var co = Obj.data;
            var uni_rank = Obj.uni_rank;
            var all_rank = Obj.all_rank;
            var iconArr = Obj.icon5;

            $('.club-pic').css({"background-image": "url('" + co.club_pic + "')"});
            $('.club-id').text(id + "号");
            $('.club-name').text(co.club_name);
            $('.club-from').text(co.club_from);
            $('.club-fav-count .num').text(co.club_fav_count);
            $('.uni-rank').text("校内排名：" + uni_rank);
            $('.all-rank').text("全榜排名：" + all_rank);
            $('.club-detail').text(co.club_detail);
            $('.user-icon').each(function (index) {
                $(this).css({
                    "background-image": "url('" + iconArr[index] + "')"
                });
            })
        }

    });
}

function output(m) {
    console.log(m);
}
function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}
function reDirect() {

    //此处上线时更改为包含域名的url
    //如 vote.szer.me/introduction.html?id= (id的值不填)
    //在网上找工具使用urlEncode对url进行编码
    var redirect_url = 'http%3a%2f%2f192.168.191.1%2fGroupVote%2fintroduction.html%3fid%3d' +
        getQueryString('id');

    //修改appid
    var appid = 'wxc436ffe11940b43a';

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?' +
        'appid=' + appid +
        '&redirect_uri=' + redirect_url +
        '&response_type=code&scope=snsapi_base';

    output(url);
    sessionStorage.setItem('isRedirect', true);
    window.location.href = url;

}