function nodeProtoTypeInject() {
    Item.prototype.refreshNode = _node_refresh;
    Item.prototype.clearNode = _node_clear;
    Item.prototype.mouseLeave = _node_onMouseLeaveText;
    Item.prototype.refreshPathNode = _pathnode_refresh;
} 

function _node_refresh(spaceNode, level, parentUiNode, rootSpaceNode){
    this.idx = spaceNode.i;
    this.level = level;
    this.parentIdx = parentUiNode ? parentUiNode.idx : null;
    this.isPathNode = false;
	if(spaceNode.i == Model.S_baseSpaceIdx){
    	return;
    }

    _node_refrshText(this, spaceNode, level);
    _node_refreshPosition(this, spaceNode, level);
    _node_refreshLink(this, parentUiNode);
    _node_syncPosition(this, parentUiNode);
}

function _node_refrshText(uiNode, spaceNode, level) {
	var firstTime = uiNode.children['nodeText'] == null;
	var nodeText = uiNode.children['nodeText'];
	var fontSize = level == 0 ? 24: 16;
	var fontColor = _fontColor;


	var popTextEle = null;
	if(firstTime){
		nodeTextEle = $('<p></p>').appendTo(Comp.board.textContainer);
	}else{
		nodeTextEle = nodeText.ele;
	}
	var ratio = 1;
	if(spaceNode){
		var dataNode = Model.getNodeInList(spaceNode.i);
		var content = dataNode.t;
		nodeTextEle.text(content);
	}

	nodeTextEle.css({'fontSize': fontSize + 'px', 'color':fontColor});
	nodeTextEle.css({'transform':'scale(' + ratio + ',' + ratio + ')'});
    var width = nodeTextEle.width() * ratio;
    var height = nodeTextEle.height() * ratio;
    if(firstTime){
    	nodeText = new Path.Rectangle({
	    	size: [width, height],
	    	fillColor: _fontColor
	    });
	    nodeText.name = 'nodeText';
	    nodeText.opacity = 0.001;
	    nodeText.position.x = windowWidth * 0.5;
	    nodeText.position.y = windowHeight * 0.5;
	   	// nodeText.opacity = 1;
	  	nodeText.ele = nodeTextEle;
	  	nodeText.idx = uiNode.idx;
	  	nodeText.onMouseEnter = _node_onMouseEnterText;
    	// nodeText.onMouseLeave = _node_onMouseLeaveText;
    	nodeText.onClick = _node_onClickText;
    	uiNode.addChild(nodeText);
    	uiNode.bringToFront();
    }
};

function _node_refreshLink(uiNode, uiParentNode){
	if(uiNode.children['link']){
		uiNode.children['link'].remove();
	}
	if(uiParentNode && uiParentNode.children['nodeText']){
		var link = new Path.Line();
	    link.opacity = 0.5;
	    var color = uiNode.isPathNode ? 'red' : _fontColor;
	    link.style.strokeColor = color;
	    link.style.strokeWidth = 1;
	    link.style.dashArray = [5,5];
	    link.name = 'link';
	    uiNode.addChild(link);
	    _node_updateLink(uiNode, uiParentNode);
	}
}

function _node_refreshPosition(uiNode, spaceNode, level){
	if(!uiNode.pos){
		uiNode.pos = {x:0.5, y:0.5}
	}
	var x,y;
	if(level == 0){
		x = y = 0.5; 
	}else{
		x = spaceNode.x == null ? Math.random() : spaceNode.x;
		y = spaceNode.y == null ? Math.random() : spaceNode.y;
	}
    x = parseFloat(windowWidth * x);
    y = parseFloat(windowHeight * y);
	uiNode.pos = {x:x, y:y};
}

function _pathnode_refresh(anchorUiNode, pathNode, level){
	this.level = level;
    this.parentIdx = null;
    this.isPathNode = true;
	if(this.idx == Model.S_baseSpaceIdx){
    	return;
    }
    _node_refrshText(this, null, level);

	if(pathNode.relativePos){
		this.pos.x = anchorUiNode.pos.x - pathNode.relativePos.x * windowWidth;
		this.pos.y = anchorUiNode.pos.y - pathNode.relativePos.y * windowHeight;
   		_node_refreshLink(this, anchorUiNode);
    	_node_syncPosition(this, anchorUiNode);
	}
}

