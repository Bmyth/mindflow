function PopIndex(){
	var PopIndex = new Group();
	PopIndex.refresh = _pidx_refresh;
	$('body').on('click', '.pop-item p', _pidx_trackPop);
	// $('body').on('click', '.pop-item span', _pidx_editPop);
	$('body').on('mouseenter', '.pop-item', _.throttle(_pidx_mouseEnterPop,200));
	$('body').on('mouseleave', '.pop-item', _.throttle(_pidx_mouseEnterLeave,200));
	return PopIndex;
}

function _pidx_refresh(){
	var _this = this;
	$('.root-node-idx').remove();
	Model.pops.forEach(function(pt){
		var ele = $('.template .pop-item').clone().addClass('root-node-idx').appendTo($('body'));
		var text = pt.t.length > 10 ? pt.t.substring(0, 10) + '..' : pt.t;
		ele.find('p').text(pt.t);
		var r = Stage.orbits.getOrbitRadius(pt.ridx);
		var h = ele.width();
		ele.attr('idx',pt.idx).attr('ridx', pt.ridx);
		ele.css('top', (halfHeight - r + h) + 'px');
		
		if(pt.on){
			ele.addClass('on')
		}
	})
}

function _pidx_trackPop(){
	var idx = $(this).parent('.pop-item').attr('idx');
	var pop = Pops.getPopByIndex(idx);
	ViewController.executeOption(pop, 'trackPop');
	Stage.rotateToPop(idx);
}

function _pidx_editPop(){
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

function _pidx_mouseEnterPop(){
	if(!$(this).hasClass('on')){
		$(this).addClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOn('childrenApply');
	}
}

function _pidx_mouseEnterLeave(){
	if($(this).hasClass('hover')){
		$(this).removeClass('hover');
		var pop = Pops.getPopByIndex($(this).attr('idx'));
		pop.turnOff('childrenApply');
	}
}