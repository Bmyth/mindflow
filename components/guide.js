var _guide_barThick = 4;
function Guide(){
	var guide = new Group();
    var degreeIndexBack = new Path.Rectangle({
        size: [40, 1],
        fillColor: theme.fontColor
    });
    degreeIndexBack.position.x = view.size.width - 20;
    degreeIndexBack.position.y = halfHeight;
    guide.addChild(degreeIndexBack);

    var degreeText = new PointText({
        name: 'degreeText',
        content: "",
        point: [halfWidth, 0],
        justification: 'right',
        fontSize: 12,
        fillColor: theme.fontColor
    });
    degreeText.position.x = view.size.width - 4;
    degreeText.position.y = halfHeight - 15;
    guide.addChild(degreeText);

    guide.updateDegreeIndex = _guide_updateDegreeIndex;
    guide.updateDegreeIndex();
	return guide;
}

function _guide_updateDegreeIndex(){
	var degreeText = this.children['degreeText'];
    var s = Stage.degreeOffset + "";
    var str = s.substring(0,s.indexOf(".") + 2);
	degreeText.content = str;
}

function _guide_updateHeightIndex(){
	var heightIndex = this.children['heightIndex'];
	var y = (Stage.galaxyRadius - Stage.rotateCenter.y) / Stage.galaxyRadius * view.size.height + heightIndex.bounds.height * 0.5;
	heightIndex.position.y = y; 
}

function _guide_updateDots(){
    var heightDots = this.children['heightDots'];
    heightDots.removeChildren();
    var widthDots = this.children['widthDots'];
    widthDots.removeChildren();

    Pops.pops.forEach(function(p){
        if(p.level == 0 && p.pos.y < Stage.galaxyRadius){
            _guide_paintWidthDot(widthDots, p);
            _guide_paintHeightDot(heightDots, p);
        }
    })
    heightDots.bringToFront();
    widthDots.bringToFront();
}

function _guide_paintWidthDot(group, pop){
    var range = Stage.galaxyRadius * 2;
    var x = view.size.width * (pop.pos.x + Stage.galaxyRadius - halfWidth) / range;
    var y = _guide_barThick*0.5;

    var color = (pop.pos.x > 0 && pop.pos.x < view.size.width) ? '#666' : '#ccc';
    var dot = new Path.Rectangle({
        size: [_guide_barThick*0.5, _guide_barThick],
        fillColor: color
    });
    dot.position.x = x;
    dot.position.y = y;
    group.addChild(dot);
}

function _guide_paintHeightDot(group, pop){
    var range = Stage.galaxyRadius;
    var x = _guide_barThick*0.5;
    var y = view.size.height * (pop.pos.y / range);
    

    var color = (pop.pos.y > 0 && pop.pos.y < view.size.height) ? '#666' : '#ccc';
    var dot = new Path.Rectangle({
        size: [_guide_barThick, _guide_barThick*0.5],
        fillColor: color
    });
    dot.position.x = x;
    dot.position.y = y;
    group.addChild(dot);
}


