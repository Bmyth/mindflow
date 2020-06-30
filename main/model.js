// x: x ratio
// y: y ratio
// r: rotation
// idx: idx
// t: text
// c: connect
// on: toggle status
// at: append text
// color: color

var Model = {
	rootNodes : [],
	nodes : [],
	rootStoreName: 'mx_roots',
	detailStorePrefix: 'mx_detail_',
	welcomeStoreName: 'mx_welcome',
	eleMap : null,
	init: _model_init,
	load: _model_load,
	clear: _model_clear,
	addNode: _model_addNode,
	deleteNode: _model_deleteNode,
	getNodeByIdx: _model_getNodeByIdx,
	getChildrenIdx: _model_getChildrenIdx,
	setRootNodePos: _model_setRootNodePos,
	saveRootNodes: _model_saveRootNodes
};

function _model_init(callback) {
	this.load(callback);
}

function _model_load(callback) {
    this.rootNodes = JSON.parse(localStorage.getItem(this.rootStoreName));
    this.rootNodes = this.rootNodes || [];
    if(this.rootNodes.length == 0 && !localStorage.getItem(this.welcomeStoreName)){
    	//welcome 
    }

	this.eleMap = $('#popmap').empty();
	this.nodes = [];
	this.rootNodes.forEach(function(r){
		var node = localStorage.getItem(Model.detailStorePrefix + r.idx);
		if(node){
			Model.nodes.push(JSON.parse(node));
		}
	})
	this.nodes.forEach(function(pt){
		_model_generateElement(pt, Model.eleMap);
	})
	callback && callback();
}

function _model_addNode(pt, parent){
	if(!parent){
		Model.rootNodes.push(pt);
	}
	var parentEle = parent ? this.eleMap.find('[idx='+ parent.idx + ']') : this.eleMap;
	_model_generateElement(pt, parentEle);
    _model_update();
}

function _model_deleteNode(node){
	if(node.level == 0){
		_model_deleteRootNodeByIdx(node.idx);
	}
    Model.eleMap.find('[idx='+ node.idx + ']').remove();
	_model_update();
}

function _model_getChildrenIdx(idx){
	var childrenIdx = [];
	var ele = this.eleMap.find('[idx='+ idx + ']');
	if(ele){
		ele.children('div').each(function(){
			childrenIdx.push($(this).attr('idx'));
		})
	}
	return childrenIdx;
}

function _model_setRootNodePos(idx, pos){
	var rootNode = _model_getRootNodeByIdx(idx);
	if(rootNode){
		rootNode.x = pos.x;
		rootNode.y = pos.y;
		rootNode.r = pos.r
	}
}

function _model_saveRootNodes(){
	localStorage.setItem(Model.rootStoreName,JSON.stringify(Model.rootNodes));
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

function _model_update(){
	Model.nodes = [];
	Model.eleMap.children().each(function(){
		_model_generateNode($(this), Model.nodes);
	})
	_model_save();
}

function _model_getNodeByIdx(idx){
	var ele = this.eleMap.find('.pe[idx='+ idx + ']');
	var pt = _model_generateNode(ele);
	pt.level = ele.attr('level');
	return pt;
}

function _model_getRootNodeByIdx(idx){
	return Model.rootNodes.find(function(r){
		return r.idx == idx;
	})
}

function _model_deleteRootNodeByIdx(idx){
	Model.rootNodes = _.reject(Model.rootNodes, function(r){
		return r.idx == idx;
	});
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


function _model_save(){
	Model.nodes.forEach(function(n){
		localStorage.setItem(Model.detailStorePrefix + n.idx,JSON.stringify(n));
	})
	localStorage.setItem(Model.rootStoreName,JSON.stringify(Model.rootNodes));
}

function _model_clear(){
	localStorage.removeItem(this.rootStoreName);
	localStorage.removeItem(this.detailStoreName);
	localStorage.removeItem(this.welcomeStoreName);
	//remove setting params
}

Model.setRootColor = function(idx, color){
	var ele = PopMap.find('[idx='+ idx + ']');
	ele.attr('color', color);
	Model.update();
}

function _model_generateNode(ele, nodes){
	var pt = {
		x : ele.attr('x'),
		y : ele.attr('y'),
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
	if(ele.attr('color')){
		pt.color = ele.attr('color');
	}
	ele.children().each(function(){
		_model_generateNode($(this), pt.children)
	})
	if(nodes){
		nodes.push(pt);
	}
	return pt;
}

function _model_generateElement(pt, parentEle){
	var ele = $('<div class="pe"></div>').appendTo(parentEle);
	var level = parentEle.attr('level') ? parentEle.attr('level') + 1 : 0;
	if(level == 0){
		var rootPt = _model_getRootNodeByIdx(pt.idx);
		pt = rootPt;
	}
	ele.attr('idx', pt.idx).attr('x', pt.x).attr('y', pt.y).attr('t', pt.t).attr('level', level);
	if(pt.c){
		ele.attr('c', pt.c);
	}
	if(pt.at){
		ele.data('at', pt.at);
	}
	if(pt.on){
		ele.addClass('on');
	}
	if(pt.color){
		ele.attr('color', pt.color);
	}
	pt.children && pt.children.forEach(function(child){
		_model_generateElement(child, ele);
	})
}