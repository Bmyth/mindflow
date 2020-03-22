function popProtoTypeInject() {
    Item.prototype.initPop = _pop_init;
    Item.prototype.refreshPop = _pop_refresh;
    Item.prototype.rotatePop = _pop_rotate;
	Item.prototype.updatePopLink = _pop_updateLink;
    Item.prototype.adjustPopToRotateCenter = _pop_adjustToRotateCenter; 
    Item.prototype.mouseEnterPopText = _pop_mouseEnterText;
    Item.prototype.mouseLeavePopText = _pop_mouseLeaveText;
} 

function _pop_init(pt, level, parentPop){
	this.idx = pt.idx;
    this.t = pt.t;
    this.r = parseFloat(pt.r);
    this.d = parseFloat(pt.d);
    this.level = level;
    _pop_initText(this, pt, level);
    _pop_initRing(this, pt, level);
    _pop_syncPosintion(this);
	
	if(parentPop){
		this.parentIdx = parentPop.idx;
		_pop_initLink(this, pt, parentPop);
	}
	this.refreshPop();
}

function _pop_initText(pop, pt, level) {
	var popText = new PointText();
	popText.content = pt.t;
	popText.opacity = popTextOpacity;
	popText.characterStyle.justification = "center";
	var fontSize = popFontSizeDefine[level] || 8;
	popText.characterStyle.fontSize = fontSize;
    popText.characterStyle.fillColor = new Color('#444');
  	popText.name = 'popText';

    popText.on('mouseenter', function(){this.mouseEnterPopText()});
    popText.on('mouseleave', function(){this.mouseLeavePopText()});
    pop.addChild(popText);
};

function _pop_initRing(pop, pt, level) {
	var popText = pop.children['popText'];
	var d = (pt.d + degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - pt.r * galaxyRadius * Math.cos(d * angleD2R);
    var y = rotateCenter.y - pt.r * galaxyRadius * Math.sin(d * angleD2R);
	var radius = popText.bounds.width * 0.85;
	var popCore = new Path.Circle({
        center: [x, y],
        radius: 5,
        fillColor: '#ccc'
    });
    popCore.name = 'popCenter';
    var popInner = new Path.Circle({
        center: [x, y],
        radius: radius * 0.85,
        strokeColor: '#888'
    });
    popInner.name = 'popInnerCircle';
    var popOuter = new Path.Circle({
        center: [x, y],
        radius: radius,
        strokeColor: '#bbb'
    });
    popOuter.name = 'popOuterCircle';
    pop.addChild(popCore);
    pop.addChild(popInner);
    pop.addChild(popOuter);
    pop.radius = radius;
};

function _pop_initLink(pop, pt, parentPop){
	var link = new Path.Line();
    link.opacity = 0.8;
    link.style.strokeColor = '#aaa';
    link.style.strokeWidth = 1.5;
    link.style.dashArray = [4,2];
    link.name = 'link';
    pop.addChild(link);
    pop.updatePopLink();
}

function _pop_refresh(status){
	if(status == ''){
		this.children['popCenter'].visible = false;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
	if(status == 'mouseenter'){
		this.children['popText'].opacity = 1;
		this.children['popInnerCircle'].visible = true;
		this.children['popOuterCircle'].visible = true;
	}
	if(status == 'mouseleave'){
		this.children['popText'].opacity = popTextOpacity;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
	else if(!status){
		this.children['popCenter'].visible = false;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
}

function _pop_rotate(degree){
	var popCenter = this.children['popCenter'];
	var point = new Point(popCenter.position.x, popCenter.position.y);
	point = point.rotate(degree, rotateCenter);
	popCenter.position.x = point.x;
	popCenter.position.y = point.y;
	_pop_syncPosintion(this);
}

function _pop_mouseEnterText(){
	if(Stage.status == ''){
        var pop = this.parent;
        pop.refreshPop('mouseenter');
        this.onHover = true;
        ViewController.onMouseEnterPop(pop);
    }
}

function _pop_mouseLeaveText(){
	//this.parent: fix delete ghost popText
	if(this.onHover && this.parent){
		this.onHover = false;
		var pop = this.parent;
        pop.refreshPop('mouseleave');
        ViewController.onMouseLeavePop(pop);
    }
}

function _pop_updateLink(mode){
	var link = this.children['link'];
	if(!link){
		return;
	}
	var popCenter = this.children['popCenter'];
	var parent = Pops.getPopByIndex(this.parentIdx);
	var parentCenter = parent.children['popCenter']
	if(mode == 'rough'){
		link.updateLinkPos(parentCenter.position, popCenter.position);
	}else{
		var popText = parent.children['popText'];
		var childPopText = this.children['popText'];
	    var linkpoint = _getLinkPoint(popText, childPopText);
	    link.updateLinkPos({x:linkpoint.startX, y:linkpoint.startY}, {x:linkpoint.endX, y:linkpoint.endY});
	}
}

function _pop_adjustToRotateCenter(){
	var d = (this.d + degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - this.r * galaxyRadius * Math.cos(d * angleD2R);
    var y = rotateCenter.y - this.r * galaxyRadius * Math.sin(d * angleD2R);
	this.children['popCenter'].position.x = x;
	this.children['popCenter'].position.y = y;
	_pop_syncPosintion(this);
}

function _pop_syncPosintion(pop){
	var popCenter = pop.children['popCenter'];
	pop.children['popText'].position.x = popCenter.position.x;
	pop.children['popText'].position.y = popCenter.position.y;
	pop.children['popInnerCircle'].position.x = popCenter.position.x;
	pop.children['popInnerCircle'].position.y = popCenter.position.y;
	pop.children['popOuterCircle'].position.x = popCenter.position.x;
	pop.children['popOuterCircle'].position.y = popCenter.position.y;
}  

function _getLinkPoint(pop1, pop2){
    var anglePop1 = _getBoundsAngle(pop1.bounds);
    var anglePop2 = _getBoundsAngle(pop2.bounds);
    var v1 = new Point(pop1.position.x - pop2.position.x, pop1.position.y - pop2.position.y);
    var v2 = new Point(0, -1);
    var d = v2.getAngle(v1);
    var dd = v2.getDirectedAngle(v1);
    if(d > 90){
        d = 180 - d;
    }
    var r1 = d < anglePop1 ? pop1.bounds.height * 0.5 / Math.cos(angleD2R * d) : pop1.bounds.width * 0.5 / Math.sin(angleD2R * d);
    var r2 = d < anglePop2 ? pop2.bounds.height * 0.5 / Math.cos(angleD2R * d) : pop2.bounds.width * 0.5 / Math.sin(angleD2R * d);
    
    var v1s = v1.normalize(r1);
    var v2s= v1.normalize(r2);
    return {startX:pop1.position.x - v1s.x, startY:pop1.position.y - v1s.y, endX:pop2.position.x + v2s.x, endY:pop2.position.y + v2s.y}
}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}
