var onHoverPop = null;
var onEditPop = null;
var editPos = null;

var ViewController = {
	init: _vc_init,
	onMouseEnterPop: _vc_onMouseEnterPop,
	onMouseLeavePop: _vc_onMouseLeavePop,
    executeOption: _vc_executeOption
};

function _vc_init() {    
    Stage.init();
    window.onkeydown = onKeyPress;
    view.onMouseDown = _vc_onMouseDown;
    view.onMouseMove = _.throttle(function(e){
    	_vc_onMouseMove(e);
    }, 50);
    view.onFrame = Stage.onFrame;
}

function _vc_onMouseEnterPop(pop){
    onHoverPop = pop;
    Stage.setStatus('PopHover');
}

function _vc_onMouseLeavePop(){
	if(Stage.status == 'PopHover'){
		onHoverPop = null;
	    Stage.setStatus('');
	}
}

function _vc_onMouseDown(event){
    if(event.target._id != 'front-canvas'){
        return;
    }
    if(Stage.textPanel.hide()){
        return;
    }
    if(!Pops.crowdCheck(event.point)){
        return;
    }
	if(Stage.status == 'onBranchNodePick'){
		Stage.mouseTracker.finishTrack();
	}
	if(Stage.status == '' || Stage.status == 'onBranchNodePick'){
		editPos = event.point;
		Stage.inputPanel.show(event.point);
		Stage.setStatus('onBranchEdit');
	}
    if(Stage.status == 'onEdit' || Stage.status == 'onBranchEdit'){
        editPos = event.point;
        Stage.inputPanel.show(event.point);
    }
}

function _vc_onMouseMove(event){
	if(Stage.status == 'onBranchNodePick' || Stage.status == 'onConnectNodePick'){
		Stage.mouseTracker.updateTrack(event.point);
	}
}

function onKeyPress(event){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
    if(event.target.tagName != 'BODY'){
        return;
    }
    console.log(key)
    Stage.textPanel.hide();
    //e: start edit pop
	if(key == 69 && Stage.status == 'PopHover'){
        _vc_optionEdit(onHoverPop);
    }
    //del
    else if(key == '8' && Stage.status == 'PopHover'){
        _vc_optionDelete(onHoverPop);
    }
    //s: branch
    else if(key == '83' && Stage.status == 'PopHover'){
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
    //esc: cancel connect
    else if(key == '27' && Stage.status == 'onConnectNodePick'){
        Stage.setStatus('');
        Stage.optionCircle.hide();
        Stage.mouseTracker.finishTrack();
    }
    //rotate right
    else if(key == '39' && (Stage.status == '' || Stage.status == 'onConnectNodePick')){
        rotatingDegree = rotateD;
    }
    //rotate right
    else if(key == '37' && (Stage.status == '' || Stage.status == 'onConnectNodePick')){
        rotatingDegree = -rotateD;
    }
    //move up
    else if(key == '38' && (Stage.status == '' || Stage.status == 'onConnectNodePick')){
       movingLen = moveD;
    }
    //move down
    else if(key == '40' && (Stage.status == '' || Stage.status == 'onConnectNodePick')){
       	movingLen = -moveD;
    }
}

function _vc_executeOption(pop, option, position){
    if(option == 'edit'){
        _vc_optionEdit(pop);
    }
    if(option == 'branch'){
        _vc_optionBranch(pop, position);
    }
    if(option == 'delete'){
        _vc_optionDelete(pop);
    }
    if(option == 'connectStart'){
        _vc_optionConnectStart(pop, position);
    }
    if(option == 'connectFinish'){
        _vc_optionConnectFinish(pop);
    }
    if(option == 'moveToConnectPop'){
        _vc_optionMoveToConnectPop(pop);
    }
    if(option == 'showAppendText'){
        _vc_optionShowAppendText(pop);
    }
    
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
    Stage.popPanel.refresh();
    Stage.console.info('node delete');
    Stage.setStatus('');
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