function TextPanel(){
	var textPanel = {};
	textPanel.ele = $('.text-panel');
	textPanel.input = $('.text-panel textarea');
	textPanel.content = $('.text-panel .append-text');
	textPanel.text = $('.text-panel .text-box-opts p');

	textPanel.ele.find('.fa-check').click(_tp_editCheck);
	textPanel.ele.find('.fa-close').click(_tp_editClose);
	textPanel.edit = _tp_edit;
	textPanel.show = _tp_show;
	textPanel.hide = _tp_hide;
	return textPanel;
}

function _tp_edit(position, idx){
	this.show(position, idx, 'edit');
}

function _tp_editCheck(){
	var text = Stage.textPanel.input.val();
    Model.updatePop(onEditPop, {at:text});   
    onEditPop.updatePopModel();
	Stage.textPanel.hide();
	onEditPop = null;
    Stage.status = '';
}

function _tp_editClose(){
	Stage.textPanel.hide();
	onEditPop = null;
    Stage.status = '';
}

var _tb_yOffset = 20;
var _tb_saveGroundOffset = 50;
var _tb_minHeight = 200;
var _tb_widthRatio = 0.8;

function _tp_show(popText, idx, edit){
	var _this = this;
	this.text.text(popText.parent.t);

	var val = Model.getAppendTextByIdx(idx); 
	val = val || '';

    var w = view.size.width * _tb_widthRatio;
    var h = (groundCenter.y - groundRadius) - _tb_yOffset * 2 - _tb_saveGroundOffset;
    h = Math.max(h, _tb_minHeight);
    this.ele.css({width:w + 'px', height:h + 'px','left': parseInt(view.size.width * (1 - _tb_widthRatio) * 0.5)+ 'px','top': _tb_yOffset + 'px'});

	// _tp_showStar(popText);
    if(edit){
    	this.ele.addClass('edit');
    	setTimeout(function(){
			_this.input.focus();
			_this.input.val(val);
	    },30);
    }else{
    	this.ele.removeClass('edit');
    	this.content.html(val);
    }
    _this.ele.show(popText);
}

function _tp_showStar(popText){
	var startSize = 80;
	var endSize = 40;
	var starX = view.size.width * (1 - _tb_widthRatio) * 0.5;
    var starY = _tb_yOffset;
    Stage.starGo.show({
    	color: theme.skyColor,
    	left:(popText.position.x - startSize * 0.5) + 10 + 'px', 
    	top:(popText.position.y - startSize * 0.5) + 10 + 'px', 
    	width: startSize + 'px', 
    	height: startSize + 'px'
    }, {
    	left:view.size.width * (1 - _tb_widthRatio) * 0.5 + 'px', 
    	top:_tb_yOffset, 
    	width: endSize + 'px', 
    	height: endSize + 'px'
    });
}

function _tp_hide(){
	if(this.ele.css('display') != 'none'){
		this.content.text('');
		this.ele.hide();
    	this.input.val('');
    	return true;
	}
}