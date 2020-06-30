var onBoardRootIdx = null;
var onHoverPop = null;
var onEditPop = null;
var onBranchingPop = null;

var ViewController = {
	init: _vc_init,
    executeOption: _vc_executeOption
};

function _vc_init() {    
    window.onkeydown = onKeyPress;
    view.onMouseDown = _vc_onMouseDown;
    $(document).mousemove(_.throttle(function(e){
    	_vc_onMouseMove(e);
    }, 100));

    Comp.newBtn.click(function(){
        _vc_executeOption(null, 'createRootNode');
    });
}

function _vc_onMouseDown(event){
    if(event.target._id != 'front-canvas'){
        return;
    }

    if(onBoardRootIdx == null){
        return;
    }
    // if(Comp.textPanel.hide()){
    //     return;
    // }
    onBranchingPop = onBranchingPop || Comp.board.getNodeByIndex(onBoardRootIdx);
    Comp.inputPanel.show({point:event.point, status:'createChildNode', pop:onBranchingPop});
    Comp.mouseTracker.finishTrack();
    onBranchingPop = null;
    return;
}

function _vc_onMouseMove(event){
    if(event.srcElement.id == 'middle-canvas'){
        Comp.mouseTracker.updateTrack({x:event.offsetX, y:event.offsetY});
    }
}

function onKeyPress(event){
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
    else if(key == '8' && onHoverPop){
        _vc_optionDelete(onHoverPop);
    }
    //s: branch
    else if(key == '83' && onHoverPop){
        _vc_optionBranch(onHoverPop);
        onHoverPop = null;
    }
    //c: branch
    else if(key == '67' && Stage.status == 'PopHover'){
        _vc_optionConnectStart(onHoverPop);
        onHoverPop = null;
    }
    //t: append text
    else if(key == '84' && Stage.status == 'PopHover'){
        _vc_editAppendText(onHoverPop);
        onHoverPop = null;
    }
    //esc: cancel branch
    else if(key == '27' && onBranchingPop){
        Stage.mouseTracker.finishTrack();
        onBranchingPop = null;
    }
    //esc: cancel track
    else if(key == '27' && onTrackRootPop){
        var idx = onTrackRootPop.idx;      
        onTrackRootPop = null;
        Pops.updateTree(Model.getPop(idx));
        Stage.optionCircle.hide();
        Stage.mouseTracker.finishTrack();
        Stage.rotating = true;
        Stage.saveParams();
    }
    //rotate up
    else if(key == '38'){
       rotatingDegree = rotateD;
    }
    //rotate down
    else if(key == '40'){
       	rotatingDegree = -rotateD;
    }
}

function _vc_executeOption(obj, option, param){
    if(option == 'trackRootNode'){
        _vc_trackRootNode(obj);
    }
    if(option == 'edit'){
        _vc_optionEdit(obj);
    }
    if(option == 'branch'){
        _vc_optionBranch(obj, param);
    }
    if(option == 'delete'){
        _vc_optionDelete(obj);
    }
    if(option == 'connectStart'){
        _vc_optionConnectStart(obj, param);
    }
    if(option == 'connectFinish'){
        _vc_optionConnectFinish(obj);
    }
    if(option == 'moveToConnectPop'){
        _vc_optionMoveToConnectPop(obj);
    }
    if(option == 'showAppendText'){
        _vc_optionShowAppendText(obj);
    }
    if(option == 'createRootNode'){
        _vc_createRooNode(obj);
    }
    if(option == 'setRootColor'){
        _vc_setRootColor(obj, param);
    }
}

function _vc_trackRootNode(idx){
    onBoardRootIdx = idx;
    Comp.cubes.updateCubeFloat();
    Comp.board.refresh();
}

function _vc_optionEdit(pop){
    var popText = pop.children['popText'];
    popText.popTextHide();
    editPos = new Point(popText.position.x, popText.position.y);
    Comp.inputPanel.show({point:editPos, val:pop.t, status:'editNode', pop:pop});
}

function _vc_optionBranch(pop, position){
    onBranchingPop = pop;
    Comp.mouseTracker.startTrack(onBranchingPop, position);
}

function _vc_optionDelete(node){
    var rootNode = node.level == 0;
    Model.deleteNode(node);
    if(rootNode){
        onBoardRootIdx = null;
    }
    Pylon.refresh();
    onHoverPop = null;
    Comp.optionCircle.hide();
}

function _vc_optionConnectStart(pop, position){
    onEditPop = pop;
    Comp.mouseTracker.startTrack(onEditPop, position);
}

function _vc_optionConnectFinish(pop){
    Comp.mouseTracker.finishTrack();
    Model.connectPop(onEditPop, pop);
    onEditPop.updatePopModel();
    onEditPop = null;
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

function _vc_createRooNode(){
    Comp.newBtn.fadeOut();
    var point = {x:20, y: 20}
    Comp.inputPanel.show({point:point, status:'createRootNode', weight: 0});
}