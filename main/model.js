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
    		baseSpace = _model_newNode({i:Model.S_baseSpaceIdx});
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

function _model_deleteNodeInList(node){
	Model.nodeList =  _.filter(Model.nodeList, function(n){
		return n.i != node.i;
	})
	_model_saveNodeList();

	//remove ref in to-delete node space
	var spaceNode = JSON.parse(localStorage.getItem(Model.S_nodePrefix + node.i));
	if(spaceNode){
		_deleteNodeRefInSpace(spaceNode, node.i);
		localStorage.removeItem(Model.S_nodePrefix + node.i);
	}


	function _deleteNodeRefInSpace(spaceNode, deletingNodeIdx){

		if(!spaceNode.children){
			return;
		}
		spaceNode.children.forEach(function(n){
			console.log(n)
			var listNode = Model.getNodeInList(n.i);
			listNode.nRef -= 1;
			listNode.ref = _.filter(listNode.ref, function(r){
				return r != deletingNodeIdx;
			})
			_deleteNodeRefInSpace(n, deletingNodeIdx);
			if(listNode.ref.length == 0){
				_model_deleteNodeInList(listNode);
			}
		})
	}
}

function _model_addNodeInSpace(pt, parentIdx){
	var node;
	if(!pt.i){
		node = _model_newNode({t:pt.t});
		pt.i = node.i;
		Model.addNodeInList(node);
	}else{
		node = Model.getNodeInList(pt.i);
	}
	//update node ref
	node.ref = node.ref || [];
	node.ref.push(Model.space.i);
	node.nRef = node.nRef + 1;
	_model_saveNodeList();

	//update space node
	var parentEle = parentIdx == Model.space.i ? Model.map : Model.map.find('.node-item[i=' + parentIdx + ']');
	_model_generateNodeMap(pt, parentEle);
	_model_updateSpace();
	_model_updateView('board list');
}

function _model_deleteNodeInSpace(idx){
	var node = Model.getNodeInList(idx);
	if(idx != Model.space.i){
		//update node ref
		var n = Model.map.find('.node-item[i="' + idx + '"]').length;
		node.nRef -= n;
		node.ref = _.filter(node.ref, function(r){
			return r != Model.space.i;
		})
		if(node.ref.length == 0){
			console.log('ref 0')
			_model_deleteNodeInList(node);
		}
		_model_saveNodeList();

		//update space node
		Model.map.find('.node-item[i="' + idx + '"]').remove();
		_model_updateSpace();
		_model_updateView('board list');
	}else{

	}
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

function _model_newNode(param){
	var d = new Date();
	var node = {
		i: param.i || d.getTime(),
		t: param.t || '',
		ref : [],
    	nRef : 0
	}
	return node;
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
	if(partial.indexOf('board') >= 0 ||  partial == 'all'){
		Comp.board.refresh();
	}
	if(partial.indexOf('path') >= 0 ||  partial == 'all'){
		Comp.path.refresh();
	}
	if(partial.indexOf('list') >= 0 ||  partial == 'all'){
		Comp.nodeList.refresh();
	}
}