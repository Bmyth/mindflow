var shiningNum = 0;

var PopRender = {
    originY: 0,
	rotateDegree: 0,
	popRings: [],
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
    PopRender.originY = rotateCenter.y;
}

PopRender.paint = function(){
	//clear
	PopRender.clear();

	Model.pops.forEach(function(pt) {
        PopRender.paintPop(pt, 0);
    })
    PopRender.paintLinks();
    Stage.adjustLayers();
}

PopRender.paintPop = function(pt, level) {
    var popText = new PointText();
    popText.initPopText(pt, level);
    popText.rotatePopText(degreeOffset);
    PopRender.popTexts.push(popText);

    var popRing = new Group();
    popRing.initPopRing(pt, popText);
    PopRender.popRings.push(popRing);

    pt.children.forEach(function(childPt){
        PopRender.paintPop(childPt, level+1);
    })
    return {pop:popRing, popText: popText};
}


PopRender.rotate = function(degree){
    PopRender.popRings.forEach(function(p){
        p.rotate(degree, rotateCenter);
    })
    PopRender.popTexts.forEach(function(p){
        p.rotatePopText(degree)
    })
    PopRender.popLinks.forEach(function(p){
        p.rotate(degree, rotateCenter);
    })
}

PopRender.paintLinks = function(){
    PopRender.popLinks.forEach(function(pt) {
        pt.remove();
    })
    PopRender.popLinks = [];
    Model.pops.forEach(function(pt){
        drawLink(pt);
    })
}

function drawLink(pt){
    var popText = PopRender.getPopText(pt.idx);
    pt.children.forEach(function(childPt){
        var link = new Path.Line();
        link.initPopLink(popText, PopRender.getPopText(childPt.idx));
        PopRender.popLinks.push(link);
        drawLink(childPt);
    })
}

PopRender.adjustRotateCenter = function(){
    var offset = this.originY - rotateCenter.y;
    this.popTexts.forEach(function(i){
        i.position.y -= offset;
    })
    this.popRings.forEach(function(i){
        i.position.y -= offset;
    })
    this.popLinks.forEach(function(i){
        i.position.y -= offset;
    })
    this.originY = rotateCenter.y;
}

PopRender.mouseenterPop = function(popText){
    if(Stage.status == ''){
        popText.opacity = 1;
        popText.onHover = true;
        getPopRingByIndex(popText.idx).visible = true;
        Stage.onMouseEnterPop(popText);
    }
}

PopRender.mouseleavePop = function(popText){
    if(Stage.status == 'PopHover'){
        popText.onHover = false;
        popText.opacity = popTextOpacity;
        var pop = getPopRingByIndex(popText.idx);
        if(pop){
            pop.visible = false;
        }
        Stage.onMouseLeavePop(popText);
    }
}

PopRender.getPopText = function(idx){
    return PopRender.popTexts.find(function(i){
        return i.idx == idx;
    })
}

PopRender.clear = function(){
    PopRender.popRings.forEach(function(i){
        i.remove();
    })
    PopRender.popTexts.forEach(function(i){
        i.remove();
    })
    PopRender.popLinks.forEach(function(i){
        i.remove();
    })
    PopRender.popRings = [];
    PopRender.popTexts = [];
    PopRender.popLinks = [];
}

PopRender.PopAssociate = function(popText){
	var pop = getPopRingByIndex(popText.idx);
	PopRender.associateHelper.startPoint = pop;
	PopRender.associateHelper.startPoint.opacity = 1;
	PopRender.associateHelper.endPoint.position.x = pop.position.x;
	PopRender.associateHelper.endPoint.position.y = pop.position.y;
	PopRender.associateHelper.endPoint.opacity = 1;
	PopRender.associateHelper.line.updateLinkPos(pop.position, pop.position);
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
    p.y = Math.min(p.y, skyHeight - 30);

	PopRender.associateHelper.endPoint.position.x = p.x;
	PopRender.associateHelper.endPoint.position.y = p.y;
    PopRender.associateHelper.line.updateLinkPos(0, p)
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

function getPopRingByIndex(idx){
	return PopRender.popRings.find(function(p){
		return p.idx == idx;
	})
}