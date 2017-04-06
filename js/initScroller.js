/**
 * Created by Siro on 2017/4/2.
 */
function initScroller(e,target) {
    if(target == null){
        target = '#main-content';
    }
    var mainScroll = new IScroll(target
        , {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true,
            probeType: 2
        }
    );
    output("Max: " + mainScroll.maxScrollY);
    mainScroll.on('scroll',function () {
        output(this.y);
    })


}
