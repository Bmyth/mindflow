function AssociateLink() {
	var startPoint = new Path.Circle({
        center: [0,0],
        radius: 1,
        strokeColor: '#666',
        opacity: 0
    });
    startPoint.name = 'startPoint';
    var link = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: '#aaa',
	    strokeWidth: 2,
	    dashArray: [5,5],
	    opacity: 0
	});
	link.name = 'link';
    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 15,
        strokeColor: '#666',
        opacity: 0
    });
    endPoint.name = 'endPoint';
	var associateLink = new Group([startPoint, link, endPoint]);
	associateLink.startAssociate = _assolink_startAssociate;
	associateLink.updateAssociate = _assolink_updateAssociate;
	associateLink.finishAssociate = _assolink_finishAssociate;
	return associateLink;
}

function _assolink_startAssociate(pop){
	var startPoint = this.children['startPoint'];
	startPoint.opacity = 1;
	var popCenter = pop.children['popCenter'];
	startPoint.position.x = popCenter.position.x;
	startPoint.position.y = popCenter.position.y;
	var endPoint = this.children['endPoint'];
	endPoint.position.x = popCenter.position.x;
	endPoint.position.y = popCenter.position.y;
	endPoint.opacity = 1;
	var link = this.children['link'];
	link.updateLinkPos(startPoint.position, endPoint.position);
	link.opacity = 1;
}

function _assolink_updateAssociate(point){
	var startPoint = this.children['startPoint'];
	var p = new Point(startPoint.position.x, startPoint.position.y);
	var d = p.getDistance(point);
	d = Math.min(d, maxLinkL);
	d = Math.max(d, minLinkL);

	var v = new Point(point.x - p.x, point.y - p.y);
	v = v.normalize(d);
	p = new Point(startPoint.position.x + v.x, startPoint.position.y + v.y);
    p.y = Math.min(p.y, skyHeight - 30);

    var endPoint = this.children['endPoint'];
	endPoint.position.x = p.x;
	endPoint.position.y = p.y;
    this.children['link'].updateLinkPos(0, p)
}

function _assolink_finishAssociate(){
	this.children['startPoint'].opacity = 0;
	this.children['endPoint'].opacity = 0;
	this.children['link'].opacity = 0;
}