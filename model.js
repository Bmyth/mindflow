var storageName = 'popstore';

var Model = {
	pops : []
};

var PopMap = null;

Model.init = function() {
	Model.load();
	// Model.pops = [];
	generateMap();
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
} 

Model.load = function() {
    Model.pops = JSON.parse(localStorage.getItem(storageName));
    Model.pops = Model.pops || [];
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

Model.save = function(){
	localStorage.setItem(storageName,JSON.stringify(Model.pops))
}

Model.clear = function(){
	localStorage.removeItem(storageName);
}

function generateModel(ele, pops){
	var pt = {
		r : ele.attr('r'),
		d : ele.attr('d'),
		t : ele.attr('t'),
		idx : ele.attr('idx'),
		children: []
	}
	if(ele.hasClass('on')){
		pt.on = true;
	}
	ele.children().each(function(){
		generateModel($(this), pt.children)
	})
	pops.push(pt);
}

function generateMap(){
	PopMap = $('#popmap').empty();
	Model.pops.forEach(function(pt){
		insertPopElement(pt, PopMap);
	})
}

function insertPopElement(pt, parentEle){
	var ele = $('<div></div>').appendTo(parentEle);
	var level = parentEle.attr('level') ? parentEle.attr('level') + 1 : 0;
	ele.attr('idx', pt.idx).attr('r', pt.r).attr('d', pt.d).attr('t', pt.t).attr('level', level);
	if(pt.on){
		ele.addClass('on');
	}
	pt.children && pt.children.forEach(function(child){
		insertPopElement(child, ele);
	})
}