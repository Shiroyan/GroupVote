/**
 * Created by Siro on 2017/3/24.
 */
$(document).ready(function () {

    var mainTab = $('.main-tab');
    var selfTab = $('.self-tab');
    var allTab = $('.all-tab');
    var mainCon = $('.main-content');
    var selfCon = $('.self-content');
    var allCon = $('.all-content');

    //与“ 社团介绍页面” 之间的通讯（利用sessionStorage）
    //在“社团介绍界面”中点击 “主会场” 和 “排行榜”按钮进行跳转到主页中的指定区域

    //向服务器发送请求，获取 榜单/主会场等数据
    $(window).on('load',function () {
        //检查sessionStorage中是否存在key “trigger”
        //若存在则说明是从介绍页面跳转过来的~
        var type = sessionStorage.getItem('trigger');
        output(type);
        if(type == 'main'){
            mainTab.click();
        }
        else if(type == 'rank'){
            selfTab.click();
        }
        //跳转成功过后，删除trigger，以免影响后续的浏览
        sessionStorage.removeItem('trigger');


    //    ......................................
    });
    //处理搜索时间
    $('.search-btn').on('click',function () {
       var searchContent = $('.search-content').val();
       $.get("./controller/search.php",{search: searchContent},function (data,status) {
           // output(searchContent);

           $(".active-content").removeClass("active-content");
           $(".active-tab").removeClass("active-tab");
           $(".main-tab").addClass("active-tab");
           $(".result-content").addClass("active-content");

           var temp = "";
           for(var i = 0; i < 3; i++){
               temp += ('<div class="col-xs-6 col-sm-4 col-md-3 col-lg-2">' +
                   '<!-- 社团展示 --> <div class="group"> <div class="group-picture"> <img src="images/group_pic.png" alt="社团图片"> </div>' +
                   '<div class="group-header"> <p class="order"> No.001</p> </div> <div class="group-mask"> <img src="images/white-heart.png">' +
                   '<p class="fav-count">223</p> </div> <div class="group-footer"> <p class="text-center name">街头传播协会</p> </div> </div> </div>');
           }
           $('.result-content').html(temp);

           if(status == "success"){
        	   $('.result-content').html(data);

           }
       })
    });
    //处理标签点击后页面切换
    mainTab.on('click',function () {
        removeActive('.main');
    });
    selfTab.on('click',function () {
        removeActive('.self');
    });
    //只生效一次，请求后暂存在sessionStorage中，用户下次点击是不会再次请求，而是从Storage中获取
    // selfTab.one('click',function () {
    //     //这里你只需要把第一个参数改成你服务器的地址
    //     //这里相当于是： http://192.168.220.129:8888/?type=self-rank-info
    //     $.get('http://192.168.220.129:8888',{type:"self-rank-info"},function (data,status) {
    //         //data 为返回的json字符串
    //         if(status == "success"){
    //             var data_obj = JSON.parse(data);// 把data转化为 json对象
    //             output(data);
    //
    //             sessionStorage.setItem('self_content',data);
    //
    //             //szu
    //             var temp = data_obj.szu;
    //             // output(temp.length);
    //             for(var i=0; i < temp.length;i++){
    //                 var target = $('.university-1 .table-row-' + (i+1));
    //                 target.find('.name').text(temp[i].name);
    //                 target.find('.fav-count').text(temp[i].count);
    //             }
    //
    //             //hku
    //             var temp = data_obj.hku;
    //             // output(temp.length);
    //             for(var i=0; i < temp.length;i++){
    //                 var target = $('.university-2 .table-row-' + (i+1));
    //                 target.find('.name').text(temp[i].name);
    //                 target.find('.fav-count').text(temp[i].count);
    //             }
    //         }
    //         else{//err
    //             output(data,status);
    //         }
    //     });
    // });
    allTab.on('click',function () {
        removeActive('.all');
    });
    // allTab.one('click',function () {
    //     $.get('http://192.168.220.129:8888',{type:"all-rank-info"},function (data,status) {
    //         if(status == "success"){
    //             sessionStorage.setItem('all_content',data);
    //             output(data);
    //             var data_obj = JSON.parse(data);
    //             var info = data_obj.info;
    //
    //             output(info.length);
    //
    //             var container = $('.all-uni-rank-table');
    //             for(var i = 0; i < info.length; i++){
    //                 var tempInfo = info[i];
    //                 var html = '<div class="table-row"><div class="col-xs-6"><img src="images/uni-logo.jpg" class="img-circle uni-logo"><a class="name">' +
    //
    //                     tempInfo.name +
    //
    //                     '</a></div><div class="col-xs-4"><img src="images/yellow-heart.png" class="fav-icon"><p class="fav-count">' +
    //
    //                     tempInfo.count +
    //
    //                     '</p></div><div class="col-xs-2"><p class="rank">' +
    //
    //                     (i+1) +
    //
    //                     '</p></div></div>';
    //
    //                 container.append(html);
    //             }
    //         }
    //         else{//err
    //             output(data,status);
    //         }
    //     });
    // });
    //处理主会场“缩略图”点击的事件
    //利用sessionStorage记录好已有的信息~ 并进行跳转到“介绍”界面
    $('.group').on('click',groupHandler);

//    处理主会场内容滚动事情，异步请求新的数据
//    ..................................


//    处理 校榜&全榜 中 社团名点击事件
//     $('.university-1 .name, .university-2 .name, .university-3 .name').on('click',function () {
//         window.location.href="introduction.html";
//
//     });
//     $('.all-uni-rank-table .name').on('click',function () {
//         window.location.href="introduction.html";
//     });
});

function removeActive(target) {
    $(".active-content").removeClass("active-content");
    $(".active-tab").removeClass("active-tab");
    $(target + "-tab").addClass("active-tab");
    $(target + "-content").addClass("active-content");
}
function groupHandler() {
    var group = $(this);

    var order = Number(group.find('.order').text().slice(4));
    window.location.href="introduction.php?id=" + order;
}
function output(m) {
    console.log(m);
}