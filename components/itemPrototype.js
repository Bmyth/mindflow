function itemProtoTypeInject(){
    Item.prototype.updateLinkPos = _d_updateLinkPos;
    Item.prototype.updatePointPos = _d_updatePointPos;
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