var Pylon = {
    onHoverNode: null,
    onBranchingNode: null,
    init: _pylon_init,
    executeOption: _pylon_executeOption
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
    Entry();
    MindPath();
    Board();
    AssistUI();

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
    //e: start edit pop
    if(key == 69 && onHoverPop){
        _vc_optionEdit(onHoverPop);
    }
    //del
    else if(key == '8' && Pylon.onHoverNode){
        _pylon_optionDelete(Pylon.onHoverNode);
    }
    //s: branch
    else if(key == '83' && Pylon.onHoverNode && !Model.isBaseSpace()){
        _pylon_optionBranch();
    }
    //t: append text
    else if(key == '84' && Stage.status == 'PopHover'){
        _vc_editAppendText(onHoverPop);
        onHoverPop = null;
    }
    //esc: cancel branch
    else if(key == '27' && Pylon.onBranchingPop){
        Stage.mouseTracker.finishTrack();
        onBranchingPop = null;
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
    if(node.isPathNode){
        Model.trackNodeInPath(node);
    }else{
        Model.addNodeInPath(node); 
    }
    Comp.nodeRing.hide();
}

function _vc_optionEdit(pop){
    var popText = pop.children['popText'];
    popText.popTextHide();
    editPos = new Point(popText.position.x, popText.position.y);
    Comp.inputPanel.show({point:editPos, val:pop.t, status:'editNode', pop:pop});
}

function _pylon_optionBranch(position){
    Pylon.onBranchingNode = Pylon.onHoverNode;
    Pylon.onHoverNode = null;
    Comp.mouseMarker.startTrack(Pylon.onBranchingNode, position);
}

function _pylon_optionDelete(node){
    Model.deleteNodeInSpace(node.idx);
    onHoverPop = null;
    Comp.nodeRing.hide();
}

function _vc_editAppendText(pop){
    onEditPop = pop;
    var popText = pop.children['popText'];
    Comp.optionCircle.hide();
    Comp.textPanel.edit(popText, pop.idx);
}

function _vc_optionShowAppendText(pop){
    Comp.textPanel.show(pop.children['popText'], pop.idx);
}

function _pylon_mouseDown(event){
    Comp.entry.hide();
    if(event.target._id == 'canvas'){
        if(Model.isBaseSpace() || Pylon.onBranchingNode){
            Comp.anchor.show({x:event.point.x, y:event.point.y})
            Comp.entry.show();
            Comp.mouseMarker.finishTrack();
        }
    }
}

function _pylon_mouseMove(event){
    if(event.srcElement.id == 'canvas' && Pylon.onBranchingNode){
        Comp.mouseMarker.updateTrack({x:event.offsetX, y:event.offsetY});
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



