/**
 * Created by Siro on 2017/4/11.
 */
$(document).ready(function () {

    //init introduction.html, get more info by id (on sessionStorage)
    init();
});

function init() {
    //get id
    var id = getQueryString('id');
    output(id);
    $('.club-id').text(id + "号");

    //send request
    // $.get('',{type: 'intro', id: id}, function (data,status) {
    //     var Obj = JSON.parse(data);
    //     var headObj = Obj.head;
    //     var co = Obj.data;
    //     var uni_rank = Obj.uni_rank;
    //     var all_rank = Obj.all_rank;
    //     var iconArr = Obj.icon5;
    //
    //     $('.club-pic').css({"background-image": "url('"+ co.club_pic + "')"});
    //     $('.club-id').text(id + "号");
    //     $('.club-name').text(co.club_name);
    //     $('.club-from').text(co.club_from);
    //     $('.club-fav-count .num').text(co.club_fav_count);
    //     $('.uni-rank').text("校内排名：" + uni_rank);
    //     $('.all-rank').text("全榜排名：" + all_rank);
    //     $('.club-detail').text(co.club_detail);
    //
    // });
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