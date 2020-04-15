function TextBox(){
	var textBox = {};
	textBox.ele = $('.text-box');
	textBox.input = $('.text-box textarea');
	textBox.content = $('.text-box .append-text');

	textBox.ele.find('.fa-check').click(_tb_editCheck);
	textBox.ele.find('.fa-close').click(_tb_editClose);
	textBox.edit = _tb_edit;
	textBox.show = _tb_show;
	textBox.hide = _tb_hide;
	return textBox;
}

var _tb_width = 360;
var _tb_height = 200;
var _tb_yOffset = 10;

function _tb_edit(position, idx){
	this.show(position, idx, 'edit');
}

function _tb_editCheck(){
	var text = Stage.textBox.input.val();
	if(text){
        var pt = {at:text};
        Model.updatePop(onEditPop, pt);   
        onEditPop.updatePopModel();
	}
	Stage.textBox.hide();
	onEditPop = null;
    Stage.status = '';
}

function _tb_editClose(){
	Stage.textBox.hide();
	onEditPop = null;
    Stage.status = '';
}

function _tb_show(popText, idx, edit){
	var _this = this;
	var val = Model.getAppendTextByIdx(idx); 

	val = val || '';
    var x = popText.position.x;
    var y = popText.position.y;
    var l = x - _tb_width * 0.5;
    l = Math.max(0, l);
    var t = popText.bounds.top > (_tb_height + _tb_yOffset) ? (popText.bounds.top - _tb_height - _tb_yOffset) : (popText.bounds.bottom + _tb_yOffset);
    this.ele.css({width:_tb_width + 'px', height:_tb_height + 'px','left': parseInt(l) + 'px','top': parseInt(t) + 'px'});

    if(edit){
    	this.ele.addClass('edit');
    	setTimeout(function(){
			_this.input.focus();
			_this.input.val(val);
	    },30);
    }else{
    	this.ele.removeClass('edit');
    	this.content.text(val);
    }
    _this.ele.show();


}

function _tb_hide(){
	if(this.ele.css('display') != 'none'){
		this.content.text('');
		this.ele.hide();
    	this.input.val('');
	}
}