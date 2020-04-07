var onHoverPop = null;
var onAssociatePop = null;
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
	if(Stage.status == 'branch'){
		Stage.associateLink.finishAssociate();
	}
	if(Stage.status == '' || Stage.status == 'branch'){
		editPos = event.point;
		Stage.inputPanel.show(event.point);
		Stage.setStatus('onEdit');
	}
    if(Stage.status == 'onEdit'){
        editPos = event.point;
        Stage.inputPanel.show(event.point);
    }
}

function _vc_onMouseMove(event){
	if(Stage.status == 'branch'){
		Stage.associateLink.updateAssociate(event.point);
	}
}

function onKeyPress(event){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
    if(event.target.tagName == 'INPUT'){
        return;
    }
    //e: start edit pop
	else if(key == 69 && Stage.status == 'PopHover'){
        _vc_optionEdit(onHoverPop);
    }
    //del
    else if(key == '8' && Stage.status == 'PopHover'){
        _vc_optionDelete(onHoverPop);
    }
    //b: branch
    else if(key == '66' && Stage.status == 'PopHover'){
        _vc_optionBranch(onHoverPop);
        onHoverPop = null;
    }
    //esc: cancal associate
    else if(key == '27' && Stage.status == 'branch'){
        Stage.setStatus('');
        Stage.associateLink.finishAssociate();
    }
    //rotate right
    else if(key == '39' && Stage.status == ''){
        Stage.setStatus('viewChanging');
        rotatingDegree = rotateD;
    }
    //rotate right
    else if(key == '37' && Stage.status == ''){
        Stage.setStatus('viewChanging');
        rotatingDegree = -rotateD;
    }
    //move up
    else if(key == '38' && Stage.status == ''){
       Stage.setStatus('viewChanging');
       movingLen = moveD;
    }
    //move down
    else if(key == '40' && Stage.status == ''){
      	Stage.setStatus('viewChanging');
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
}

function _vc_optionEdit(pop){
    onEditPop = pop;
    var popText = pop.children['popText'];
    ViewController.onMouseEnterPop();
    popText.popTextHide();
    editPos = new Point(popText.position.x, popText.position.y);
    Stage.inputPanel.show(editPos, popText.ele.text());
    Stage.setStatus('onEdit');
}

function _vc_optionBranch(pop, position){
    Stage.setStatus('branch');
    onAssociatePop = pop;
    Stage.associateLink.startAssociate(onAssociatePop, position);
}

function _vc_optionDelete(pop){
    Stage.optionCircle.hide();
    Stage.meteor.fallFrom(pop);
    Model.deletePop(pop);
    Pops.paint();
    Stage.console.info('node delete');
    Stage.setStatus('');
}