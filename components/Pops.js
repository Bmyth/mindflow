var Pops = {
    name: 'pops',
    pops: [],
    starSymbol: null,
    rotateDegree: 0,
    paint: _pops_paint,
    paintPop: _pops_paintPop,
    updateTree: _pops_updateTree,
    rotate: _pops_rotate,
    updatePopLink: _pops_updatePopLink,
    adjustRotateCenter: _pops_adjustRotateCenter,
    getPopByIndex: _pops_getPopByIndex,
    crowdCheck: _pops_crowdCheck,
    clear: _pops_clear,
}

function _pops_paint(){
    if(!this.starSymbol){
        var star = new Path.Circle({
            center: [0,0],
            radius: 1.2,
            fillColor: '#ccc'
        });
        this.starSymbol = new SymbolDefinition(star);
    }
    var _this = this;
	this.clear();
	Model.pops.forEach(function(pt) {
        _this.paintPop(pt, 0, null, pt);
    })
    Stage.popIndex.refresh();
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
    pop.bringToFront();
    return pop;
}

function _pops_updateTree(pt){
    var _this = this;
    var pop =  this.getPopByIndex(pt.idx);
    pop.refreshPop();
    pop.updatePopLink();
    pt.children.forEach(function(childPt){
        _this.updateTree(childPt);
    })
}

function _pops_rotate(degree){
    this.pops.forEach(function(p){
        p.rotatePop(degree);
    })
    if(onTrackRootPop){
        this.pops.forEach(function(p){
            if(p.rootIdx == onTrackRootPop.idx){
                p.updatePopLink('rough')
            }
        })
    }
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

function _pops_clear(){
    this.pops.forEach(function(i){
        i.removeChildren();
        i.remove();
    })
    this.pops = [];
    Stage.popContainer.find('.pop-txt').remove();
}

function _pops_getPopByIndex(idx){
    return this.pops.find(function(i){
        return i.idx == idx;
    })
}

function _pops_crowdCheck(point){
    var crowd = false;
    this.pops.forEach(function(p){
        var d = new Point(p.pos.x, p.pos.y).getDistance(point);
        if(d < minPopDistance){
            crowd = true;
        }
    })
    return !crowd;
}