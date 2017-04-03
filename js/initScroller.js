/**
 * Created by Siro on 2017/4/2.
 */
function loaded() {
    var myScroll = new IScroll('.main-content'
        , {
            scrollbars: true,
            mouseWheel: true,
            interactiveScrollbars: true,
            shrinkScrollbars: 'scale',
            fadeScrollbars: true
        }
    );
};
window.onload = loaded;