function Guide(){
	var guide = new Group();
	var height = view.size.height / Stage.galaxyRadius * view.size.height;

	var heightIndex = new Path.Rectangle({
        name: 'heightIndex',
        size: [4, height],
        fillColor: 'darkred',
        visible: false
    });
    heightIndex.position.x = 2;
    guide.addChild(heightIndex);

    var degreeIndex = new PointText({
        name: 'degreeIndex',
        content: "",
        point: [halfWidth, 20],
        justification: 'center',
        fontSize: 20,
        fillColor: '#666',
        visible: false
    });
    guide.addChild(degreeIndex);

    guide.updateDegreeIndex = _guide_updateDegreeIndex;
    guide.updateHeightIndex = _guide_updateHeightIndex;
    guide.updateDegreeIndex();
    guide.updateHeightIndex();
    guide.hideDegreeIndex = _guide_hideDegreeIndex;
    guide.hideHeightIndex = _guide_hideHeightIndex;
    // guide.hideDegreeIndex();
    // guide.hideHeightIndex();
	return guide;
}

function _guide_updateDegreeIndex(){
	var degreeIndex = this.children['degreeIndex'];
	degreeIndex.content = (360 + parseInt(Stage.degreeOffset)) % 360 + '°';
	degreeIndex.visible = true;
}

function _guide_updateHeightIndex(){
	var heightIndex = this.children['heightIndex'];
	var y = (Stage.galaxyRadius - Stage.rotateCenter.y) / Stage.galaxyRadius * view.size.height + heightIndex.bounds.height * 0.5;
	heightIndex.position.y = y; 
	heightIndex.visible = true;
}

function _guide_hideDegreeIndex(){
	var _this = this;
	setTimeout(function(){
		_this.children['degreeIndex'].visible = false;
	}, 500);
}

function _guide_hideHeightIndex(){
	var _this = this;
	setTimeout(function(){
		_this.children['heightIndex'].visible = false;
	}, 500);
}