var onTrackRootPop = null;
var onHoverPop = null;
var onEditPop = null;
var mouseOnOrbitIndex = null;

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
    // if(Stage.status == 'onEdit'){
    //     Stage.inputPanel.show(event.point);
    // }
	if(Stage.status == 'onBranchNodePick'){
        Stage.inputPanel.show({point:event.point, status:'createChildNode', relateNode:onEditPop});
        Stage.setStatus('onEdit');
		Stage.mouseTracker.finishTrack();
	}else if(mouseOnOrbitIndex != null && !Stage.orbits.testOccupied(mouseOnOrbitIndex)){
        ViewController.executeOption(mouseOnOrbitIndex, 'createRootNode');
    }
	// else if(Stage.status == ''){
	// 	Stage.inputPanel.show({point:event.point, status:'createRootNode'});
	// 	Stage.setStatus('onEdit');
	// }

}

function _vc_onMouseMove(event){
	if(Stage.status == 'onBranchNodePick' || Stage.status == 'onConnectNodePick'){
		Stage.mouseTracker.updateTrack(event.point);
	}else{
        mouseOnOrbitIndex = Stage.orbits.testOrbit(event.point);
        if(mouseOnOrbitIndex != null){
            Stage.orbits.highlightOrbit(mouseOnOrbitIndex);
        }else{
            Stage.orbits.fade();
        }
    }
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
	if(key == 69 && Stage.status == 'PopHover'){
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
    else if(key == '27' && Stage.status == 'onBranchNodePick'){
        Stage.setStatus('');
        Stage.mouseTracker.finishTrack();
    }
    //esc: cancel track
    else if(key == '27' && onTrackRootPop){
        var idx = onTrackRootPop.idx;      
        onTrackRootPop = null;
        Pops.updateTree(Model.getPop(idx));
        Stage.optionCircle.hide();
        Stage.mouseTracker.finishTrack();

        Stage.rotating = true;
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

function _vc_executeOption(obj, option, position){
    if(option == 'trackPop'){
        _vc_trackPop(obj);
    }
    if(option == 'edit'){
        _vc_optionEdit(obj);
    }
    if(option == 'branch'){
        _vc_optionBranch(obj, position);
    }
    if(option == 'delete'){
        _vc_optionDelete(obj);
    }
    if(option == 'connectStart'){
        _vc_optionConnectStart(obj, position);
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
}

function _vc_trackPop(rootPop){
    onTrackRootPop = rootPop;
    Stage.rotating = false;
    Pops.updateTree(Model.getPop(rootPop.idx));
}

function _vc_optionEdit(pop){
    onEditPop = pop;
    var popText = pop.children['popText'];
    ViewController.onMouseEnterPop();
    popText.popTextHide();
    editPos = new Point(popText.position.x, popText.position.y);
    Stage.inputPanel.show(editPos, onEditPop.t);
    Stage.setStatus('onEdit');
}

function _vc_optionBranch(pop, position){
    Stage.setStatus('onBranchNodePick');
    onEditPop = pop;
    Stage.mouseTracker.startTrack(onEditPop, position);
}

function _vc_optionDelete(pop){
    Stage.meteor.fallFrom(pop);
    pop.deletePop();
    Model.deletePop(pop);
    Stage.popIndex.refresh();
    onHoverPop = null;
    Stage.console.info('node delete');
}

function _vc_optionConnectStart(pop, position){
    Stage.setStatus('onConnectNodePick');
    onEditPop = pop;
    Stage.mouseTracker.startTrack(onEditPop, position);
}

function _vc_optionConnectFinish(pop){
    Stage.setStatus('');
    Stage.mouseTracker.finishTrack();
    Model.connectPop(onEditPop, pop);
    onEditPop.updatePopModel();
    onEditPop = null;
    Stage.console.info('connection created');
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

function _vc_createRooNode(idx){
    var r = Stage.orbits.getOrbitRadius(idx);
    var point = {x:r, y: view.size.height * 0.5}
    Stage.inputPanel.show({point:point, status:'createRootNode', rootIdx: idx});
    Stage.setStatus('onEdit');
}