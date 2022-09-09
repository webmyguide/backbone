var evtStartName = ('ontouchstart' in window) ? 'touchstart' : 'mousedown';
var evtMoveName  = ('ontouchmove'  in window) ? 'touchmove'  : 'mousemove';
var evtOutName   = ('ontouchend'   in window) ? 'touchend'   : 'mouseout';
var evtEndName   = ('ontouchend'   in window) ? 'touchend'   : 'mouseup';
var evtClickName   = ('ontouchstart'   in window) ? 'touchend'   : 'click';

function log(consoleLog) {
    if(window.debugMode != 1){
        return false;
    }
}
