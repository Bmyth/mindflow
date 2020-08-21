Comp.assistUI = {
	init: _assistUI_init
}

function _assistUI_init(){
	//node ring
	var nodeRing = new Group();
	Comp.nodeRing = nodeRing;
	nodeRing.visible = false;
	nodeRing.show = _assistUI_showNodeRing;
	nodeRing.hide = _assistUI_hideNodeRing;
	nodeRing.node = null;
	nodeRing.sendToBack();

	//mouse marker
	var mouseMarker = new Group();
	mouseMarker.startTrack = _assistUI_startMouseMarker;
	mouseMarker.updateTrack = _assistUI_updateMouseMarker;
	mouseMarker.finishTrack = _assistUI_endMouseMarker;
	Comp.mouseMarker = mouseMarker;

	//anchor
	var anchor = new PointText(new Point(0, 0));
	anchor.visible = false;
	anchor.fillColor = Theme.themeColor1;
	anchor.content = 'X';
	anchor.show = _assistUI_showAnchor;
	anchor.hide = _assistUI_hideAnchor;
	Comp.anchor = anchor;
}


function _assistUI_showNodeRing(node){
	this.hide();
	var mask = node.children['mask'];
	var radius = mask.bounds.width * 0.6;
	radius = Math.max(radius, 20);
	var color = Theme.themeColor1;
	var innerCircle = new Path.Circle({
        center: [node.pos.x, node.pos.y],
        radius: radius,
        strokeColor: color,
        strokeWidth: 2.5,
        dashArray: [10,5],
        fillColor: new Color(0, 0, 0, 0.01)
    });
    innerCircle.opacity = 0.6;
    innerCircle.name = 'innerCircle';
    this.addChild(innerCircle);
    innerCircle.onMouseLeave = _assistUI_mouseLeaveNodeRing;
    this.node = node;
	this.visible = true;
}

function _assistUI_hideNodeRing(){
	if(this.children['innerCircle']){
		this.children['innerCircle'].remove();
	}
	this.visible = false;
}

function _assistUI_mouseLeaveNodeRing(){
	Comp.nodeRing.hide();
	Comp.nodeRing.node.mouseLeave();
}

function _assistUI_startMouseMarker(node, position){
	var mask = node.children['mask'];
	var radius = mask.bounds.width * 0.6;
	radius = Math.max(radius, 20);
	var startPoint = new Path.Circle({
        center: [node.pos.x, node.pos.y],
        radius: radius,
        strokeColor: Theme.themeColor1,
        strokeWidth: 2.5,
        dashArray: [10,5],
        fillColor: new Color(0, 0, 0, 0.01)
    });
    startPoint.name = 'startPoint';
    this.addChild(startPoint);

    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 25,
        strokeColor: Theme.lineColor,
        strokeWidth: 1.5,
        dashArray: [6,6]
    });;
	endPoint.position.x = position ? position.x : node.pos.x;
	endPoint.position.y = position ? position.y : node.pos.y;
	endPoint.name = 'endPoint';
	this.addChild(endPoint);

    var link = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: Theme.lineColor,
	    strokeWidth: 1,
	    dashArray: [5,5]
	});
	link.name = 'link';
	link.updateLinkPos(startPoint.position, endPoint.position);
    this.addChild(link);
}

function _assistUI_updateMouseMarker(point){
	var startPoint = this.children['startPoint'];
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

function _assistUI_endMouseMarker(){
	this.removeChildren();
}

function _assistUI_showAnchor(position){
	var pos = Comp.map.fitBlockPos(position);
	Comp.anchor.position.x = pos.x;
	Comp.anchor.position.y = pos.y;
	Comp.anchor.visible = true;
}

function _assistUI_hideAnchor(position){
	Comp.anchor.visible = false;
}