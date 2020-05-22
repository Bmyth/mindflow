var onTrackRootPop = null;
var onHoverPop = null;
var onEditPop = null;
var onBranchingPop = null;
var onHoverOrbitIndex = null;

var ViewController = {
	init: _vc_init,
    executeOption: _vc_executeOption
};

function _vc_init() {    
    Stage.init();
    window.onkeydown = onKeyPress;
    view.onMouseDown = _vc_onMouseDown;
    view.onMouseMove = _.throttle(function(e){
    	_vc_onMouseMove(e);
    }, 100);
    view.onFrame = Stage.onFrame;
}

function _vc_onMouseDown(event){
    if(event.target._id != 'front-canvas'){
        return;
    }
    if(Stage.textPanel.hide()){
        return;
    }
    // if(!Pops.crowdCheck(event.point)){
    //     return;
    // }
	if(onBranchingPop){
        Stage.inputPanel.show({point:event.point, status:'createChildNode', pop:onBranchingPop});
		Stage.mouseTracker.finishTrack();
        onBranchingPop = null;
	}else if(onHoverOrbitIndex != null){
        if(!Stage.orbits.testOccupied(onHoverOrbitIndex)){
            ViewController.executeOption(onHoverOrbitIndex, 'createRootNode');
        }else{
            ViewController.executeOption(onHoverOrbitIndex, 'trackRootNode');
        }
    }
}

function _vc_onMouseMove(event){
    Stage.mouseTracker.updateTrack(event.point);
	var orbitIndex = Stage.orbits.testOrbit(event.point);
    if(orbitIndex != null && onHoverOrbitIndex != orbitIndex){
        Stage.orbits.highlightOrbit(orbitIndex);
        Stage.hint.infoCase('hoverNotUseOrbit');
    }else if(orbitIndex == null && onHoverOrbitIndex != null){
        Stage.orbits.fade();
    }
    Stage.adjustAccordingMouse(event.point);
}

function onKeyPress(event){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
    if(event.target.tagName != 'BODY'){
        return;
    }
    console.log('press key:' + key);
    Stage.textPanel.hide();
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
    //y: color
    else if(key == '89' && onHoverPop && onHoverPop.ridx){
        _vc_editRootColor(onHoverPop);
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

function _vc_trackRootNode(ridx){
    var pt = Model.getModelByRidx(ridx);
    onTrackRootPop = Pops.getPopByIndex(pt.idx);
    Stage.rotating = false;
    Stage.rotateToPop(pt.idx);
    Pops.updateTree(Model.getModelByRidx(ridx));
}

function _vc_optionEdit(pop){
    var popText = pop.children['popText'];
    popText.popTextHide();
    editPos = new Point(popText.position.x, popText.position.y);
    Stage.inputPanel.show({point:editPos, val:pop.t, status:'editNode', pop:pop});
}

function _vc_optionBranch(pop, position){
    onBranchingPop = pop;
    Stage.mouseTracker.startTrack(onBranchingPop, position);
}

function _vc_optionDelete(pop){
    Stage.meteor.fallFrom(pop);
    pop.deletePop();
    Model.deletePop(pop);
    Stage.orbits.refresh();
    onHoverPop = null;
}

function _vc_optionConnectStart(pop, position){
    onEditPop = pop;
    Stage.mouseTracker.startTrack(onEditPop, position);
}

function _vc_optionConnectFinish(pop){
    Stage.mouseTracker.finishTrack();
    Model.connectPop(onEditPop, pop);
    onEditPop.updatePopModel();
    onEditPop = null;
}

function _vc_optionMoveToConnectPop(pop){
    Stage.setStatus('');
    pop.mouseLeavePopText();
    var idx = pop.c;
    Stage.moveCenterToPop(idx); 
}

function _vc_editAppendText(pop){
    onEditPop = pop;
    var popText = pop.children['popText'];
    Stage.optionCircle.hide();
    Stage.textPanel.edit(popText, pop.idx);
    Stage.setStatus('onEditAppendText');
}

function _vc_optionShowAppendText(pop){
    Stage.textPanel.show(pop.children['popText'], pop.idx);
}

function _vc_createRooNode(ridx){
    var r = Stage.orbits.getOrbitRadius(ridx);
    var point = {x:r, y: view.size.height * 0.5}
    Stage.inputPanel.show({point:point, status:'createRootNode', rootIdx: ridx});
    Stage.setStatus('onEdit');
}

function _vc_editRootColor(){
    Stage.colorPicker.show({point:onHoverPop.position, pop:onHoverPop});
    onHoverPop = null;
    Stage.rotating = false;
}

function _vc_setRootColor(pop, color){
    Model.setRootColor(pop.idx, color);
    Stage.orbits.refresh();
    pop.updatePopModel();
}