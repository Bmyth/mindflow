var storageName = 'popstore';

var Model = {
	pops : []
};

var PopMap = null;

Model.init = function() {
	Model.load();
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

Model.update = function(){
	Model.pops = [];
	PopMap.children().each(function(){
		generateModel($(this), Model.pops);
	})
	localStorage.setItem(storageName,JSON.stringify(Model.pops))
}

function generateModel(ele, pops){
	var pt = {
		r : ele.attr('r'),
		d : ele.attr('d'),
		t : ele.attr('t'),
		idx : ele.attr('idx'),
		children: []
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
	pt.children && pt.children.forEach(function(child){
		insertPopElement(child, ele);
	})
}