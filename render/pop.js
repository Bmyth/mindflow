var shiningNum = 0;

var PopRender = {
	rotateDegree: 0,
	pops: [],
	popTexts: [],
	popLinks: [],
	associateHelper: {
		startPoint : null,
		line: null,
		endPoint: null
	}
}

PopRender.init = function(){
  	PopRender.associateHelper.startPoint = null;
    PopRender.associateHelper.line = new Path.Line({
	    from: [0, 0],
	    to: [0, 0],
	    strokeColor: '#ccc',
	    strokeWidth: 2,
	    dashArray: [5,5],
	    opacity: 0
	});
    PopRender.associateHelper.endPoint = new Path.Circle({
        center: [0,0],
        radius: 15,
        strokeColor: 'white',
        opacity: 0
    });
}

PopRender.paint = function(){
	//clear
	PopRender.clear();

	Model.pops.forEach(function(pt) {
        PopRender.initPop(pt, 0);
    })
    Stage.adjustLayers();
}

PopRender.initPop = function(pt, level, parentPop) {
	var x = view.size.width * 0.5 - pt.r * Math.cos(pt.d * angleD2R);
    var y = rotateCenter.y - pt.r * Math.sin(pt.d * angleD2R);

    var fontSize = popFontSizeDefine[level] || 8;
    var popText = null;
    if(level == 0){
	    popText = new PointText({
	        point: [x, y],
	        content: pt.t,
	        justification: 'center',
	        fontSize: fontSize,
	        strokeColor: 'white'
	    });
    }else{
    	popText = new PointText({
	        point: [x, y],
	        content: pt.t,
	        justification: 'center',
	        fontSize: fontSize,
	        fillColor : 'white'
	    });
    }
    
    popText.position.x = x;
    popText.position.y = y;
    popText.opacity = 0.5;

    popText.idx = pt.idx;
    popText.t = pt.t;
    popText.r = pt.r;
    popText.d = pt.d;
    popText.on('mouseenter', function(){
    	if(Stage.status == ''){
    		this.onHover = true;
    		getPopByIndex(this.idx).opacity = 1;
    		Stage.onMouseEnterPop(this);
    	}
    });
    popText.on('mouseleave', function(){
    	this.onHover = false;
    	var pop = getPopByIndex(this.idx);
    	if(pop){
    		pop.opacity = 0.05;
    	}
    	Stage.onMouseLeavePop(this);
    });
    PopRender.popTexts.push(popText);

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
    var pop = new Group([popInner, popOuter]);
    pop.opacity = 0.05;
    pop.radius = radius;
    pop.idx = pt.idx;
    pop.t = pt.t;
    pop.r = pt.r;
    pop.d = pt.d;
    pop.status = 'floating';
    pop.degree = pt.d;
    PopRender.pops.push(pop);

    pt.children.forEach(function(childPt){
    	var child = PopRender.initPop(childPt, level + 1, pop);
    	drawLink(popText, child.popText);
    })
    rotateToParent(popText, parentPop);
    return {pop:pop, popText: popText};
}

function drawLink(popText, childPopText){
	var linkpoint = getLinkPoint(popText, childPopText);
	var link = new Path.Line({
	    from: [linkpoint.startX, linkpoint.startY],
	    to: [linkpoint.endX, linkpoint.endY],
	    strokeColor: '#aaa',
	    strokeWidth: 1.5,
	    dashArray: [4,2],
	    opacity: 1
	});
	link.idx = popText.idx + '-' + childPopText.idx;
	PopRender.popLinks.push(link);
}

function rotateToParent(pop, parentPop){
	return;
	if(parentPop){
		var v = new Point(parentPop.position.x - pop.position.x, parentPop.position.y - pop.position.y);
		var v2 = new Point(0, -1);
		var d = v2.getDirectedAngle(v);
		if(d < -90){
			d += 90;
		}
		if(d > 90){
			d -= 90;
		}
		pop.rotate(d);
	}
}

PopRender.refresh = function(event){
	this.pops.forEach(function(pop){
        updatePopPosition(pop);
        updatePopStyle(pop);
        updatePopReflection(pop);
        updatePopTexts(pop);

        if(pop.status == 'floating' && pop.opacity > 0.5 && shiningNum == 0){
            if(Math.random() > 0.996){
                PopRender.Popshine(pop);
            }
        }
        if(pop.status == 'shining'){
        	updatePopShiningEffect(pop);
        }
        if(pop.status == 'falling'){
        	updatePopFallingEffect(pop);
        }
    })
}

PopRender.clear = function(){
	PopRender.pops.forEach(function(pt) {
        pt.remove();
    })
    PopRender.pops = [];
    PopRender.popTexts.forEach(function(pt) {
        pt.remove();
    })
    PopRender.popTexts = [];
    PopRender.popLinks.forEach(function(pt) {
        pt.remove();
    })
    PopRender.popLinks = [];
}

PopRender.PopAssociate = function(popText){
	var pop = getPopByIndex(popText.idx);
	PopRender.associateHelper.startPoint = pop;
	PopRender.associateHelper.startPoint.opacity = 1;
	PopRender.associateHelper.endPoint.position.x = pop.position.x;
	PopRender.associateHelper.endPoint.position.y = pop.position.y;
	PopRender.associateHelper.endPoint.opacity = 1;
	PopRender.associateHelper.line.segments[0].point.x = pop.position.x;
	PopRender.associateHelper.line.segments[0].point.y = pop.position.y;
	PopRender.associateHelper.line.segments[1].point.x = pop.position.x;
	PopRender.associateHelper.line.segments[1].point.y = pop.position.y;
	PopRender.associateHelper.line.opacity = 1;
}

PopRender.refreshAssociate = function(point){
	var p = new Point(PopRender.associateHelper.startPoint.position.x, PopRender.associateHelper.startPoint.position.y);
	var d = p.getDistance(point);
	d = Math.min(d, maxLinkL);
	d = Math.max(d, minLinkL);

	var v = new Point(point.x - p.x, point.y - p.y);
	v = v.normalize(d);
	p = new Point(PopRender.associateHelper.startPoint.position.x + v.x, PopRender.associateHelper.startPoint.position.y + v.y);

	PopRender.associateHelper.endPoint.position.x = p.x;
	PopRender.associateHelper.endPoint.position.y = p.y;
	PopRender.associateHelper.line.segments[1].point.x = p.x;
	PopRender.associateHelper.line.segments[1].point.y = p.y;
}

PopRender.finishAssociate = function(){
	PopRender.associateHelper.startPoint.opacity = 0;
	PopRender.associateHelper.endPoint.opacity = 0;
	PopRender.associateHelper.line.opacity = 0;
}

function getReflectHeight(y) {
    var d = (skyHeight - y) / (skyHeight);
    return skyHeight +  groundPostion * d;
}

function getPopByIndex(idx){
	return PopRender.pops.find(function(p){
		return p.idx == idx;
	})
}