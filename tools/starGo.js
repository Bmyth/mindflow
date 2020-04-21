function StarGo(){
	var starGo = {};
	starGo.ele = $('.star-go');
	starGo.show = _sg_show;
	starGo.hide = _sg_hide;
	return starGo;
}

function _sg_show(startCss, endCss, callback){
	this.ele.css(startCss).show().animate(endCss, 1200, function(){
		callback && callback();
	});
}

function _sg_hide(){
	
}