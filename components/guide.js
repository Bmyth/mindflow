var _guide_barThick = 4;
function Guide(){
	var guide = new Group();

    var heightIndexBack = new Path.Rectangle({
        name: 'heightIndexBack',
        size: [6, view.size.height],
        fillColor: '#333'
    });
    heightIndexBack.position.x = _guide_barThick * 0.5;
    heightIndexBack.position.y = view.size.height * 0.5;
    guide.addChild(heightIndexBack);

    var widthIndexBack = new Path.Rectangle({
        name: 'widthIndexBack',
        size: [view.size.width, _guide_barThick],
        fillColor: '#333'
    });
    widthIndexBack.position.x = halfWidth;
    widthIndexBack.position.y = _guide_barThick * 0.5;
    guide.addChild(widthIndexBack);

    var w = view.size.width / (Stage.galaxyRadius *  2) * view.size.width;
    var widthIndex = new Path.Rectangle({
        name: 'widthIndex',
        size: [w, _guide_barThick],
        fillColor: '#ccc'
    });
    widthIndex.position.x = halfWidth;
    widthIndex.position.y = _guide_barThick * 0.5;
    guide.addChild(widthIndex);

    var h = view.size.height / Stage.galaxyRadius * view.size.height;
	var heightIndex = new Path.Rectangle({
        name: 'heightIndex',
        size: [_guide_barThick, h],
        fillColor: '#ccc'
    });
    heightIndex.position.x = _guide_barThick * 0.5;
    guide.addChild(heightIndex);

    var degreeIndexBack = new Path.Circle({
        radius: 40,
        fillColor: '#333'
    });
    degreeIndexBack.position.x = 0;
    degreeIndexBack.position.y = 0;
    guide.addChild(degreeIndexBack);

    var degreeText = new PointText({
        name: 'degreeText',
        content: "",
        point: [halfWidth, 0],
        justification: 'center',
        fontSize: 16,
        fillColor: theme.fontColor
    });
    degreeText.position.x = 15;
    degreeText.position.y = 15;
    guide.addChild(degreeText);

    var heightDots = new Group();
    heightDots.name = 'heightDots';
    guide.addChild(heightDots);
    var widthDots = new Group();
    widthDots.name = 'widthDots';
    guide.addChild(widthDots);

    guide.updateDegreeIndex = _guide_updateDegreeIndex;
    guide.updateHeightIndex = _guide_updateHeightIndex;
    guide.updateDots = _guide_updateDots;
    guide.updateDegreeIndex();
    guide.updateHeightIndex();
    guide.updateDots();

	return guide;
}

function _guide_updateDegreeIndex(){
	var degreeText = this.children['degreeText'];
	degreeText.content = parseInt(Stage.degreeOffset) + '';
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


