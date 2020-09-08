function itemProtoTypeInject(){
    Item.prototype.updateLinkPos = _d_updateLinkPos;
    Item.prototype.updatePointPos = _d_updatePointPos;
    Item.prototype.animate = _node_animate;
    Item.prototype.updateNodeLink = _node_updateLink;
}

function _d_updateLinkPos(start, end){
	if(start){
		this.segments[0].point.x = start.x;
		this.segments[0].point.y = start.y;
	}
	if(end){
		this.segments[1].point.x = end.x;
		this.segments[1].point.y = end.y;
	}
}

function _d_updatePointPos(point){
	this.position.x = point.x;
	this.position.y = point.y;
}

function _node_animate(speed, start, update, finish){
	var node = this;
	var status = {};
	start && start(node, status);
	node.isMoving = true;
	var progress = 0;
	node.onFrame = function (event) {
		if(progress < 1){
			progress += speed;
			update && update(node, progress, status);
		}else{
			node.isMoving = false;
			node.onFrame = null;
			finish && finish(node, status);
		}
	};
}

function _node_updateLink(node2, mode){
	var node1 = this;
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

_link_offset = 4;
function _pop_getPreciseLinkPoints(linkingNode, node){

	//determined by mask rect
	var mask1 = linkingNode.children['mask'];
	var mask2 = node.children['mask'];
	var anglePop1 = _getBoundsAngle(mask1.bounds);
    var anglePop2 = _getBoundsAngle(mask2.bounds);

    var v1 = new Point(mask1.position.x - mask2.position.x, mask1.position.y - mask2.position.y);
    var v2 = new Point(0, -1);

    var d = v2.getAngle(v1);
    if(isNaN(d)){
    	return [{x:linkingNode.pos.x, y:mask1.position.y}, {x:linkingNode.pos.x, y:mask2.position.y}]
    }
    var r1, r2;
    if(d >= 90){
    	d = 180 - d;
    }
    if(d == 0){
    	r1 = mask1.bounds.height * 0.5;
    	r2 = mask2.bounds.height * 0.5;
    }else if(d == 90){
    	r1 = mask1.bounds.width * 0.5;
    	r2 = mask2.bounds.width * 0.5;
    }else{
    	r1 = d < anglePop1 ? mask1.bounds.height * 0.5 / Math.cos(angleD2R * d) : mask1.bounds.width * 0.5 / Math.sin(angleD2R * d);
    	r2 = d < anglePop2 ? mask2.bounds.height * 0.5 / Math.cos(angleD2R * d) : mask2.bounds.width * 0.5 / Math.sin(angleD2R * d);
    }

    var v1s = v1.normalize(r1 + _link_offset);
    var v2s = v1.normalize(r2 + _link_offset);
    return [{x:mask1.position.x - v1s.x, y:mask1.position.y - v1s.y}, {x:mask2.position.x + v2s.x, y:mask2.position.y + v2s.y}]
}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}