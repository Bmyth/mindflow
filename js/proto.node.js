function nodeProtoTypeInject() {
    Item.prototype.refreshNode = _node_refresh;
    Item.prototype.clearNode = _node_clear;
    Item.prototype.mouseLeave = _node_onMouseLeaveText;
} 

function _node_refresh(spaceNode, parentUiNode){
    this.i = spaceNode.i;
    this.level = parentUiNode ? parentUiNode.level + 1 : 0;
    this.parentUid = parentUiNode ? parentUiNode.uid : null;
    _node_registMetaEle(this, spaceNode);
    if(!this.ele){
    	_node_generateEle(this, spaceNode);
    }

	if(spaceNode.i == Model.S_baseSpaceIdx){
    	return;
    }
    _node_refrshText(this, spaceNode);
    _node_refreshLink(this, parentUiNode);
    _node_refreshPosition(this, spaceNode, parentUiNode);
}

function _node_registMetaEle(uiNode, spaceNode){
	var parentEle = uiNode.parentUid ? Comp.space.map.find('.node[uid=' + uiNode.parentUid + ']') : Comp.space.map;
	uiNode.uid  = uiNode.uid || Model.generateUid();
	uiNode.name = 'n-' + uiNode.uid;
	uiNode.metaEle = $('<div class="node"></div>').attr({'uid': uiNode.uid,'i':uiNode.i,'x':spaceNode.x, 'y':spaceNode.y}).appendTo(parentEle);
}

function _node_generateEle(uiNode, spaceNode){
	uiNode.ele = $('<p class="node-text"></p>').attr({'uid': uiNode.uid,'i':uiNode.i}).appendTo(Comp.space.container);
}

function _node_refrshText(uiNode, spaceNode) {
	var mask = uiNode.children['mask'];
	if(!mask){
    	mask = new Path.Rectangle({
	    	size: [1, 1],
	    	fillColor: '#333'
	    });
	    mask.name = 'mask';
	    mask.opacity = 0.001;
	   	// mask.opacity = 1;
	  	mask.i = uiNode.i;
	  	mask.onMouseEnter = _node_onMouseEnterText;
    	// nodeText.onMouseLeave = _node_onMouseLeaveText;
    	mask.onClick = _node_onClickText;
    	uiNode.addChild(mask);
    	uiNode.bringToFront();
    }
	
	var fontSize = uiNode.level == 0 ? 24: 16;
	var ratio = 1;
	var fontColor = Theme.fontColor;
	var text = Model.getNodeInList(spaceNode.i)['t'];
	uiNode.ele.text(text).css(
		{'fontSize': fontSize + 'px', 'color':fontColor, 'transform':'scale(' + ratio + ',' + ratio + ')'}
	);

	var width = uiNode.ele.width() * ratio;
    var height = uiNode.ele.height() * ratio;
    mask.bounds.width = width;
    mask.bounds.height = height;
};

function _node_refreshLink(uiNode, uiParentNode){
	uiNode.children['link'] && uiNode.children['link'].remove();
	if(uiParentNode && uiParentNode.children['mask']){
		var link = new Path.Line();
	    link.opacity = 0.5;
	    var color = Theme.fontColor;
	    link.style.strokeColor = color;
	    link.style.strokeWidth = 1;
	    link.style.dashArray = [5,5];
	    link.name = 'link';
	    uiNode.addChild(link);
	}
}

function _node_refreshPosition(uiNode, spaceNode, parentUiNode){
	var x,y;
	if(uiNode.level == 0){
		x = y = 0.5; 
	}else{
		x = spaceNode.x == null ? 0.5 : spaceNode.x;
		y = spaceNode.y == null ? 0.5 : spaceNode.y;
	}
	uiNode.metaEle.attr({'x':x, 'y':y});
	if(!uiNode.pos){
		uiNode.pos = {x:windowWidth * 0.5, y:windowHeight * 0.5};
		_node_syncPosition(uiNode, parentUiNode);
	}
    x = parseFloat(windowWidth * x);
    y = parseFloat(windowHeight * y);
	uiNode.pos = {x:x, y:y};

	_node_syncPosition(uiNode, parentUiNode, 'animation');
}

function _node_clear(){
	if(this.i == Model.S_baseSpaceIdx){
    	return;
    }
	this.children['link'] && this.children['link'].remove();
	this.pos.y = windowHeight + 100;
	_node_syncPosition(this, null, _node_clearCallback);
}

function _node_clearCallback(node){
	node.ele.remove();
	node.metaEle.remove();
	node.removeChildren();
	node.remove();
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
	if(this.parent.i != Comp.space.data.i){
		Pylon.executeOption(this.parent.i, 'trackNode');
	}
}

function _node_updateLink(node1, node2, mode){
	if(!node1 || !node1.children['link'] || !node2){
		return;
	}
	var link = node1.children['link'];
	if(mode == 'rough'){
		link.updateLinkPos(node2.children['mask'].position, node1.children['mask'].position);
	}else{
		var linkPoints = _pop_getPreciseLinkPoints(node2, node1);
		link.updateLinkPos(linkPoints[0], linkPoints[1]);
	}
}

function _node_syncPosition(node, linkingNode, mode, callback){
	var mask = node.children['mask'];
	if(mode == 'animation'){
		var diffX = node.pos.x - mask.position.x;
		var startX = mask.position.x;
		var diffY = node.pos.y - mask.position.y;
		var startY = mask.position.y;

		node.isMoving = true;
		var tween = node.tween(500);
		tween.onUpdate = function(event) {
			mask.position.x = startX + diffX * event.progress;
			mask.position.y = startY + diffY * event.progress;
			var w = node.ele.width();
			var h = node.ele.height();
			node.ele.css('left', mask.position.x - w/2);
			node.ele.css('top', mask.position.y - h/2);
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
		mask.position.x = node.pos.x;
		mask.position.y = node.pos.y;
		var w = node.ele.width();
		var h = node.ele.height();
		node.ele.css('left', mask.position.x - w/2);
		node.ele.css('top', mask.position.y - h/2);
		_node_updateLink(node, linkingNode);
		callback && callback(node);
	}
}

function _pop_getPreciseLinkPoints(linkingNode, node){
	//determined by text rect
	var mask1 = linkingNode.children['mask'];
	var mask2 = node.children['mask'];
	var anglePop1 = _getBoundsAngle(mask1.bounds);
    var anglePop2 = _getBoundsAngle(mask2.bounds);
    var v1 = new Point(mask1.position.x - mask2.position.x, mask1.position.y - mask2.position.y);
    var v2 = new Point(0, -1);
    var d = v2.getAngle(v1);
    if(d > 90){
        d = 180 - d;
    }
    var r1 = d < anglePop1 ? mask1.bounds.height * 0.5 / Math.cos(angleD2R * d) : mask1.bounds.width * 0.5 / Math.sin(angleD2R * d);
    var r2 = d < anglePop2 ? mask2.bounds.height * 0.5 / Math.cos(angleD2R * d) : mask2.bounds.width * 0.5 / Math.sin(angleD2R * d);
    
    var v1s = v1.normalize(r1);
    var v2s = v1.normalize(r2);
    return [{x:mask1.position.x - v1s.x, y:mask1.position.y - v1s.y}, {x:mask2.position.x + v2s.x, y:mask2.position.y + v2s.y}]
}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}
