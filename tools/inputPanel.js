function InputPanel(){
	var inputbox = {};
	inputbox.ele = $('.edit-panel');
	inputbox.contentInput = $('.edit-panel #content-input');
	inputbox.contentInput.keydown(_input_keydown)
	inputbox.show = _input_show;
	inputbox.hide = _input_hide;
	return inputbox;
}

function _input_keydown(e){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
	//enter: finish enter
    if(key == 13){
    	 var text = Stage.inputPanel.contentInput.val();
        //update node
        if(Stage.status == 'onEdit' && onEditPop){
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
	        	var r = new Point(editPos.x,editPos.y).getDistance(Stage.rotateCenter) / Stage.galaxyRadius;
		        var v1 = new Point(editPos.x - Stage.rotateCenter.x, editPos.y - Stage.rotateCenter.y);
		        var v2 = new Point(-1, 0);
		        var angle = (v2.getDirectedAngle(v1) - Stage.degreeOffset + 360) % 360;
		        var date = new Date();
		        var pt = {t:text, r:r, d:angle, idx:date.getTime(), on:true};
	            if(Stage.status == 'onBranchEdit'){
	            	Model.addPop(pt, onEditPop); 
	            }
	            else if(Stage.status == 'onEdit'){
	            	Model.addPop(pt); 
	            }   
	            Pops.paint();
	        }
        }
        Stage.inputPanel.hide();
        onEditPop = null;
        Stage.status = '';
    }
    //esc: cancel edit
    else if(key == '27' && (Stage.status == 'onEdit' || Stage.status == 'onBranchEdit')){
        if(onEditPop){
            onEditPop.children['popText'].popTextShow();
        }
        onEditPop = null;
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

function _input_show(point, val){
	var _this = this;
	val = val || '';
    var x = point.x;
    var y = point.y;
    var w = this.ele.width();
    var h = this.ele.height();
    this.ele.css({'left':(x-w/2),'top':(y-h/2),'display':'flex'});
    this.contentInput.focus();
    setTimeout(function(){
    	_this.contentInput.val(val);
    },30);
}

function _input_hide(){
	this.ele.hide();
    this.contentInput.val('');
}