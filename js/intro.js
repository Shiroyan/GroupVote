/**
 * Created by Siro on 2017/3/28.
 */

//从主页跳转过来有2种类型
// 1. 从主会场跳转过来的
//    只需请求  归属、排名信息、社团介绍

// 2. 从榜单跳转过来的
//    什么都请求


$(document).ready(function () {
    $(window).on('load',function () {
       // type 1
       var data = JSON.parse(sessionStorage.getItem('group_info'));
       if(data != null){
           var group = $('.group');
           group.find('.order').text(" No. " + data.order);
           group.find('.group-picture > img').attr("src",data.imgSrc);
           $('.group-name').text(data.name);
           $('.fav-count').text(data.fav_count);
       }
       // type 2
       else {
       //     这里要怎么搞，看你了~
       }
    })
        .on('unload',function () {
            sessionStorage.removeItem('group_info');
        });

    $('.main').on('click',function () {
        sessionStorage.setItem('trigger','main');
    });

    //点赞，发送+1到服务器~
    $('.great').on('click',function () {

    //    已经登录
        var order = $('.order').text();

        var temp = localStorage.getItem(order);
        output(order + " " + temp);

        if(temp == null){
            localStorage.setItem(order,true);
            alert("点赞成功~");
            var fav_count = $('.fav-count');
            var count = Number(fav_count.text()) + 1;
            fav_count.text(count);
        }
        else{
            alert("你已为该社团点过赞~")
        }

    //    未登录
    //    …………………………
    });

    $('.rank-list').on('click',function () {
        sessionStorage.setItem('trigger','rank');
    });
});

function output(m) {
    console.log(m);
}