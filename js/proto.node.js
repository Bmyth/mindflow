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
    var newNode = !this.ele;
    if(newNode){
    	_node_generateEle(this, spaceNode);
    }

    _node_refrshText(this, spaceNode);
    _node_refreshLink(this, parentUiNode);
    _node_refreshPosition(this, spaceNode, parentUiNode);
    _node_syncPos(this, parentUiNode);
    _node_fadeIn(this, finish);

    function finish(node){
    	if(node.children['link']){
    		node.children['link'].opacity = 1;
    	}
    }
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
	   	// mask.opacity = 0.5;
	  	mask.i = uiNode.i;
	  	mask.onMouseEnter = _node_onMouseEnterText;
    	mask.onMouseLeave = _node_onMouseLeaveText;
    	mask.onClick = _node_onClickText;
    	uiNode.addChild(mask);
    	uiNode.bringToFront();
    }
	
	var fontSize = 16;
	var text = Model.getNodeInList(spaceNode.i)['t'];

	uiNode.ele.text(text).css(
		{'fontSize': fontSize + 'px'}
		// {'fontSize': fontSize + 'px', 'color':fontColor, 'maxWidth':Comp.map.blockTextSize, 'maxHeight':Comp.map.blockTextSize}
	);
	// var ratio = Comp.map.fitBlockRatio(uiNode.ele);
	var ratio = 1;

	uiNode.ele.css({'transform':'scale(' + ratio + ',' + ratio + ')'});
    mask.bounds.width = uiNode.ele.width();
    mask.bounds.height = uiNode.ele.height();
};

function _node_refreshLink(uiNode, uiParentNode){
	uiNode.children['link'] && uiNode.children['link'].remove();
	if(uiParentNode && uiParentNode.children['mask']){
		var link = new Path.Line();
	    link.opacity = 0;
	    var color = Theme.lineColor;
	    link.style.strokeColor = color;
	    link.style.strokeWidth = 1.2;
	    link.style.dashArray = [5,5];
	    link.name = 'link';
	    uiNode.addChild(link);
	}
}

function _node_refreshPosition(uiNode, spaceNode, parentUiNode){
	var x,y;
	if(spaceNode.i == Comp.space.idx){
		x = y = 0; 
	}else{
		x = spaceNode.x;
		y = spaceNode.y;
	}
	uiNode.metaEle.attr({'x':x, 'y':y});

    x = parseFloat(windowWidth * x);
    y = parseFloat(windowHeight * y);
	uiNode.pos = Comp.map.fitBlockPos({x:x, y:y})
}

function _node_fadeIn(node, callback){
	node.animate(0.02, null, update, callback);

	function update(node, progress, status) {
		node.ele.css('opacity', (progress));
	};
}

function _node_clear(){
	var node = this;
	this.children['link'] && this.children['link'].remove();
	_node_fadeOut(node, finish);

	function finish(node, status){
		node.children['mask'].off(['click','mouseenter','mouseleave']);
		node.ele.remove();
		node.metaEle.remove();
		node.remove();
	}
}

function _node_fadeOut(node, callback){
	node.animate(0.02, null, update, callback);

	function update(node, progress, status) {
		node.ele.css('opacity', (1 - progress));
	};
}

function _node_onMouseEnterText(){
	var node = this.parent;
	if(!node.isMoving && Pylon.status != 'NODE_ON_BRANCH'){
		node.ele.addClass('onhover');
		var d = new Date();
	 	node.onHover = d.getTime();
	 	Pylon.executeOption(node, 'hoverNode');
	 	Effect.highlightNodeText({node:node, type:'hover'}, 'start');
	}
}

function _node_onMouseLeaveText(){
	var node = this.name == 'mask' ? this.parent : this;
	if(!node.onHover){
		return;
	}
	var d = new Date();
	var timeDiff = d.getTime() - node.onHover;
	node.onHover = false;
	Pylon.executeOption(node, 'unHoverNode');
	Effect.highlightNodeText({node:node, type:'hover'}, 'end');
	if(timeDiff > 250){
		Effect.lightScatter(node);
	}
}

function _node_onClickText(){
	// var node = this.parent;
}

function _node_animateSyncPos(node, linkingNode, callback){
	node.animate(0.03, start, update, finish);

	function start(node, status){
		var mask = node.children['mask'];
		status.diffX = node.pos.x - mask.position.x;
		status.startX = mask.position.x;
		status.diffY = node.pos.y - mask.position.y;
		status.startY = mask.position.y;
		status.linkingNode = linkingNode;
	}

	function update(node, progress, status) {
		var mask = node.children['mask'];
		mask.position.x = status.startX + status.diffX * progress;
		mask.position.y = status.startY + status.diffY * progress;
		var w = node.ele.width();
		var h = node.ele.height();
		node.ele.css('left', mask.position.x - w/2);
		node.ele.css('top', mask.position.y - h/2);
		node.updateNodeLink(status.linkingNode, 'rough');
	};

	function finish(node, status){
		_node_syncPos(node, status.linkingNode);
		callback && callback(node);
	}
}

function _node_syncPos(node, linkingNode){
	var mask = node.children['mask'];
	mask.position.x = node.pos.x;
	mask.position.y = node.pos.y;
	var w = node.ele.width();
	var h = node.ele.height();
	node.ele.css('left', mask.position.x - w/2);
	node.ele.css('top', mask.position.y - h/2);
	node.updateNodeLink(linkingNode);
}
