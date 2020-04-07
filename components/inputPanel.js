function InputPanel(){
	var inputbox = {};
	inputbox.ele = $('.edit-panel');
	inputbox.input = $('.edit-panel input');
	// inputbox.input.on("input", _input_check);
	inputbox.input.keydown(_input_check)
	inputbox.show = _input_show;
	inputbox.hide = _input_hide;
	Stage.console.info('input panel init.');
	return inputbox;
}

function _input_check(e){
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
		        var pt = {t:text, r:r, d:angle, idx:date.getTime(), on:true};
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
    //esc: cancel edit
    else if(key == '27' && Stage.status == 'onEdit'){
        Stage.setStatus('');
        if(onEditPop){
        	ViewController.onMouseEnterPop(onEditPop);
            var popText = onEditPop.children['popText'];
            popText.popTextShow();
        }
        onEditPop = null;
        Stage.inputPanel.hide();
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
    this.input.focus();
    setTimeout(function(){
    	_this.input.val(val);
    },30);
}

function _input_hide(){
	this.ele.hide();
    this.input.val('');
}