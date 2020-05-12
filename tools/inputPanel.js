function InputPanel(){
	var inputbox = {};
	inputbox.ele = $('.edit-panel');
	inputbox.text = inputbox.ele.find('.edit-hint');
	inputbox.contentInput = $('.edit-panel #content-input');
	inputbox.contentInput.keydown(_input_contentKeydown);
	inputbox.show = _input_show;
	inputbox.hide = _input_hide;
	return inputbox;
}

function _input_contentKeydown(e){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
	var inputPanel = Stage.inputPanel;

	//enter: finish enter
	if(key == 13){
    	var text = inputPanel.contentInput.val();
        //update node
        if(inputPanel.status == 'editNode' && inputPanel.relateNode){
        	if(text){
		        var pt = {t:text};
	            Model.updatePop(onEditPop, pt);   
	            onEditPop.updatePopModel();
	        }else{
	        	onEditPop.children['popText'].popTextShow();
	        }
        }
        //create node
        else{
        	if(text){
	        	var r = new Point(inputPanel.point.x, inputPanel.point.y).getDistance(Stage.rotateCenter) / Stage.galaxyRadius;
		        var v1 = new Point(inputPanel.point.x - Stage.rotateCenter.x, inputPanel.point.y - Stage.rotateCenter.y);
		        var v2 = new Point(-1, 0);
		        var angle = (v2.getDirectedAngle(v1) - Stage.degreeOffset + 360) % 360;
		        var date = new Date();
		        var pt = {t:text, r:r, d:angle, idx:date.getTime(), on:true};
	            if(inputPanel.status == 'createChildNode'){
	            	Model.addPop(pt, inputPanel.relateNode); 
	            }
	            else if(inputPanel.status == 'createRootNode'){
	            	pt.ridx = inputPanel.rootIdx;
	            	Model.addPop(pt); 
	            }   
	            Pops.paint();
	        }
        }
        Stage.inputPanel.hide();
        Stage.setStatus('');
    }
    //esc: cancel edit
    else if(key == '27'){
        if(inputPanel.relateNode){
            inputPanel.relateNode.children['popText'].popTextShow();
        }
        Stage.inputPanel.hide();
        Stage.setStatus('');
    }

	var val = $(this).val();
	if(val.length > textLengthLimit){
		$(this).val(val.substring(0,textLengthLimit)); 
		setTimeout(function(){
			Stage.console.infoStatus['textLenLimit'];
		}, 1000);
	}
}

function _input_show(params){
	var _this = this;
	var val = params.val || '';
	this.point = params.point;
	this.status = params.status;
	this.relateNode = params.relateNode;
	this.rootIdx = params.rootIdx;
	this.text.text(_input_statusText(this.status))
	var w = this.ele.width();
	var h = this.ele.height();
	var top = this.point.y - h * 0.5;
	this.ele.css({'left':this.point .x + 10, 'top':top})
    this.ele.fadeIn();
    this.contentInput.focus();
    setTimeout(function(){
    	_this.contentInput.val(val);
    },30);
}

function _input_hide(){
	this.ele.hide();
    this.contentInput.val('');
}

function _input_statusText(status){
	if(status == 'createRootNode'){
		return 'Create Root Mind';
	}
}