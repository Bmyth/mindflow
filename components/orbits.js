var _orbits_inner_radius = 0.25;
var _orbits_num = 10;
var _orbit_dardColor = '#444';
var _orbit_lightColor = '#aaa';
function Orbits(){
	BackPaper.activate();
	var orbits = new Group();
	orbits.radiusList = [];
	var innerR = view.size.height * _orbits_inner_radius;
	var outerR = view.size.height * 0.5;
	var d = (outerR - innerR) / 9;
	for(var i = 0; i < _orbits_num; i++){
		var r = innerR + d * i;
		var orbit = new Group();
		var base = new Path.Circle({
	        center: Stage.rotateCenter,
	        radius: r,
	        strokeColor: theme.skyColor,
	        strokeWidth: 10
	    });
	    base.visible = false;
	    base.name = 'base';
	    var line = new Path.Circle({
	        center: Stage.rotateCenter,
	        radius: r,
	        strokeColor: _orbit_dardColor,
	        strokeWidth: 1
	    });
	    line.name = 'line';
	    orbit.addChild(base);
	    orbit.addChild(line);
	    orbit.idx = i;
	    orbit.r = r;
	   	orbit.onMouseEnter = _.throttle(_orbit_mouseEnter,200);
    	orbit.onMouseLeave = _.throttle(_orbit_mouseLeave,200);
    	orbit.onClick = _orbit_click;
    	orbit.name = 'orbit' + i;
	    orbits.addChild(orbit);
	    orbits.radiusList.push(r);
	}
	orbits.highlightIdx = null;
	orbits.getOrbitRadius = _orbit_getRadius;
	orbits.testOrbit = _orbits_testOrbit;
	orbits.highlightOrbit = _orbits_highlightOrbit;
	orbits.fade = _orbits_fade;
	orbits.testOccupied = _orbits_testOccupied;
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

_orbits_trackoffset = 4;
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

function _orbits_highlightOrbit(idx){
	this.fade();
	this.highlightIdx = idx;
	this.children['orbit' + idx].style.strokeColor = _orbit_lightColor;
}

function _orbits_fade(){
	if(this.highlightIdx != null){
		this.children['orbit' + this.highlightIdx].style.strokeColor = _orbit_dardColor;
		this.highlightIdx = null;
	}
}

function _orbits_testOccupied(idx){
	return _.find(Model.pops, function(pop){
		return pop.ridx == idx;
	})
}