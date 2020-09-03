Comp.assistUI = {
	init: _assistUI_init
}

function _assistUI_init(){
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

	//option panel
	var optionPanel = {
		show: _assistUI_showOptionPanel,
		hide: _assistUI_hideOptionPanel
	}
	Comp.optionPanel = optionPanel;
}

function _assistUI_startMouseMarker(node, position){
	node.highlight();
	this.startPos = node.pos;
    var endPoint = new Path.Circle({
        center: [0,0],
        radius: 25,
        strokeColor: Theme.themeColor1,
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
	    strokeColor: Theme.themeColor1,
	    strokeWidth: 1,
	    dashArray: [5,5]
	});
	link.name = 'link';
	link.updateLinkPos(this.startPos, endPoint.position);
    this.addChild(link);
}

function _assistUI_updateMouseMarker(point){
	var p = new Point(this.startPos.x, this.startPos.y);
	var d = p.getDistance(point);

	var v = new Point(point.x - p.x, point.y - p.y);
	v = v.normalize(d);
	p = new Point(this.startPos.x + v.x, this.startPos.y + v.y);

    var endPoint = this.children['endPoint'];
	endPoint.position.x = p.x;
	endPoint.position.y = p.y;
    this.children['link'].updateLinkPos(this.startPos, p)
}

function _assistUI_endMouseMarker(){
	Pylon.onBranchingNode && Pylon.onBranchingNode.highlight(false);
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

function _assistUI_showOptionPanel(node){

}

function _assistUI_hideOptionPanel(){

}