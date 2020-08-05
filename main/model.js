var Model = {
	space : null,
	map: null,
	path : [],
	nodeList : [],
	S_nodes: 'mx_nodes',
	S_nodePrefix: 'mx_node_',
	S_path: 'mx_path',
	S_baseSpaceIdx: '$$0',
	init: _model_init,
	isBaseSpace: _model_isBaseSpace,
	isNodeExistInList: _model_isNodeExistInList,
	getNodeInList: _model_getNodeInList,
	addNodeInSpace: _model_addNodeInSpace,
	addNodeInPath: _model_addNodeInPath,
	trackNodeInPath: _model_trackNodeInPath,
	addNodeInList: _model_addNodeInList,
	deleteNodeInSpace: _model_deleteNodeInSpace
};

function _model_init() {
	Model.map = $('#space-map');
	Model.nodeList = JSON.parse(localStorage.getItem(Model.S_nodes));
    Model.nodeList = Model.nodeList || [];
    Model.path = JSON.parse(localStorage.getItem(Model.S_path));
    Model.path = Model.path || [];

    if(Model.path.length == 0){
    	var baseSpace = Model.getNodeInList(Model.S_baseSpaceIdx);
    	if(!baseSpace){
    		baseSpace = {
	    		i : Model.S_baseSpaceIdx,
	    		t : ''
	    	};
	    	Model.addNodeInList(baseSpace);
    	}
    	Model.path.unshift({i:baseSpace.i});
    }
    _model_loadSpace();
}

function _model_isBaseSpace(){
	return Model.space.i == Model.S_baseSpaceIdx;
}

function _model_getNodeInList(i){
	return Model.nodeList.find(function(n){
		return n.i == i;
	})
}

function _model_isNodeExistInList(i){
	return Model.nodeList.indexOf(function(n){
		return n.i == i;
	}) >= 0;
}

function _model_addNodeInList(node){
	Model.nodeList.push(node);
	_model_saveNodeList();
}

function _model_addNodeInSpace(pt, parentIdx){
	var parentEle = parentIdx == Model.space.i ? Model.map : Model.map.find('.node-item[i=' + parentIdx + ']');
	_model_generateNodeMap(pt, parentEle);
	_model_updateSpace();
	if(!Model.isNodeExistInList(pt.i)){
		Model.addNodeInList({
			i: pt.i,
			t: pt.t
		});
	}
	_model_updateView('board');
}

function _model_addNodeInPath(uiNode){
	var pathNode = {
		i: uiNode.idx,
		relativePos: null
	}
	Model.path.unshift(pathNode);
	if(Model.path[1]){
		Model.path[1].relativePos = {
			x: (uiNode.pos.x / windowWidth) - 0.5,
			y: (uiNode.pos.y / windowHeight) - 0.5
		}
	}

	_model_loadSpace();
	_model_updateView('all');
}

function _model_trackNodeInPath(uiNode){
	Model.path = Model.path.slice(uiNode.level);
	_model_loadSpace();
	_model_updateView('all');
}

function _model_deleteNodeInSpace(idx){
	if(idx != Model.space.i){
		Model.map.find('.node-item[i="' + idx + '"]').remove();
		_model_updateSpace();
		_model_updateView('board');
	}
}

function _model_saveNodeList(){
	localStorage.setItem(Model.S_nodes, JSON.stringify(Model.nodeList));
}

function _model_saveSpace(){
	if(Model.space.children.length > 0){
		localStorage.setItem(Model.S_nodePrefix + Model.space.i, JSON.stringify(Model.space));
	}else{
		localStorage.removeItem(Model.S_nodePrefix + Model.space.i);
	}
	
}

function _model_loadSpace(){
	var data = localStorage.getItem(Model.S_nodePrefix + Model.path[0].i);
	if(data){
		Model.space = JSON.parse(data);
	}else{
		Model.space = {
			i: Model.path[0].i,
			children: []
		};
	}
	Model.map.empty();
	_model_generateNodeMap(Model.space, Model.map);
}

function _model_updateSpace(parentNode, parentEle){
	var root = parentNode == null;
	parentNode = parentNode || Model.space;
	parentEle = parentEle || Model.map;
	parentNode.children = [];
	if(parentEle.children('.node-item').length > 0){
		parentEle.children('.node-item').each(function(){
			var n = {
				i: $(this).attr('i'),
				x: $(this).attr('x'),
				y: $(this).attr('y')
			}
			parentNode.children.push(n);
			_model_updateSpace(n, $(this))
		})
	}
	if(root){
		_model_saveSpace();
	}
}

function _model_generateNodeMap(node, container){
	var root = node.i == Model.space.i
	var ele = root ? container : $('<div class="node-item"></div>').appendTo(container);
	ele.attr('i', node.i);
	if(root){
		ele.removeAttr('x y');
	}else{
		ele.attr({
			x: node.x,
			y: node.y
		})
	}
	if(node.children){
		node.children.forEach(function(n){
			_model_generateNodeMap(n, ele);
		})
	}
}

function _model_savePath(){
	localStorage.setItem(Model.S_path, JSON.stringify(Model.path));
}

function _model_updateView(partial){
	if(partial == 'board'){
		Comp.board.refresh();
	}else if(partial == 'path'){
		Comp.path.refresh();
	}else if(partial == 'all'){
		Comp.board.refresh();
		Comp.path.refresh();
	}
}