function _node_clear(){
	if(this.idx == Model.S_baseSpaceIdx){
    	return;
    }
	if(this.children['link']){
		this.children['link'].remove();
	}
	this.pos.y = windowHeight + 100;
	_node_syncPosition(this, null, _node_clearCallback);
}

function _node_clearCallback(node){
	if(node.children['nodeText'] && node.children['nodeText'].ele){
		node.children['nodeText'].ele.remove();
	}
	node.removeChildren();
}

function _node_onMouseEnterText(){
	var node = this.parent;
	if(!node.isMoving){
		Comp.nodeRing.show(node);
	 	node.onHover = true;
	 	Pylon.onHoverNode = node;
	}
}

function _node_onMouseLeaveText(){
	if(!this.onHover){
		return;
	}
	this.onHover = false;
	Pylon.onHoverNode = null;
}

function _node_onClickText(){
	Pylon.executeOption(this.parent, 'trackNode');
}

function _node_updateLink(node1, node2, mode){
	if(!node1 || !node1.children['link'] || !node2){
		return;
	}
	var text1 = node1.children['nodeText'];
	var text2 = node2.children['nodeText'];

	var link = node1.children['link'];

	if(mode == 'rough'){
		link.updateLinkPos(text2.position, text1.position);
	}else{
		var linkPoints = _pop_getPreciseLinkPoints(node2, node1);
		link.updateLinkPos(linkPoints[0], linkPoints[1]);
	}
}

function _node_syncPosition(node, linkingNode, callback){
	var nodeText = node.children['nodeText'];
	if(nodeText.position.x != node.pos.x || nodeText.position.y != node.pos.y){
		var diffX = node.pos.x - nodeText.position.x;
		var startX = nodeText.position.x;
		var diffY = node.pos.y - nodeText.position.y;
		var startY = nodeText.position.y;

		node.isMoving = true;
		var tween = node.tween(500);
		tween.onUpdate = function(event) {
			nodeText.position.x = startX + diffX * event.progress;
			nodeText.position.y = startY + diffY * event.progress;
			if(nodeText.ele){
				var w = nodeText.ele.width();
				var h = nodeText.ele.height();
				nodeText.ele.css('left', nodeText.position.x - w/2);
				nodeText.ele.css('top', nodeText.position.y - h/2);
			}
			if(node.isMoving){
				_node_updateLink(node, linkingNode, 'rough');
			}
		};
		tween.then(function(){
			node.isMoving = false;
			_node_updateLink(node, linkingNode);
			callback && callback(node);
		})
	}else{
		_node_updateLink(node, linkingNode);
		callback && callback(node);
	}
}

function _pop_getPreciseLinkPoints(parentPop, pop){
	//determined by text rect
	var text1 = parentPop.children['nodeText'];
	var text2 = pop.children['nodeText'];
	var anglePop1 = _getBoundsAngle(text1.bounds);
    var anglePop2 = _getBoundsAngle(text2.bounds);
    var v1 = new Point(text1.position.x - text2.position.x, text1.position.y - text2.position.y);
    var v2 = new Point(0, -1);
    var d = v2.getAngle(v1);
    if(d > 90){
        d = 180 - d;
    }
    var r1 = d < anglePop1 ? text1.bounds.height * 0.5 / Math.cos(angleD2R * d) : text1.bounds.width * 0.5 / Math.sin(angleD2R * d);
    var r2 = d < anglePop2 ? text2.bounds.height * 0.5 / Math.cos(angleD2R * d) : text2.bounds.width * 0.5 / Math.sin(angleD2R * d);
    
    var v1s = v1.normalize(r1);
    var v2s = v1.normalize(r2);
    return [{x:text1.position.x - v1s.x, y:text1.position.y - v1s.y}, {x:text2.position.x + v2s.x, y:text2.position.y + v2s.y}]
}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}
