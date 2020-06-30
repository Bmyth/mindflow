function Board(){
	var board = {
    	nodes: [],
    	group: null,
    	rect: null,
    	nodeTextContainer:  $('.node-text-container'),
    	refresh: _ml_refresh,
    	getNodeByIndex: _ml_getNodeByIndex
    }
    
    board.rect = {
       width:  parseInt(windowWidth * boardWidth),
       height: parseInt(windowHeight),
       top: parseInt(windowHeight * 0),
       left: parseInt(windowWidth * (1 - boardWidth))
    };

    $('#middle-layer').css({
        'height': board.rect.width + 'px', 
        'width': board.rect.width + 'px', 
        'top': board.rect.top + 'px', 
        'left': board.rect.left + 'px'
    });
    $('#middle-layer .bg-img').css({
        width: windowWidth + 'px',
        height: windowHeight + 'px',
        top: -board.rect.top + 'px',
        left: -board.rect.left + 'px' 
    })

    board.nodeTextContainer.css({
        width: windowWidth + 'px',
        height: windowHeight + 'px',
        top: -board.rect.top + 'px',
        left: -board.rect.left + 'px' 
    })
    board.group = new Group();
    return board;
}

function _ml_refresh(){
	_ml_clear();

    if(onBoardRootIdx){
        var pt = Model.getNodeByIdx(onBoardRootIdx);
        _ml_paintNode(pt, 0, null, pt);
    }
}

function _ml_paintNode(pt, level, parentPop, rootPt){
    var node = new Group();
    node.initPop(pt, level, parentPop, rootPt);
    Comp.board.nodes.push(node);
    pt.children.forEach(function(childPt){
        _ml_paintNode(childPt, level+1, node, rootPt);
    })
    return node;
}

function _ml_clear(){
	Comp.board.group.removeChildren();
    Comp.board.nodes = [];
    Comp.board.nodeTextContainer.empty();
}

function _ml_getNodeByIndex(idx){
    return Comp.board.nodes.find(function(i){
        return i.idx == idx;
    })
}