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
	var inputPanel = Comp.inputPanel;

	//enter: finish enter
	if(key == 13){
    	var text = inputPanel.contentInput.val();
        //update node
        if(inputPanel.status == 'editNode' && inputPanel.pop){
        	if(text){
		        var pt = {t:text};
	            Model.updatePop(inputPanel.pop, pt);   
	            inputPanel.pop.updatePopModel();
	        }
	        inputPanel.pop.refreshPop();
        }
        //create node
        else{
        	if(text){
		        var date = new Date();
		        var pt = {t:text, idx:date.getTime()};
	            if(inputPanel.status == 'createChildNode'){
	            	pt.x = inputPanel.point.x / Comp.boardRect.width;
		        	pt.y = inputPanel.point.y / Comp.boardRect.height;
	            	Model.addNode(pt, inputPanel.pop); 
	            	Render.refreshBoard();
	            }
	            else if(inputPanel.status == 'createRootNode'){
	            	Model.addNode(pt);
	            	Comp.cubes.refresh();
	            	ViewController.executeOption(pt.idx, 'trackRootNode');
	            }   
	        }
	        Comp.newBtn.fadeIn();
        }
        Comp.inputPanel.hide();
    }
    //esc: cancel edit
    else if(key == '27'){
        if(inputPanel.pop){
            inputPanel.pop.refreshPop();
        }
        if(inputPanel.status == 'createRootNode'){
        	Comp.newBtn.fadeIn();
        }
        Comp.inputPanel.hide();
    }

	// var val = $(this).val();
	// if(val.length > textLengthLimit){
	// 	$(this).val(val.substring(0,textLengthLimit)); 
	// 	setTimeout(function(){
	// 		Stage.console.infoStatus['textLenLimit'];
	// 	}, 1000);
	// }
}

function _input_show(params){
	var _this = this;
	var val = params.val || '';
	this.point = params.point;
	this.status = params.status;
	this.pop = params.pop;
	this.text.text(_input_statusText(this.status))
	var w = this.ele.width();
	var h = this.ele.height();
	var top = this.point.y - h * 0.5;
	var left = this.point.x;
	if(this.status != 'createRootNode'){
		left = left + Comp.liquid.width;
	}
	this.ele.css({'left': left, 'top':top})
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

}