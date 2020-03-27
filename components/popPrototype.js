function popProtoTypeInject() {
    Item.prototype.initPop = _pop_init;
    Item.prototype.refreshPop = _pop_refresh;
    Item.prototype.rotatePop = _pop_rotate;
	Item.prototype.updatePopLink = _pop_updateLink;
    Item.prototype.adjustPopToRotateCenter = _pop_adjustToRotateCenter;
    Item.prototype.turnOn = _pop_turnOn; 
    Item.prototype.turnOff = _pop_turnOff; 
    Item.prototype.mouseEnterPopText = _pop_mouseEnterText;
    Item.prototype.mouseLeavePopText = _pop_mouseLeaveText;
} 

function _pop_init(pt, level, parentPop, rootPt){
	this.idx = pt.idx;
    this.t = pt.t;
    this.r = parseFloat(pt.r);
    this.d = parseFloat(pt.d);
    this.level = level;
    this.on = rootPt.on;
    _pop_initText(this, pt, level);
    _pop_initRing(this, pt, level);
    _pop_syncPosintion(this);
	
	if(parentPop){
		this.parentIdx = parentPop.idx;
		_pop_initLink(this);
	}
	this.refreshPop();
}

function _pop_initText(pop, pt, level) {
	var popText = new PointText();
	popText.content = pt.t;
	popText.opacity = popTextOpacity;
	popText.characterStyle.justification = "center";
	var fontSize = popFontSizeDefine[level] || 10;
	popText.characterStyle.fontSize = fontSize;
    popText.characterStyle.fillColor = new Color('#444');
  	popText.name = 'popText';

    popText.on('mouseenter', function(){this.mouseEnterPopText()});
    popText.on('mouseleave', function(){this.mouseLeavePopText()});
    pop.addChild(popText);
};

