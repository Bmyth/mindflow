//input text length limit
var textLengthLimit = 25;

function InputPanel(){
	var inputbox = {};
	inputbox.ele = $('.edit-panel');
	inputbox.input = $('.edit-panel input');
	inputbox.input.on("input", _input_check);
	inputbox.show = _input_show;
	inputbox.hide = _input_hide;
	return inputbox;
}

function _input_check(){
	var val = $(this).val();
	if(val.length > textLengthLimit){
		$(this).val(val.substring(0,textLengthLimit)); 
		consoleText.content = consoleInfo['textLenLimit'];
		setTimeout(function(){
			_stg_updateText();
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