function popProtoTypeInject() {
    Item.prototype.initPop = _pop_init;
    Item.prototype.updatePopModel = _pop_updatePopModel;
    Item.prototype.deletePop = _pop_deletePop;
    Item.prototype.refreshPop = _pop_refresh;
    Item.prototype.rotatePop = _pop_rotate;
	Item.prototype.updatePopLink = _pop_updateLink;
    Item.prototype.adjustPopToRotateCenter = _pop_adjustToRotateCenter;
    Item.prototype.turnOn = _pop_turnOn; 
    Item.prototype.turnOff = _pop_turnOff; 
    Item.prototype.getPopText = _popText_get; 
    Item.prototype.popTextShow = _popText_show; 
    Item.prototype.popTextHide = _popText_hide;
    Item.prototype.popTextChangeOpacity = _popText_changeOpacity;  
    Item.prototype.mouseEnterPopText = _pop_mouseEnterText;
    Item.prototype.mouseLeavePopText = _pop_mouseLeaveText;
    Item.prototype.clickPopText = _pop_clickPopText;

    BackPaper.Item.prototype.initPop = _pop_init;
    BackPaper.Item.prototype.refreshPop = _pop_refresh;
    BackPaper.Item.prototype.rotatePop = _pop_rotate;
	BackPaper.Item.prototype.updatePopLink = _pop_updateLink;
    BackPaper.Item.prototype.adjustPopToRotateCenter = _pop_adjustToRotateCenter;
    BackPaper.Item.prototype.turnOn = _pop_turnOn; 
    BackPaper.Item.prototype.turnOff = _pop_turnOff; 
    BackPaper.Item.prototype.mouseEnterPopText = _pop_mouseEnterText;
    BackPaper.Item.prototype.mouseLeavePopText = _pop_mouseLeaveText;
} 

