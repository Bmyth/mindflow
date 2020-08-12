function Board(){
	var board = {
        pathNodes: [],
    	nodes: [],
    	refresh: _bd_refresh,
    	getNodeByIndex: _bd_getNodeByIndex,
        getPthNodeByIndex: _bd_getPthNodeByIndex
    }
    board.textContainer = $('#elements .node-texts')
    Comp.board = board;
    board.refresh();
}

function _bd_refresh(){   
    this.nodes.forEach(function(n){
        n.keep = false;
    })    
    _bd_paintUiNode(Model.space, 0, null, Model.space);
    this.nodes.forEach(function(n){
        if(!n.keep){
            n.clearNode();
        }
    }) 
    this.nodes = _.filter(this.nodes, function(n){
        return n.keep;
    })
}

function _bd_paintUiNode(spaceNode, level, parentUiNode, rootSpaceNode){
    var uiNode = Comp.board.nodes.find(function(n){
        return n.idx == spaceNode.i && !n.keep;
    })
    if(!uiNode){
        var uiNode = new Group();
        Comp.board.nodes.push(uiNode);
    }
    uiNode.refreshNode(spaceNode, level, parentUiNode, rootSpaceNode);
    uiNode.keep = true;
    
    spaceNode.children = spaceNode.children || [];
    spaceNode.children.forEach(function(childSpaceNode){
        _bd_paintUiNode(childSpaceNode, level+1, uiNode, rootSpaceNode);
    })

    if(level == 0){
        uiNode.isPathNode = true;
        _bd_paintPath(uiNode, 0);
    }
}

function _bd_paintPath(uiPathNode, level){
    uiPathNode.keep = true;
    var pathNode = Model.path[level];
    //if has pre node
    if(level < Model.path.length - 1){
        var prePathNode = Model.path[level + 1];
        var preUiNode = _bd_getNodeByIndex(prePathNode.i);

        if(preUiNode){
            preUiNode.refreshPathNode(uiPathNode, prePathNode, level+1);
            _bd_paintPath(preUiNode, level+1);
        }
    }
}

function _ml_clear(){
    Comp.board.nodes.forEach(function(n){
        n.removeChildren();
    })
    Comp.board.nodes = [];
    Comp.board.textContainer.empty();
}

function _bd_getNodeByIndex(idx){
    return Comp.board.nodes.find(function(i){
        return i.idx == idx;
    })
}

function _bd_getPthNodeByIndex(idx){
    return Comp.board.nodes.find(function(i){
        return i.idx == idx && i.isPathNode;
    })
}