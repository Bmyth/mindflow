function PopPanel(){
	var PopPanel = {};
	PopPanel.ele = $('.pop-panel');
	PopPanel.refresh = _ppl_refresh;
	PopPanel.ele.on('click', '.pop-item p', _ppl_moveToPop);
	PopPanel.ele.on('click', '.pop-item span', _ppl_togglePop);
	PopPanel.ele.on('mouseenter', '.pop-item', _.throttle(_ppl_mouseEnterPop,200));
	PopPanel.ele.on('mouseleave', '.pop-item', _.throttle(_ppl_mouseEnterLeave,200));
	return PopPanel;
}

function _ppl_refresh(){
	var _this = this;
	this.ele.empty();
	Model.pops.forEach(function(pt){
		var ele = $('.template .pop-item').clone().appendTo(_this.ele);
		ele.attr('idx',pt.idx);
		var text = pt.t.length > 10 ? pt.t.substring(0, 10) + '..' : pt.t;
		ele.find('p').text(text);
		if(pt.on){
			ele.addClass('on')
		}
	})
}

function _ppl_moveToPop(){
	var idx = $(this).parent('.pop-item').attr('idx');
	Stage.moveCenterToPop(idx);
}

function _ppl_togglePop(){
	var item = $(this).parent('.pop-item');
	$(item).removeClass('hover');
	var idx = $(item).attr('idx');
    var on = Model.togglePop(idx);
    var pop = Pops.getPopByIndex(idx);
    if(on){
    	pop.turnOn('childrenApply');
    	$(item).addClass('on');
    }else{
    	pop.turnOff('childrenApply');
    	$(item).removeClass('on');
    }
}

function _ppl_mouseEnterPop(){
	if(!$(this).hasClass('on')){
		$(this).addClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOn('childrenApply');
	}
}

function _ppl_mouseEnterLeave(){
	if($(this).hasClass('hover')){
		$(this).removeClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOff('childrenApply');
	}
}