var _model_storageName = 'popstore';

var Model = {
	pops : []
};

var PopMap = null;

Model.init = function(callback) {
	Model.load(callback);
}

Model.addPop = function(pt, parent){
	parentEle = parent ? PopMap.find('[idx='+ parent.idx + ']') : PopMap;
	insertPopElement(pt, parentEle);
    Model.update();
}

Model.updatePop = function(pop, pt){
	if(pt.t){
		PopMap.find('[idx='+ pop.idx + ']').attr('t', pt.t);
		Model.update();
	}
	if(pt.at){
		PopMap.find('[idx='+ pop.idx + ']').data('at', pt.at);
		Model.update();
	}
	if(pt.at == ''){
		PopMap.find('[idx='+ pop.idx + ']').removeData('at');
		Model.update();
	}
} 

Model.load = function(callback) {
	var welcome = Welcome();
	// console.log(localStorage.getItem(_model_storageName))
    Model.pops = JSON.parse(localStorage.getItem(_model_storageName));
    Model.pops = Model.pops || [];
    if(Model.pops.length == 0 && !localStorage.getItem('welcome')){
    	var welcome = Welcome();
    	Model.pops = welcome.pops;
    	localStorage.setItem(_model_storageName, JSON.stringify(Model.pops));
    	var _stg_storageName = 'stageParams';
    	localStorage.setItem(_stg_storageName, JSON.stringify(welcome.stageParams));
    	localStorage.setItem('welcome', 'true');

    }

	generateMap();
	callback && callback();
}

Model.deletePop = function(pop){
    var idx = pop.idx;
    PopMap.find('[idx='+ idx + ']').remove();
	Model.update();
}

Model.togglePop = function(idx){
	var popEle = PopMap.find('[idx='+ idx + ']');
	var pop = Model.getPop(idx);
	if(popEle.hasClass('on')){
		popEle.removeClass('on');
		delete pop.on;
	}else{
		popEle.addClass('on');
		pop.on = true;
	}
	Model.save();
	return pop.on == true;
}

Model.connectPop = function(fromPop, toPop){
	var popEle = PopMap.find('[idx='+ fromPop.idx + ']');
	popEle.attr('c', toPop.idx);
	Model.update();
}

Model.disconnectPop = function(idx){
	var popEle = PopMap.find('[idx='+ idx + ']');
	popEle.removeAttr('c');
	Model.update();
}

Model.getPop = function(idx){
	return Model.pops.find(function(p){
		return p.idx == idx;
	})
}

Model.update = function(){
	Model.pops = [];
	PopMap.children().each(function(){
		generateModel($(this), Model.pops);
	})
	Model.save();
}

Model.getChildrenIdx = function(idx){
	var childrenIdx = [];
	var ele = PopMap.find('[idx='+ idx + ']');
	if(ele){
		ele.children('div').each(function(){
			childrenIdx.push($(this).attr('idx'));
		})
	}
	return childrenIdx;
}

Model.getModelByIdx = function(idx){
	var ele = PopMap.find('[idx='+ idx + ']');
	var pt = generateModel(ele);
	pt.level = ele.attr('level');
	return pt;
}

Model.getParentIdx = function(idx){
	var parentEle = PopMap.find('[idx='+ idx + ']').parent('.pe');
	return parentEle.attr('idx');
}

Model.getLevelByIdx = function(idx){
	var ele = PopMap.find('[idx='+ idx + ']');
	return parseInt(ele.attr('level'));
}

Model.getAppendTextByIdx = function(idx){
	var ele = PopMap.find('[idx='+ idx + ']');
	return ele.data('at');
}


Model.save = function(){
	localStorage.setItem(_model_storageName,JSON.stringify(Model.pops))
}

Model.getRootModel = function(idx){
	var rootEle = PopMap.find('[idx='+ idx + ']').closest('[level=0]');
	var idx =  rootEle.attr('idx');
	return this.getModelByIdx(idx);
}

Model.clear = function(){
	localStorage.removeItem(_model_storageName);
}

function generateModel(ele, pops){
	var pt = {
		r : ele.attr('r'),
		d : ele.attr('d'),
		t : ele.attr('t'),
		idx : ele.attr('idx'),
		children: []
	}
	if(ele.attr('c')){
		pt.c = ele.attr('c');
	}
	if(ele.data('at')){
		pt.at = ele.data('at');
	}
	if(ele.hasClass('on')){
		pt.on = true;
	}
	ele.children().each(function(){
		generateModel($(this), pt.children)
	})
	if(pops){
		pops.push(pt);
	}
	return pt;
}

function generateMap(){
	PopMap = $('#popmap').empty();
	Model.pops.forEach(function(pt){
		insertPopElement(pt, PopMap);
	})
}

function insertPopElement(pt, parentEle){
	var ele = $('<div class="pe"></div>').appendTo(parentEle);
	var level = parentEle.attr('level') ? parentEle.attr('level') + 1 : 0;
	ele.attr('idx', pt.idx).attr('r', pt.r).attr('d', pt.d).attr('t', pt.t).attr('level', level);
	if(pt.c){
		ele.attr('c', pt.c);
	}
	if(pt.at){
		ele.data('at', pt.at);
	}
	if(pt.on){
		ele.addClass('on');
	}
	pt.children && pt.children.forEach(function(child){
		insertPopElement(child, ele);
	})
}