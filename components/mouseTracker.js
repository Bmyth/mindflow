function MouseTracker() {
	var startPoint = new Path.Circle({
        center: [0,0],
        radius: 1,
        strokeColor: theme.fontColor,
        opacity: 0
    });
    startPoint.name = 'startPoint';
    var link = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: theme.fontColor,
	    strokeWidth: 1.5,
	    dashArray: [5,5],
	    opacity: 0
	});
	link.name = 'link';
    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 15,
        strokeColor: theme.fontColor,
        dashArray: [6,6],
        opacity: 0
    });
    endPoint.name = 'endPoint';
	var mouseTracker = new Group([startPoint, link, endPoint]);
	mouseTracker.startTrack = _mt_startTrack;
	mouseTracker.updateTrack = _mt_updateTrack;
	mouseTracker.finishTrack = _mt_finishTrack;
	return mouseTracker;
}

function _mt_startTrack(pop, position){
	if(Stage.status == 'onBranchNodePick'){
		var startPoint = this.children['startPoint'];
		startPoint.opacity = 1;
		startPoint.position.x = pop.pos.x;
		startPoint.position.y = pop.pos.y;
		var endPoint = this.children['endPoint'];
		endPoint.position.x = position ? position.x : pop.pos.x;
		endPoint.position.y = position ? position.y : pop.pos.y;
		endPoint.opacity = 1;
		var link = this.children['link'];
		link.updateLinkPos(startPoint.position, endPoint.position);
		link.opacity = 1;
	}
	else if(Stage.status == 'onConnectNodePick'){
		this.children['startPoint'].opacity = 0;
		var endPoint = this.children['endPoint'];
		endPoint.position.x = position ? position.x : pop.pos.x;
		endPoint.position.y = position ? position.y : pop.pos.y;
		endPoint.opacity = 1;
		this.children['link'].opacity = 0;
	}
}

function _mt_updateTrack(point){
	if(Stage.status == 'onBranchNodePick'){
		var startPoint = this.children['startPoint'];
		var p = new Point(startPoint.position.x, startPoint.position.y);
		var d = p.getDistance(point);
		d = Math.min(d, maxPopLinkLength);
		d = Math.max(d, minPopLinkLength);

		var v = new Point(point.x - p.x, point.y - p.y);
		v = v.normalize(d);
		p = new Point(startPoint.position.x + v.x, startPoint.position.y + v.y);

	    var endPoint = this.children['endPoint'];
		endPoint.position.x = p.x;
		endPoint.position.y = p.y;
	    this.children['link'].updateLinkPos(0, p)
	}
	else if(Stage.status == 'onConnectNodePick'){
		var endPoint = this.children['endPoint'];
		endPoint.position.x = point.x;
		endPoint.position.y = point.y;
	}

}

function _mt_finishTrack(){
	this.children['startPoint'].opacity = 0;
	this.children['endPoint'].opacity = 0;
	this.children['link'].opacity = 0;
}