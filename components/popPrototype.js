function popProtoTypeInject() {
    Item.prototype.initPop = _pop_init;
    Item.prototype.updatePopModel = _pop_updatePopModel;
    Item.prototype.refreshPop = _pop_refresh;
	Item.prototype.updatePopLink = _pop_updateLink;
    Item.prototype.turnOn = _pop_turnOn; 
    Item.prototype.turnOff = _pop_turnOff; 
    Item.prototype.getPopText = _popText_get; 
    Item.prototype.popTextShow = _popText_show; 
    Item.prototype.popTextHide = _popText_hide;
    Item.prototype.popTextChangeOpacity = _popText_changeOpacity;
} 

function _pop_init(pt, level, parentPop, rootPt){
	this.idx = pt.idx;
    this.t = pt.t;
    this.at = !!pt.at;
    this.level = level;
    this.ridx = pt.ridx;
    this.rootColor = rootPt.color || theme.fontColor;

    _pop_initText(this, pt, level);
    var radius = this.children['popText'].bounds.width * 0.85;
	this.radius = radius;

    var x = parseFloat(Comp.board.rect.width * pt.x + Comp.board.rect.left);
    var y = parseFloat(Comp.board.rect.height * pt.y);

    if(this.level == 0){
    	x = this.children['popText'].bounds.width * 0.5 + Comp.board.rect.left + 5;
    	y = this.children['popText'].bounds.height * 0.5 + 5;
    }

	this.pos = {x:x, y:y};

    _pop_syncPosition(this);
	
	if(parentPop && parentPop.level != 0){
		this.parentIdx = parentPop.idx;
		_pop_initLink(this);
	}
	this.refreshPop();
}

function _pop_initText(pop, pt, level) {
	var firstTime = pop.children['popText'] == null;
	var popText = pop.children['popText'];
	var fontSize = theme.popFontSizeDefine[level] || theme.popFontSizeDefine[theme.popFontSizeDefine.length - 1];
	var fontColor = theme.fontColor;
	var content = pt.at ? pt.t + ' ..' : pt.t;

	var popTextEle = null;
	if(firstTime){
		popTextEle = $('<p class="pop-txt"></p>').appendTo(Comp.board.nodeTextContainer);
	}else{
		popTextEle = popText.ele;
	}
	var ratio = 1;
	popTextEle.text(content);
	popTextEle.css({'opacity':theme.popTextOpacity, 'textAlign':'center', 'fontSize': fontSize + 'px', 'color':fontColor}).attr('idx', pt.idx);
	popTextEle.css({'transform':'scale(' + ratio + ',' + ratio + ')'});
    var width = popTextEle.width() * ratio;
    var height = popTextEle.height() * ratio;
    if(firstTime){
    	popText = new Path.Rectangle({
	    	size: [width, height],
	    	fillColor: '#333'
	    });
	    popText.name = 'popText';
	    popText.opacity = 0.001;
	   	// popText.opacity = 1;
	  	popText.ele = popTextEle;
	  	popText.idx = pop.idx;
	  	popText.onMouseEnter = _pop_mouseEnterText;
    	popText.onMouseLeave = _pop_mouseLeaveText;
    	popText.onClick = _pop_clickPopText;
    	pop.addChild(popText);
    	pop.bringToFront();
    }
};

function _pop_initLink(pop){
	if(pop.children['link']){
		pop.children['link'].remove();
	}

	var link = new Path.Line();
    link.opacity = 0.5;
    link.style.strokeColor = theme.fontColor;
    link.style.strokeWidth = 1;
    link.style.dashArray = [5,5];
    link.name = 'link';
    pop.addChild(link);
    pop.updatePopLink();
}

function _pop_refresh(status){
	var popText = this.children['popText'];
	var popLink = this.children['link'];

	if(status == '' || status == null){

	}

	if(status == 'mouseEnterText'){
		Comp.optionCircle.show(this);
	}
	if(status == 'mouseLeaveText'){
		Comp.optionCircle.hide();
	}
}

function _pop_mouseEnterText(){
	var pop = this.parent;
    pop.refreshPop('mouseEnterText');
    this.onHover = true;
	onHoverPop = pop;
}

function _pop_mouseLeaveText(){
	//this.parent: fix delete ghost popText
	if(!this.onHover || !this.parent){
		return;
	}
	this.onHover = false;
	// this.parent.refreshPop('mouseLeaveText');
	onHoverPop = null;
}

function _pop_clickPopText(){
	// if(this.parent.ridx != null){
	// 	ViewController.executeOption(this.parent.ridx, 'trackRootNode');
	// }
	// if(Stage.status == 'onConnectNodePick'){
	// 	ViewController.executeOption(this.parent, 'connectFinish');
	// }
	// if(Stage.status == 'PopHover' && this.parent.c){
	// 	ViewController.executeOption(this.parent, 'moveToConnectPop');
	// }
	// if(Stage.status == 'PopHover' && this.parent.at){
	// 	ViewController.executeOption(this.parent, 'showAppendText');
	// }
}

function _pop_mouseEnterStar(){
	this.parent.refreshPop('mouseEnterStar');
}

function _pop_mouseLeaveStar(){
	
}

function _pop_updateLink(mode){
	var link = this.children['link'];
	if(!link || !this.parentIdx){
		return;
	}
	var parent = Board.getNodeByIndex(this.parentIdx);
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
		var w = popText.ele.width();
		var h = popText.ele.height();
		popText.ele.css('left', popText.position.x - w/2);
		popText.ele.css('top', popText.position.y - h/2);
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
	var parentPop = PaperLayer.middle.getNodeByIndex(Model.getParentIdx(this.idx));
	var rootPt = Model.getRootModel(this.idx);
	this.initPop(pt, level, parentPop, rootPt);
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
