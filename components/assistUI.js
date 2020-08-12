
function AssistUI(){
	//node ring
	var nodeRing = new Group();
	Comp.nodeRing = nodeRing;
	nodeRing.visible = false;
	nodeRing.show = _assistUI_showNodeRing;
	nodeRing.hide = _assistUI_hideNodeRing;
	nodeRing.node = null;
	nodeRing.sendToBack();

	//mouse marker
	var startPoint = new Path.Circle({
        center: [0,0],
        radius: 1,
        strokeColor: _fontColor,
        opacity: 0
    });
    startPoint.name = 'startPoint';
    var link = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: _fontColor,
	    strokeWidth: 1,
	    dashArray: [5,5],
	    opacity: 0
	});
	link.name = 'link';
    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 25,
        strokeColor: _fontColor,
        strokeWidth: 1.5,
        dashArray: [6,6],
        opacity: 0
    });
    endPoint.name = 'endPoint';
	var mouseMarker = new Group([startPoint, link, endPoint]);
	mouseMarker.startTrack = _assistUI_startMouseMarker;
	mouseMarker.updateTrack = _assistUI_updateMouseMarker;
	mouseMarker.finishTrack = _assistUI_endMouseMarker;
	mouseMarker.startPop = null;
	mouseMarker.show = false;
	Comp.mouseMarker = mouseMarker;

	//anchor
	var anchor = new PointText(new Point(0, 0));
	anchor.visible = false;
	anchor.fillColor = _fontColor;
	anchor.content = 'X';
	anchor.show = _assistUI_showAnchor;
	anchor.hide = _assistUI_hideAnchor;
	Comp.anchor = anchor;
}


function _assistUI_showNodeRing(node){
	this.hide();
	var nodeText = node.children['nodeText'];
	var radius = nodeText.bounds.width * 0.5;
	radius = Math.max(radius, 35);
	var color = _fontColor;
	var innerCircle = new Path.Circle({
        center: [node.pos.x, node.pos.y],
        radius: radius,
        strokeColor: color
    });
    innerCircle.opacity = 0.6;
    innerCircle.name = 'innerCircle';
    this.addChild(innerCircle);
    var outerCircle = new Path.Circle({
        center: [node.pos.x, node.pos.y],
        radius: radius + 10,
        strokeColor: color,
        fillColor: new Color(0, 0, 0, 0.01)
    });
    outerCircle.opacity = 0.4;
    outerCircle.name = 'outerCircle';
    outerCircle.onMouseLeave = _assistUI_mouseLeaveNodeRing;
    this.addChild(outerCircle);
    this.node = node;
	this.visible = true;
}

function _assistUI_hideNodeRing(){
	if(this.children['outerCircle']){
		this.children['outerCircle'].remove();
	}
	if(this.children['innerCircle']){
		this.children['innerCircle'].remove();
	}
	this.visible = false;
}

function _assistUI_mouseLeaveNodeRing(){
	Comp.nodeRing.hide();
	Comp.nodeRing.node.mouseLeave();
}

function _assistUI_startMouseMarker(pop, position){
	var color = _fontColor;
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

function _assistUI_updateMouseMarker(point){
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

function _assistUI_endMouseMarker(){
	this.children['startPoint'].opacity = 0;
	this.children['endPoint'].opacity = 0;
	this.children['link'].opacity = 0;
	this.show = false;
}

function _assistUI_showAnchor(position){
	Comp.anchor.position.x = position.x;
	Comp.anchor.position.y = position.y;
	Comp.anchor.visible = true;
}

function _assistUI_hideAnchor(position){
	Comp.anchor.visible = false;
}