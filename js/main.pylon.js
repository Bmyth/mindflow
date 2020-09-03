var Pylon = {
    status: 'NORMAL',
    node: null,
    init: _pylon_init,
    executeOption: _pylon_executeOption,
    setStatus: _pylon_setStatus,
    refreshView: _pylon_refreshView
}

var Comp = {};

var timeCount = 0;
var timeSecondCount = 0;
var timeMinuteCount = 0;

function _pylon_init(){
    //init canvas
    $("#front-canvas").css({
        width: windowWidth,
        height: windowHeight
    })
    var FrontPaper = new paper.PaperScope();
    FrontPaper.setup($("#canvas")[0]);
    FrontPaper.install(window);

    itemProtoTypeInject();
    nodeProtoTypeInject();

    //init comp
    Comp.map.init();
    Comp.space.init();
    Comp.entry.init();
    Comp.path.init();
    Comp.list.init();
    Comp.assistUI.init();
    Comp.console.init();

    //init event
    window.onkeydown = _pylon_keyPress;
    view.onMouseDown = _pylon_mouseDown;
    $(document).mousemove(_.throttle(function(e){
        _pylon_mouseMove(e);
    }, 100));
}

function _pylon_keyPress(event){
    var e  = event  ||  window.e;          
　　 var key = e.keyCode || e.which;
    if(event.target.tagName != 'BODY'){
        return;
    }
    console.log('press key:' + key);
    //enter: pass to entry enter
    if(key == 13 && Comp.entry.on){
        Comp.entry.enter();
    }
    //e: start edit pop
    if(key == 69 && Pylon.status == 'NODE_ON_HOVER'){
        _vc_optionEdit(Pylon.node);
    }
    //del
    else if(key == '8' && Pylon.status == 'NODE_ON_HOVER'){
        _pylon_optionDelete(Pylon.node);
    }
    //s: branch
    else if(key == '83' && Pylon.status == 'NODE_ON_HOVER'){
        _pylon_optionBranch();
    }
    //esc: reset to normal
    else if(key == '27'){
        _pylon_reset();
    }
}

function _pylon_executeOption(obj, option, param){
    if(option == 'trackNode'){
        _pylon_trackNode(obj);
    }
    if(option == 'edit'){
        _vc_optionEdit(obj);
    }
    if(option == 'branch'){
        _pylon_optionBranch(obj, param);
    }
    if(option == 'cancelEdit'){
        _pylon_cancelEdit();
    }
    if(option == 'delete'){
        _pylon_optionDelete(obj);
    }
    if(option == 'hoverNode'){
        _pylon_hoverNode(obj);
    }
    if(option == 'unHoverNode'){
        _pylon_unHoverNode(obj);
    }
    if(option == 'reset'){
        _pylon_reset();
    }
    
}

function _pylon_trackNode(idx){
    Model.trackNodeInPath(idx);
}

function _vc_optionEdit(node){
    Comp.entry.show({editNode: node});
    _pylon_setStatus('NODE_ON_EDIT');
}

function _pylon_optionDelete(node){
    node.mouseLeave();
    Comp.space.deleteNode(node.uid);
    _pylon_setStatus('NORMAL');
}

function _pylon_optionBranch(position){
    _pylon_setStatus('NODE_ON_BRANCH');
    Pylon.node.mouseLeave();
    Comp.mouseMarker.startTrack(Pylon.node, position);
}

function _pylon_hoverNode(node){
    _pylon_setStatus('NODE_ON_HOVER');
    Pylon.node = node;
}

function _pylon_unHoverNode(){
    if(Pylon.status == 'NODE_ON_HOVER'){
        _pylon_setStatus('NORMAL');
    }
}

function _pylon_reset(){
    if(Pylon.status == 'NODE_ON_BRANCH'){
        Comp.mouseMarker.finishTrack();
    }
    _pylon_setStatus('NORMAL');
    Comp.entry.hide();
    Pylon.node && Pylon.node.mouseLeave();
    Pylon.node && Pylon.node.highlight(false);
}

function _pylon_setStatus(status){
    Pylon.status = status;
    Comp.console.refresh();
}

function _pylon_mouseDown(event){
    Comp.entry.hide();
    if(event.target.name != 'mask'){
        // if(!Comp.map.testHitPos(event.point)){
        //     return;
        // }
        Comp.anchor.show({x:event.point.x, y:event.point.y})
        Comp.entry.show();
        Comp.mouseMarker.finishTrack();
        if(Pylon.status == 'NORMAL'){
            _pylon_setStatus('NODE_ON_CREATE');
        }else if(Pylon.status == 'NODE_ON_BRANCH'){
            Comp.mouseMarker.finishTrack();
            _pylon_setStatus('NODE_ON_CREATE_BRANCH');
        }
    }
}

function _pylon_mouseMove(event){
    if(event.srcElement.id == 'canvas' && Pylon.status == 'NODE_ON_BRANCH'){
        Comp.mouseMarker.updateTrack({x:event.offsetX, y:event.offsetY});
    }
}

function _pylon_refreshView(partial){
    if(partial.indexOf('space') >= 0 || partial == 'all'){
        Comp.space && Comp.space.refresh();
    }
    if(partial.indexOf('path') >= 0 || partial == 'all'){
        Comp.path && Comp.path.refresh();
    }
    if(partial.indexOf('list') >= 0 || partial == 'all'){
        Comp.list && Comp.list.refresh();
    }
}


