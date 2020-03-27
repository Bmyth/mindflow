var onHoverPop = null;
var onAssociatePop = null;
var onEditPop = null;
var editPos = null;

var ViewController = {
	init: _vc_init,
	onMouseEnterPop: _vc_onMouseEnterPop,
	onMouseLeavePop: _vc_onMouseLeavePop
};

function _vc_init() {    
    Stage.init();
    document.onkeydown = onKeyPress;
    view.onMouseDown = _vc_onMouseDown;
    view.onMouseMove = _vc_onMouseMove;
    view.onFrame = Stage.onFrame;
}

function _vc_onMouseEnterPop(popText){
    onHoverPop = popText;
    Stage.setStatus('PopHover');
}

function _vc_onMouseLeavePop(){
	if(Stage.status == 'PopHover'){
		onHoverPop = null;
	    Stage.setStatus('');
	}
}

function _vc_onMouseDown(event){
	if(Stage.status == 'associate'){
		Stage.associateLink.finishAssociate();
	}
	if(Stage.status == '' || Stage.status == 'associate'){
		editPos = event.point;
		Stage.inputPanel.show(event.point);
		Stage.setStatus('onEdit');
	}
}

function _vc_onMouseMove(event){
	if(Stage.status == 'associate'){
		Stage.associateLink.updateAssociate(event.point);
	}
}

function onKeyPress(event){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
	//enter: finish enter
    if(key == 13 && Stage.status == 'onEdit'){
    	Stage.status = '';
        var text = Stage.inputPanel.input.val();
        //update pop
        if(onEditPop){
        	if(text){
		        var pt = {t:text};
	            Model.updatePop(onEditPop, pt);   
	            Pops.paint();
	        }else{
	        	onEditPop.opacity = 1;
	        }
        }
        //create new pop
        else{
        	if(text){
	        	var r = new Point(editPos.x,editPos.y).getDistance(Stage.rotateCenter) / Stage.galaxyRadius;
		        var v1 = new Point(editPos.x - Stage.rotateCenter.x, editPos.y - Stage.rotateCenter.y);
		        var v2 = new Point(-1, 0);
		        var angle = (v2.getDirectedAngle(v1) - Stage.degreeOffset + 360) % 360;
		        var date = new Date();
		        var pt = {t:text, r:r, d:angle, idx:date.getTime()};
	            if(onAssociatePop){
	            	Model.addPop(pt, onAssociatePop); 
	            }else{
	            	Model.addPop(pt); 
	            }   
	            Pops.paint();
	        }
        }
        Stage.inputPanel.hide();
        onEditPop = null;
        onAssociatePop = null;
    }
    //e: start edit pop
	else if(key == 69 && Stage.status == 'PopHover'){
		onEditPop = onHoverPop;
		var popText = onHoverPop.children['popText'];
		popText.mouseLeavePopText();
		popText.opacity = 0;
		editPos = new Point(popText.position.x, popText.position.y);
		Stage.inputPanel.show(editPos, popText.content);
		Stage.setStatus('onEdit');
    }
    //del
    else if(key == '8' && Stage.status == 'PopHover'){
    	Stage.meteor.fallFrom(onHoverPop);
        Model.deletePop(onHoverPop);
        Pops.paint();
        Stage.setStatus('');
    }
    //s: associate
    else if(key == '83' && Stage.status == 'PopHover'){
        Stage.setStatus('associate');
        onAssociatePop = onHoverPop;
        onHoverPop = null;
        Stage.associateLink.startAssociate(onAssociatePop);
    }
    //esc
    else if(key == '27' && Stage.status == 'associate'){
        Stage.setStatus('');
        Stage.associateLink.finishAssociate();
    }
    else if(key == '27' && Stage.status == 'onEdit'){
        Stage.setStatus('');
        if(onEditPop){
        	ViewController.mouseleavePop(onEditPop);
        	onEditPop.opacity = popTextOpacity;
        }
        onEditPop = null;
        Stage.inputPanel.hide();
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