function _pop_init(pt, level, parentPop, rootPt){
	this.idx = pt.idx;
    this.t = pt.t;
    this.r = parseFloat(pt.r);
    this.d = parseFloat(pt.d);
    this.c = pt.c;
    this.at = !!pt.at;
    this.level = level;
    this.on = rootPt.on;

   	var d = (parseFloat(pt.d) + Stage.degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - pt.r * Stage.galaxyRadius * Math.cos(d * angleD2R);
    var y = Stage.rotateCenter.y - pt.r * Stage.galaxyRadius * Math.sin(d * angleD2R);
	this.pos = {x:x, y:y};
    _pop_initText(this, pt, level);
    var radius = this.children['popText'].bounds.width * 0.85;
	this.radius = radius;
	if(level == 0){
    	_pop_initStar(this, pt, level);
    }
    _pop_syncPosition(this);
	
	if(parentPop){
		this.parentIdx = parentPop.idx;
		_pop_initLink(this);
	}
	this.refreshPop();
}

function _pop_initText(pop, pt, level) {
	var firstTime = pop.children['popText'] == null;
	var popText = pop.children['popText'];
	var fontSize = theme.popFontSizeDefine[level] || 16;
	var content = pt.at ? pt.t + ' ..' : pt.t;
	if(level != 0){
		var popTextEle = null;
		if(firstTime){
			popTextEle = $('<p class="pop-txt"></p>').appendTo(MiddleLayer);
		}else{
			popTextEle = popText.ele;
		}
		popTextEle.text(content);
		popTextEle.css('opacity',theme.popTextOpacity);
		popTextEle.css('textAlign',"center");
		popTextEle.css('fontSize',fontSize + 'px');
	    popTextEle.css('color',theme.fontColor);
	    popTextEle.attr('idx', pt.idx);
	    if(pt.c){
	    	popTextEle.addClass('pop-link');
	    }else{
	    	popTextEle.removeClass('pop-link');
	    }
	    var width = popTextEle.width();
	    var height = popTextEle.height();
	    if(firstTime){
	    	popText = new Path.Rectangle({
		    	size: [width, height],
		    	fillColor: '#333'
		    });
	    }
		popText.opacity = 0.0001;
	  	popText.name = 'popText';
	  	popText.ele = popTextEle;
	}else{
		if(firstTime){
	    	popText = new PointText({
		        content: content,
		        justification: 'center',
		        fontSize: fontSize,
		        fillColor: theme.fontColor
		    });
	    }
	    popText.name = 'popText';
	}
	if(firstTime){
		popText.onMouseEnter = function(){this.mouseEnterPopText()};
    	popText.onMouseLeave = function(){this.mouseLeavePopText()};
    	popText.onClick = function(){this.clickPopText()}
    	pop.addChild(popText);
	}
};

function _pop_initStar(pop, pt, level){
	if(pop.children['star']){
		pop.children['star'].remove();
	}

	var pointsNum = pt.children ? pt.children.length : 6;
	pointsNum = Math.max(pointsNum, 6);
	var star = new Path.Star({
	    center: [0,0],
	    points: pointsNum,
	    radius1: pop.radius * 0.75,
	    radius2: pop.radius * 1.2,
	    strokeColor: theme.fontColor,
	    fillColor: theme.skyColor
	});
	star.name = 'star';
	pop.addChild(star);
	pop.children['popText'].bringToFront();
}

function _pop_initLink(pop){
	if(pop.children['link']){
		pop.children['link'].remove();
	}

	var link = new Path.Line();
    link.opacity = 0.8;
    link.style.strokeColor = theme.fontColor;
    link.style.strokeWidth = 1.5;
    link.style.dashArray = [5,5];
    link.name = 'link';
    pop.addChild(link);
    pop.updatePopLink();
}

function _pop_refresh(status){
	var popText = this.children['popText'];
	var popLink = this.children['link'];
	if(status == '' || status == null){
		if(this.on || this.level == 0){
			if(popLink){
				popLink.visible = true;
			}
			popText.popTextShow();
		}
		else{
			if(popLink){
				popLink.visible = false;
			}
			popText.popTextHide();
		}
	}
	if(status == 'turnOn'){
		if(popLink){
			popLink.visible = true;
		}
		popText.popTextShow();
	}
	if(status == 'turnOff'){
		if(popLink){
			popLink.visible = false;
		}
		if(this.level != 0){
			popText.popTextHide();
		}
	}
	if(status == 'mouseenter'){
		popText.popTextChangeOpacity(1);
	}
	if(status == 'mouseleave'){
		popText.popTextChangeOpacity(theme.popTextOpacity);
	}
}

function _pop_rotate(degree){
	var point = new Point(this.pos.x, this.pos.y);
	point = point.rotate(degree, Stage.rotateCenter);
	this.pos.x = point.x;
	this.pos.y = point.y;
	_pop_syncPosition(this);
}

function _pop_mouseEnterText(){
	if(Stage.status == ''){
        var pop = this.parent;
        pop.refreshPop('mouseenter');
        this.onHover = true;
       	Stage.optionCircle.show(pop);
        ViewController.onMouseEnterPop(pop);
    }
    if(Stage.status == 'onConnectNodePick'){
    	this.onHover = true;
        var pop = this.parent;
       	Stage.optionCircle.show(pop);
    }
}

function _pop_mouseLeaveText(){
	//this.parent: fix delete ghost popText
	if(!this.onHover || !this.parent){
		return;
	}
	Stage.optionCircle.hide();
	this.onHover = false;
	var pop = this.parent;
    pop.refreshPop('mouseleave');
    if(Stage.status == 'PopHover'){
        ViewController.onMouseLeavePop(pop);
    }
}

function _pop_clickPopText(){
	if(Stage.status == 'onConnectNodePick'){
		ViewController.executeOption(this.parent, 'connectFinish');
	}
	if(Stage.status == 'PopHover' && this.parent.c){
		ViewController.executeOption(this.parent, 'moveToConnectPop');
	}
	if(Stage.status == 'PopHover' && this.parent.at){
		ViewController.executeOption(this.parent, 'showAppendText');
	}
}

function _pop_updateLink(mode){
	var link = this.children['link'];
	if(!link || !this.parentIdx){
		return;
	}
	var parent = Pops.getPopByIndex(this.parentIdx);
	if(mode == 'rough'){
		link.updateLinkPos(parent.pos, this.pos);
	}else{
		var linkPoints = _pop_getPreciseLinkPoints(parent, this);
		link.updateLinkPos(linkPoints[0], linkPoints[1]);
	}
}

function _pop_adjustToRotateCenter(){
	var d = (this.d + Stage.degreeOffset + 360) % 360;
	var x = view.size.width * 0.5 - this.r * Stage.galaxyRadius * Math.cos(d * angleD2R);
    var y = Stage.rotateCenter.y - this.r * Stage.galaxyRadius * Math.sin(d * angleD2R);
	this.pos.x = x;
	this.pos.y = y;
	_pop_syncPosition(this);
}

function _pop_syncPosition(pop){
	var popText = pop.children['popText'];
	popText.position.x = pop.pos.x;
	popText.position.y = pop.pos.y;
	if(popText.ele){
		popText.ele.css('left', popText.bounds.left);
		popText.ele.css('top', popText.bounds.top);
	}
	if(pop.level == 0){
		var popStar = pop.children['star'];
		popStar.position.x = pop.pos.x;
		popStar.position.y = pop.pos.y;
	}
	var appendMark = pop.children['appendMark'];
	if(appendMark){
		var t = popText.bounds.top;
		var r = popText.bounds.right;
		appendMark.position.x = r + 5;
		appendMark.position.y = t - 5;
	}
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

function _popText_show(){
	this.visible = true;
	if(this.ele){
		this.ele.show();
	}
}

function _popText_hide(){
	this.visible = false;
	if(this.ele){
		this.ele.hide();
	}
}

function _popText_get(){
	if(this.ele){
		return this.ele.text();
	}else{
		return this.content;
	}
}


function _popText_changeOpacity(opacity){
	if(this.ele){
		this.ele.css('opacity', opacity);
	}else{
		this.opacity = opacity;
	}
}

function _pop_updatePopModel(){
	var pt = Model.getModelByIdx(this.idx);
	var level = Model.getLevelByIdx(this.idx);
	var parentPop = Pops.getPopByIndex(Model.getParentIdx(this.idx));
	var rootPt = Model.getRootModel(this.idx);
	this.initPop(pt, level, parentPop, rootPt);
}

function _pop_deletePop(){
	var childrenIdx = Model.getChildrenIdx(this.idx);
	childrenIdx.forEach(function(childIdx){
		var child = Pops.getPopByIndex(childIdx);
		child.deletePop();
	})

	var idx = this.idx;
	var popText = this.children['popText'];
	if(popText.ele){
		popText.ele.remove();
	}
	this.removeChildren();
	this.remove();

	var i = Pops.pops.findIndex(function(p){
		return p.idx == idx;
	});
	Pops.pops.splice(i, 1);
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
	    var v1 = new Point(parentPop.pos.x - pop.pos.x, parentPop.pos.y - pop.pos.y);	   
	    var v1s = v1.normalize(10);
	    var v2s = v1.normalize(10);
	    return [{x:parentPop.pos.x - v1s.x, y:parentPop.pos.y - v1s.y}, {x:pop.pos.x + v2s.x, y:pop.pos.y + v2s.y}]
	}

}

function _getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}
