var Model = {
	path : [],
	nodeList : [],
	S_nodes: 'mx_nodes',
	S_nodePrefix: 'mx_node_',
	S_path: 'mx_path',
	S_baseSpaceIdx: '$$root',
	init: _model_init,
	getNodeInList: _model_getNodeInList,
	saveNodeList: _model_saveNodeList,
	replaceNodeInList: _model_replaceNodeInList,
	updateNodeTextInList: _model_updateNodeTextInList,
	trackNodeInPath: _model_trackNodeInPath,
	addNodeInList: _model_addNodeInList,
	deleteNodeInList: _model_deleteNodeInList,
	generateTimestamp: _model_generateTimestamp,
	generateUid: _model_generateUid
};

function _model_init() {
	Model.map = $('#space-map');
	Model.nodeList = JSON.parse(localStorage.getItem(Model.S_nodes));
    Model.nodeList = Model.nodeList || [];
    Model.path = JSON.parse(localStorage.getItem(Model.S_path));
    Model.path = Model.path || [];

    if(Model.path.length == 0){
    	if(_model_getNodeInList(Model.S_baseSpaceIdx) == null){
			_model_addNodeInList({i:Model.S_baseSpaceIdx});
    	}
    	Model.path.push(Model.S_baseSpaceIdx);
    }
}

function _model_getNodeInList(i){
	return Model.nodeList.find(function(n){
		return n.i == i;
	})
}

function _model_addNodeInList(params){
	var node = {};
	node.t = params.t || '';
	node.i = params.i || _model_generateTimestamp();
	node.ref = [];
	node.nRef = 0;
	node.nVisit = 0;
	Model.nodeList.push(node);
	_model_saveNodeList();
	return node;
}

function _model_updateVisitNumInList(i){
	if(i == Model.S_baseSpaceIdx){
		return;
	}
	var node = _model_getNodeInList(i);
	node.nVisit = node.nVisit || 0;
	node.nVisit++;
	_model_saveNodeList();
}

function _model_deleteNodeInList(node){
	Model.nodeList =  _.filter(Model.nodeList, function(n){
		return n.i != node.i;
	})
	_model_saveNodeList();
	Comp.space.deleteSpace(node.i);
}

function _model_replaceNodeInList(replacedId, replacingId){
	var node = _model_getNodeInList(replacedId);
	var replacingNode = _model_getNodeInList(replacingId);
	node.ref.forEach(function(i){
		var spaceNode = JSON.parse(localStorage.getItem(Model.S_nodePrefix + i));
		if(spaceNode){
			__replaceNodeRefInSpace(spaceNode, replacedId, replacingId);
			localStorage.setItem(Model.S_nodePrefix + i, JSON.stringify(spaceNode));
		}
	})
	_model_deleteNodeInList(replacedId);
	Pylon.refreshView('all');

	function __replaceNodeRefInSpace(spaceNode, replacedId, replacingId){
		if(!spaceNode.children){
			return;
		}
		spaceNode.children.forEach(function(n){
			if(n.i == replacedId){
				n.i = replacingId;
				if(!_.contains(replacingNode.ref, spaceNode.i)){
					replacingNode.ref.push(spaceNode.i);
					replacingNode.nRef++;
				}
			}
			__replaceNodeRefInSpace(n, replacedId, replacingId);
		})
	}
}

function _model_updateNodeTextInList(i, text){
	var node = _model_getNodeInList(i);
	node.t = text;
	_model_saveNodeList();
	Pylon.refreshView('all');
}

function _model_trackNodeInPath(i){
	var index = Model.path.findIndex(function(nodeIdx){
		return nodeIdx == i;
	})
	if(index >= 0){
		Model.path = Model.path.slice(0, index + 1);
	}else{
		Model.path.push(i);
	}
	_model_updateVisitNumInList(i);
	Pylon.refreshView('all');
}

function _model_saveNodeList(){
	localStorage.setItem(Model.S_nodes, JSON.stringify(Model.nodeList));
}

function _model_savePath(){
	localStorage.setItem(Model.S_path, JSON.stringify(Model.path));
}

function _model_generateTimestamp(){
  	var d = new Date();
  	return d.getTime();
}

var _uidLength = 12;
var _uidSoup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
function _model_generateUid(){
  	var soupLength = _uidSoup.length;
  	var id = []
  	for (var i = 0; i < _uidLength; i++) {
    	id[i] = _uidSoup.charAt(Math.random() * soupLength);
  	}
  	return id.join('')
}