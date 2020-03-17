function applyPaperPlus(){
    Item.prototype.initPopText = _d_initPopText;
    Item.prototype.initPopRing = _d_initPopRing;
    Item.prototype.initPopLink = _d_initPopLink;
    Item.prototype.updateLinkPos = _d_updateLinkPos;
    Item.prototype.rotatePopText = _d_rotatePopText;
    Item.prototype.moveTo = _d_moveTo;
    Item.prototype.adjustRotateCenter = _d_adjustRotateCenter;   
	Item.prototype.popFalling = _d_popFalling;
	Item.prototype.lineFalling = _d_lineFalling;
}

function _d_initPopText(pt, level) {
	var d = (pt.d + degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - pt.r * galaxyRadius * Math.cos(d * angleD2R);
    var y = rotateCenter.y - pt.r * galaxyRadius * Math.sin(d * angleD2R);
	this.position.x = x;
	this.position.y = y;
	this.content = pt.t;
	this.opacity = popTextOpacity;
	this.characterStyle.justification = "center";
	var fontSize = popFontSizeDefine[level] || 8;
	this.characterStyle.fontSize = fontSize;
    this.characterStyle.fillColor = new Color('white');
  
    this.idx = pt.idx;
    this.t = pt.t;
    this.r = pt.r;
    this.d = pt.d;
    this.on('mouseenter', function(){
    	PopRender.mouseenterPop(this);
    });
    this.on('mouseleave', function(){
    	PopRender.mouseleavePop(this);
    });
};

function _d_initPopRing(pt, popText) {
	var x = popText.position.x;
	var y = popText.position.y;
	var radius = popText.bounds.width * 0.85;
    var popInner = new Path.Circle({
        center: [x, y],
        radius: radius * 0.8,
        strokeColor: '#888'
    });
    var popOuter = new Path.Circle({
        center: [x, y],
        radius: radius,
        strokeColor: '#bbb'
    });
    this.addChild(popInner);
    this.addChild(popOuter);
    
    this.visible = false;
    this.radius = radius;
    this.idx = pt.idx;
    this.r = pt.r;
    this.d = pt.d;
};

function _d_initPopLink(popText, childPopText){
    var linkpoint = _getLinkPoint(popText, childPopText);
    this.segments[0].point.x = linkpoint.startX;
    this.segments[0].point.y = linkpoint.startY;
    this.segments[1].point.x = linkpoint.endX;
    this.segments[1].point.y = linkpoint.endY;
    this.opacity = 0.8;
    this.style.strokeColor = '#aaa';
    this.style.strokeWidth = 1.5;
    this.style.dashArray = [4,2];
    this.startIdx = popText.idx;
    this.endIdx = childPopText.idx;
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

function _d_rotatePopText(degree, center){
	center = center || rotateCenter
	var rotatePoint = new Point(this.position.x, this.position.y);
    rotatePoint = rotatePoint.rotate(degree, center);
    this.position.x = rotatePoint.x;
    this.position.y = rotatePoint.y;
}

function _d_moveTo(point){
	this.position.x = point.x;
	this.position.y = point.y;
}

function _d_adjustRotateCenter(){
	var d = (this.d + degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - this.r * galaxyRadius * Math.cos(d * angleD2R);
    var y = rotateCenter.y - this.r * galaxyRadius * Math.sin(d * angleD2R);
	this.position.x = x;
	this.position.y = y;
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
    //rotate pop2 a bit
    // if(dd)
    
    var v1s = v1.normalize(r1);
    var v2s= v1.normalize(r2);
    return {startX:pop1.position.x - v1s.x, startY:pop1.position.y - v1s.y, endX:pop2.position.x + v2s.x, endY:pop2.position.y + v2s.y}
}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}

function _d_popFalling(){
	var fallingAngle = 60;
	var fallingSpeed = 30;
	var x = fallingSpeed * Math.sin(fallingAngle * angleD2R);
	var y = fallingSpeed * Math.cos(fallingAngle * angleD2R);

	this.position.x += x;
	this.position.y += y;
	if(this.opacity.y < 1){
		this.opacity += 0.02;
	}
	if(this.position.y > view.size.height){
		this.active = false;
		this.opacity = 0;
	}
}

function _d_lineFalling(pop){
	var fallingAngle = 60;
	var maxLen = 120;
	if(pop.active){
		var endPos = PopRender.shootingStar.position;
		var startPos = this.segments[0].point;
		var v = new Point(endPos.x - startPos.x, endPos.y - startPos.y);
		var d = endPos.getDistance(startPos);
		d = Math.min(maxLen, d);
		v = v.normalize(d);
		this.segments[0].point.x = endPos.x - v.x;
		this.segments[0].point.y = endPos.y - v.y;
		this.segments[1].point.x = endPos.x;
		this.segments[1].point.y = endPos.y;
        
        if(this.opacity < 1){
            this.opacity += 0.02;
        } 
    }else{
        this.opacity = 0;
    }
}