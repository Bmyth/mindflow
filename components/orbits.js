var _orbits_inner_radius = 0.25;
var _orbits_num = 10;
var _orbit_color = '#aaa';
var _orbit_opacity_normal = 0.1;
var _orbit_opacity_highlight = 0.8;

function Orbits(){
	var orbits = {
		orbitItems: [],
		textItems: [],
		radiusList: []
	};
	BackPaper.activate();
	var innerR = view.size.height * _orbits_inner_radius;
	var outerR = view.size.height * 0.5;
	var d = (outerR - innerR) / 9;
	for(var i = 0; i < _orbits_num; i++){
		var r = innerR + d * i;
	    var orbit = new Path.Circle({
	        center: Stage.rotateCenter,
	        radius: r,
	        strokeWidth: 1
	    });
	    orbit.idx = i;
	    orbit.r = r;
    	orbit.name = 'orbit' + i;
    	orbit.opacity = 0.5;
	    orbits.orbitItems.push(orbit);
	    orbits.radiusList.push(r);
	}
	orbits.getOrbitRadius = _orbit_getRadius;
	orbits.testOrbit = _orbits_testOrbit;
	orbits.highlightOrbit = _orbits_highlightOrbit;
	orbits.fade = _orbits_fade;
	orbits.testOccupied = _orbits_testOccupied;
	orbits.refresh = _orbits_refresh;
	orbits.refresh();
	FrontPaper.activate();
	return orbits;
}

function _orbit_mouseEnter(){
	var line = this.children['line'];
	line.style.strokeColor = '#aaa';
}

function _orbit_mouseLeave(){
	var line = this.children['line'];
	line.style.strokeColor = '#444';
}

function _orbit_click(event){
	ViewController.executeOption(this, 'createRootNode');
}

function _orbit_getRadius(idx){
	return this.radiusList[idx];
}

_orbits_trackoffset = 5;
function _orbits_testOrbit(point){
	var _this = this;
	var d = Stage.rotateCenter.getDistance(point);
	var idx = null;
	this.radiusList.forEach(function(r, _idx){
		if(Math.abs(r-d) <= _orbits_trackoffset){
			idx = _idx;
		}else if(this.highlightIdx != null && this.highlightIdx == _idx){
			_this.children['orbit' + _this.highlightIdx].style.strokeColor = _orbit_dardColor;
			_this.highlightIdx = null;
		}
	})
	return idx;
}

function _orbits_refresh(){
	var _this = this;
	this.textItems.forEach(function(text){
		text.remove();
	})
	this.orbitItems.forEach(function(orbit, ridx){
		var pt = Model.getModelByRidx(ridx);
		var color = (pt&&pt.color) ? pt.color : _orbit_color;
		orbit.style.strokeColor = color;
		orbit.opacity = _orbit_opacity_normal;

		var text = new PointText({
	        justification: 'left',
	        fontSize: 14,
	        fillColor: color
	    });
	    text.content = pt? pt.t : '';
	    text.ridx = ridx;
	    text.bounds.left = 4;
	    var r = _this.getOrbitRadius(ridx);
	    text.position.y = halfHeight - r - 6;
		_this.textItems.push(text);
	})
}

function _orbits_highlightOrbit(idx){
	if(onHoverOrbitIndex != null){
		this.fade();
	}
	onHoverOrbitIndex = idx;
	this.orbitItems[onHoverOrbitIndex].opacity = _orbit_opacity_highlight;
}

function _orbits_fade(){
	this.orbitItems[onHoverOrbitIndex].opacity = _orbit_opacity_normal;
	onHoverOrbitIndex = null;
}

function _orbits_testOccupied(idx){
	return _.find(Model.pops, function(pop){
		return pop.ridx == idx;
	})
}