function MouseTracker() {
	var startPoint = new Path.Circle({
        center: [0,0],
        radius: 1,
        strokeColor: '#aaa',
        opacity: 0
    });
    startPoint.name = 'startPoint';
    var link = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: '#aaa',
	    strokeWidth: 1,
	    dashArray: [5,5],
	    opacity: 0
	});
	link.name = 'link';
    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 25,
        strokeColor: '#aaa',
        strokeWidth: 1.5,
        dashArray: [6,6],
        opacity: 0
    });
    endPoint.name = 'endPoint';
	var mouseTracker = new Group([startPoint, link, endPoint]);
	mouseTracker.startTrack = _mt_startTrack;
	mouseTracker.updateTrack = _mt_updateTrack;
	mouseTracker.finishTrack = _mt_finishTrack;
	mouseTracker.startPop = null;
	mouseTracker.show = false;
	return mouseTracker;
}

function _mt_startTrack(pop, position){
	var color = theme.fontColor;
	var startPoint = this.children['startPoint'];
	startPoint.opacity = 1;
	startPoint.position.x = pop.pos.x;
	startPoint.position.y = pop.pos.y;
	startPoint.style.strokeColor = color;
	var endPoint = this.children['endPoint'];
	endPoint.position.x = position ? position.x : pop.pos.x;
	endPoint.position.y = position ? position.y : pop.pos.y;
	endPoint.opacity = 1;
	endPoint.style.strokeColor = color;
	var link = this.children['link'];
	link.updateLinkPos(startPoint.position, endPoint.position);
	link.opacity = 1;
	link.style.strokeColor = color;
	this.startPop = pop;
	this.show = true;
}

function _mt_updateTrack(point){
	if(this.show){
		var startPoint = this.children['startPoint'];
		startPoint.position.x = this.startPop.pos.x;
		startPoint.position.y = this.startPop.pos.y;

		var p = new Point(startPoint.position.x, startPoint.position.y);
		var d = p.getDistance(point);

		var v = new Point(point.x - p.x, point.y - p.y);
		v = v.normalize(d);
		p = new Point(startPoint.position.x + v.x, startPoint.position.y + v.y);

	    var endPoint = this.children['endPoint'];
		endPoint.position.x = p.x;
		endPoint.position.y = p.y;
	    this.children['link'].updateLinkPos(startPoint.position, p)
	}
}

function _mt_finishTrack(){
	this.children['startPoint'].opacity = 0;
	this.children['endPoint'].opacity = 0;
	this.children['link'].opacity = 0;
	this.show = false;
}