function PopConsole(){
	var popConsole = {};
	popConsole.ele = $('.pop-console');
	popConsole.refresh = _popconsole_refresh;
	popConsole.ele.on('click', '.pop-item p', _popconsole_moveToPop);
	popConsole.ele.on('click', '.pop-item span', _popconsole_togglePop);
	popConsole.ele.on('mouseenter', '.pop-item', _.throttle(_popconsole_mouseEnterPop,200));
	popConsole.ele.on('mouseleave', '.pop-item', _.throttle(_popconsole_mouseEnterLeave,200));
	return popConsole;
}

function _popconsole_refresh(){
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

function _popconsole_moveToPop(){
	var idx = $(this).parent('.pop-item').attr('idx');
	Stage.moveCenterToPop(idx);
}

function _popconsole_togglePop(){
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

function _popconsole_mouseEnterPop(){
	if(!$(this).hasClass('on')){
		$(this).addClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOn('childrenApply');
	}
}

function _popconsole_mouseEnterLeave(){
	if($(this).hasClass('hover')){
		$(this).removeClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOff('childrenApply');
	}
}