function _pop_initRing(pop, pt, level) {
	var popText = pop.children['popText'];
	var d = (parseFloat(pt.d) + Stage.degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - pt.r * Stage.galaxyRadius * Math.cos(d * angleD2R);
    var y = Stage.rotateCenter.y - pt.r * Stage.galaxyRadius * Math.sin(d * angleD2R);

	var radius = popText.bounds.width * 0.85;
	var centerRadius =  level == 0 ? 8 : 5;
	var popCenter = new Path.Circle({
        center: [x, y],
        radius: centerRadius,
        fillColor: '#ccc'
    });
    popCenter.name = 'popCenter';
    var popInner = new Path.Circle({
        center: [x, y],
        radius: radius * 0.85,
        strokeColor: '#ccc'
    });
    popInner.name = 'popInnerCircle';
    var popOuter = new Path.Circle({
        center: [x, y],
        radius: radius,
        strokeColor: '#bbb'
    });
    popOuter.name = 'popOuterCircle';
    pop.addChild(popCenter);
    pop.addChild(popInner);
    pop.addChild(popOuter);
    pop.radius = radius;
};

function _pop_initLink(pop){
	var link = new Path.Line();
    link.opacity = 0.8;
    link.style.strokeColor = '#ccc';
    link.style.strokeWidth = 1.5;
    link.style.dashArray = [4,2];
    link.name = 'link';
    pop.addChild(link);
    pop.updatePopLink();
}

function _pop_refresh(status){
	if(status == '' || status == null){
		if(this.on){
			this.children['popCenter'].visible = false;
			this.children['popText'].visible = true;
			this.children['popInnerCircle'].visible = false;
			this.children['popOuterCircle'].visible = false;
		}else{
			this.children['popCenter'].visible = true;
			this.children['popText'].visible = false;
			this.children['popInnerCircle'].visible = false;
			this.children['popOuterCircle'].visible = false;
		}
	}
	if(status == 'turnOn'){
		this.children['popText'].visible = true;
		this.children['popText'].opacity = popTextOpacity;
		this.children['popCenter'].visible = false;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
	if(status == 'turnOff'){
		this.children['popText'].visible = false;
		this.children['popCenter'].visible = true;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
	if(status == 'mouseenter'){
		this.children['popText'].opacity = 1;
		this.children['popCenter'].opacity = 1;
		this.children['popInnerCircle'].visible = true;
		this.children['popOuterCircle'].visible = true;
	}
	if(status == 'mouseleave'){
		this.children['popText'].opacity = popTextOpacity;
		this.children['popCenter'].opacity = popTextOpacity;
		this.children['popInnerCircle'].visible = false;
		this.children['popOuterCircle'].visible = false;
	}
}

function _pop_rotate(degree){
	var popCenter = this.children['popCenter'];
	var point = new Point(popCenter.position.x, popCenter.position.y);
	point = point.rotate(degree, Stage.rotateCenter);
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
	if(!link || !this.parentIdx){
		return;
	}
	var popCenter = this.children['popCenter'];
	var parent = Pops.getPopByIndex(this.parentIdx);
	var parentCenter = parent.children['popCenter']
	if(mode == 'rough'){
		link.updateLinkPos(parentCenter.position, popCenter.position);
	}else{
		var linkPoints = _pop_getPreciseLinkPoints(parent, this);
		link.updateLinkPos(linkPoints[0], linkPoints[1]);
	}
}

function _pop_adjustToRotateCenter(){
	var d = (this.d + Stage.degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - this.r * Stage.galaxyRadius * Math.cos(d * angleD2R);
    var y = Stage.rotateCenter.y - this.r * Stage.galaxyRadius * Math.sin(d * angleD2R);
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

function _pop_turnOn(childrenApply){
	this.on = true;
	this.updatePopLink();
	this.refreshPop('turnOn');
	if(childrenApply){
		var childrenIdx = Model.getChildrenIdx(this.idx);
		childrenIdx.forEach(function(idx){
			var child = Pops.getPopByIndex(idx);
			child.turnOn(childrenApply);
		})
	}
}

function _pop_turnOff(childrenApply){
	this.on = false;
	this.updatePopLink();
	this.refreshPop('turnOff');
	if(childrenApply){
		var childrenIdx = Model.getChildrenIdx(this.idx);
		childrenIdx.forEach(function(idx){
			var child = Pops.getPopByIndex(idx);
			child.turnOff(childrenApply);
		})
	}
}

function _pop_getPreciseLinkPoints(parentPop, pop){
	//determined by text rect
	if(pop.on){
		var text1 = parentPop.children['popText'];
		var text2 = pop.children['popText'];
		var anglePop1 = _getBoundsAngle(text1.bounds);
	    var anglePop2 = _getBoundsAngle(text2.bounds);
	    var v1 = new Point(text1.position.x - text2.position.x, text1.position.y - text2.position.y);
	    var v2 = new Point(0, -1);
	    var d = v2.getAngle(v1);
	    if(d > 90){
	        d = 180 - d;
	    }
	    var r1 = d < anglePop1 ? text1.bounds.height * 0.5 / Math.cos(angleD2R * d) : text1.bounds.width * 0.5 / Math.sin(angleD2R * d);
	    var r2 = d < anglePop2 ? text2.bounds.height * 0.5 / Math.cos(angleD2R * d) : text2.bounds.width * 0.5 / Math.sin(angleD2R * d);
	    
	    var v1s = v1.normalize(r1);
	    var v2s = v1.normalize(r2);
	    return [{x:text1.position.x - v1s.x, y:text1.position.y - v1s.y}, {x:text2.position.x + v2s.x, y:text2.position.y + v2s.y}]
	}
	//determined by popCenter radius
	else{
		var center1 = parentPop.children['popCenter'];
		var center2 = pop.children['popCenter'];
	    var v1 = new Point(center1.position.x - center2.position.x, center1.position.y - center2.position.y);	   
	    var v1s = v1.normalize(center1.bounds.width * 0.8);
	    var v2s = v1.normalize(center2.bounds.width * 0.8);
	    return [{x:center1.position.x - v1s.x, y:center1.position.y - v1s.y}, {x:center2.position.x + v2s.x, y:center2.position.y + v2s.y}]
	}

}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}
