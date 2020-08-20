var Pylon = {
    onHoverNode: null,
    onBranchingNode: null,
    init: _pylon_init,
    executeOption: _pylon_executeOption,
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

    view.onFrame = _render_onFrame;

    //init comp
    Comp.space.init();
    Comp.entry.init();
    Comp.path.init();
    Comp.list.init();
    Comp.assistUI.init();

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
    if(key == 69 && Pylon.onHoverNode){
        _vc_optionEdit();
    }
    //del
    else if(key == '8' && Pylon.onHoverNode && !(Pylon.onHoverNode.isPathNode && Pylon.onHoverNode.level > 0)){
        _pylon_optionDelete(Pylon.onHoverNode);
    }
    //s: branch
    else if(key == '83' && Pylon.onHoverNode && !(Pylon.onHoverNode.isPathNode && Pylon.onHoverNode.level > 0)){
        _pylon_optionBranch();
    }
    //t: append text
    else if(key == '84' && Stage.status == 'PopHover'){
        _vc_editAppendText(onHoverPop);
        onHoverPop = null;
    }
    //esc: cancel branch
    else if(key == '27' && Pylon.onBranchingNode){
        Comp.mouseMarker.finishTrack();
        onBranchingNode = null;
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
    if(option == 'delete'){
        _pylon_optionDelete(obj);
    }
    if(option == 'showAppendText'){
        _vc_optionShowAppendText(obj);
    }
}

function _pylon_trackNode(node){
    Model.trackNodeInPath(node);
    Comp.nodeRing.hide();
}

function _vc_optionEdit(){
    Comp.entry.show({editNode: Pylon.onHoverNode});
    Pylon.onHoverNode = null;
}

function _pylon_optionBranch(position){
    Pylon.onBranchingNode = Pylon.onHoverNode;
    Pylon.onHoverNode = null;
    Comp.mouseMarker.startTrack(Pylon.onBranchingNode, position);
}

function _pylon_optionDelete(node){
    Comp.space.deleteNode(node.uid);
    Pylon.onHoverNode = null;
    Comp.nodeRing.hide();
}

function _pylon_mouseDown(event){
    Comp.entry.hide();
    Pylon.onHoverNode = null;
    if(event.target._id == 'canvas'){
        Comp.anchor.show({x:event.point.x, y:event.point.y})
        Comp.entry.show();
        Comp.mouseMarker.finishTrack();
    }
}

function _pylon_mouseMove(event){
    if(event.srcElement.id == 'canvas' && Pylon.onBranchingNode){
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

function _render_onFrame(){
    timeCount += 1;
    if(timeCount == 60){
        timeCount = 0;
        timeSecondCount += 1;
        if(timeSecondCount == 60){
            timeSecondCount = 0;
            timeMinuteCount += 1;
        }
    }
}



