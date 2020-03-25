var Pops = {
    name: 'pops',
    pops: [],
    rotateDegree: 0,
    paint: _pops_paint,
    paintPop: _pops_paintPop,
    rotate: _pops_rotate,
    updatePopLink: _pops_updatePopLink,
    adjustRotateCenter: _pops_adjustRotateCenter,
    turnPopsOn: _pops_turnPopsOn,
    turnPopsOff: _pops_turnPopsOff,
    getPopByIndex: _pops_getPopByIndex,
    clear: _pops_clear,
}

function _pops_paint(){
    var _this = this;
	this.clear();
	Model.pops.forEach(function(pt) {
        _this.paintPop(pt, 0, null, pt);
    })
    Stage.popConsole.refresh();
    Stage.adjustLayers();
}

function _pops_paintPop(pt, level, parentPop, rootPt) {
    var _this = this;
    var pop = new Group();
    pop.initPop(pt, level, parentPop, rootPt);
    this.pops.push(pop);
    pt.children.forEach(function(childPt){
        _this.paintPop(childPt, level+1, pop, rootPt);
    })
    return pop;
}

function _pops_rotate(degree){
    this.pops.forEach(function(p){
        p.rotatePop(degree);
    })
    this.pops.forEach(function(p){
        p.updatePopLink('rough')
    })
}

function _pops_updatePopLink(){
    this.pops.forEach(function(p){
        p.updatePopLink();
    })
}

function _pops_adjustRotateCenter(){
    this.pops.forEach(function(i){
        i.adjustPopToRotateCenter();
    })
    this.pops.forEach(function(i){
        i.updatePopLink('rough');
    })
}

function _pops_turnPopsOn(idx){
    var pop = this.getPopByIndex(idx);
    pop.turnOn('childrenApply');
}

function _pops_turnPopsOff(idx){
    var pop = this.getPopByIndex(idx);
    pop.turnOff('childrenApply');
}

function _pops_clear(){
    this.pops.forEach(function(i){
        i.removeChildren();
        i.remove();
    })
    this.pops = [];
}

function _pops_getPopByIndex(idx){
    return this.pops.find(function(i){
        return i.idx == idx;
    })
}