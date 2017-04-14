/**
 * Created by Siro on 2017/4/2.
 */
//init scroller
function initScroller(target) {
    if (target == null) {
        target = '#main-content';
    }

    if (target == '#main-content') {
        var mainScroll = new IScroll(target
            , {
                click: true,
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true,
                probeType: 2
            }
        );
        // output("Max: " + mainScroll.maxScrollY);
        // output("Min: " + mainScroll.minScrollY);

        // “下拉刷新，上拉加载更多” 逻辑：
        //status = 0, 1 ,2 为的是防止事件的多次触发，以及协调事件之间的执行（在刷新的时候就不能去加载更多）

        //下拉刷新：
        //this.y > 40
        // ——>  status = 1, add 'refresh', 进入refresh状态, 更新label "松手刷新数据"
        // ——> （松开手指, scrollEnd)  remove 'refresh', add 'loading'  进入loading状态, status = 2, 更新label '正在刷新' ,执行刷新函数pullDownAction

        //上拉(往上滑)
        //this.y > 0.9 * maxScrollY)
        // ——> status = 1, add 'refresh', 进入refresh状态, 更新label "正在载入", 执行加载函数pullUpAction

        var status = 0;
        var mainContent = $('#main-content'),
            pullDown = $('.pullDown'),
            pullDownLabel = $('.pullDownLabel'),
            pullUp = $('.pullUp'),
            pullUpLabel = $('.pullUpLabel'),
            container = $('#main-content .scroller .content');

        //scroll事件，手指按住屏幕滑动，但未松手
        mainScroll.on('scroll', function () {
            if (status == 0 && !pullDown.attr('class').match('refresh|loading') && !pullUp.attr('class').match('refresh')) {
                if (this.y > 50) {
                    status = 1;
                    pullDownLabel.text('松手刷新数据');
                    pullDown.addClass('refresh');

                    output('Refresh: ' + this.y);
                }
                else if (this.y <= this.maxScrollY) {
                    status = 1;
                    pullUpLabel.text('正在加载....');
                    pullUp.addClass('refresh');
                    pullUpAction();
                }
            }

        });
        //滚动完成事件
        mainScroll.on('scrollEnd', function () {
            if (status == 1) {
                if (pullDown.hasClass('refresh')) {
                    status = 2;
                    pullDown.removeClass('refresh').addClass('loading');
                    pullDownLabel.text('正在刷新....');
                    pullDownAction();
                }
            }
        });


        function pullDownAction() {
//    .....................
            mainContent.loadingAnimation('show');
            setTimeout(function () {
                mainScroll.refresh();
                status = 0;
                pullDown.removeClass('loading');
                pullDownLabel.text('下拉刷新');
                mainContent.loadingAnimation('hide');
            }, 200);


        }

        function pullUpAction() {
            mainContent.loadingAnimation('show');

            //get idsArray
            var idArrays = new Array();
            $('#main-content .club-id').each(function () {
                idArrays.push(Number($(this).text()));
            });
            output(idArrays);
//      ajax异步加载更多内容，返回json数据，数据格式之后再进行约定，一次加载7个
//      数据应包含：club-pic(图片的url)、club_id、club_name、club_from（哪所学校）、club_fav_count
            $.get('controller/json.php', {type: 'loadmore', ids: idArrays}, function (data, status) {

                output("Original: " + data);

                if (status == "success") {
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
                    }
                    else{
                        output(headObj.extraInfo);
                    }

                    refreshClubClickEvent();
                    mainScroll.refresh();
                    status = 0;
                    pullUp.removeClass('refresh');
                    pullUpLabel.text('加载更多');
                    mainContent.loadingAnimation('hide');

                }
                else {
                    output('Load more falied');
                }
            });

//--------------------       离线测试用代码------------------------------
//
//             setTimeout(function () {
//                 //append
//                 for (var i = 0; i < 7; i++) {
//                     appendIntoMainContent();
//                 }
//
//             }, 500);


        }
    }
    else {
        var scroller = new IScroll(target
            , {
                click: true,
                scrollbars: true,
                mouseWheel: true,
                interactiveScrollbars: true,
                shrinkScrollbars: 'scale',
                fadeScrollbars: true,
            }
        );
        return scroller;
    }

}