function Cubes(){
    var cubes = {
        items: [],
        group: null,
        refresh: _bl_refresh,
        getCubeByIndex: _bl_getCubeByIndex,
        updateCubeFloat:_bl_updateCubeFloat
    };
    cubes.group = new Group();
    cubes.group.onFrame = _bl_onFrame;
    return cubes;
}

function _bl_refresh(){
    _bl_clear();
    Model.rootNodes.forEach(function(n) {
        var cube = new Group();
        cube.initCube(n);
        Comp.cubes.items.push(cube);
        Comp.cubes.group.addChild(cube);
    })
    this.updateCubeFloat();
}

function _bl_clear(){
    Comp.cubes.group.removeChildren();
    Comp.cubes.items = [];
    Physic.clear();
}

function _bl_getCubeByIndex(idx){
    return Comp.cubes.items.find(function(i){
        return i.idx == idx;
    })
}

function _bl_updateCubeFloat(){
    this.items.forEach(function(c){
        if(c.idx == onBoardRootIdx){
            c.float = true;
        }else{
            c.float = false;
            c.phyObj.isStatic = false;
        }
    })
}

function _bl_onFrame(){
    var updateRootPos = false;
    if(timeSecondCount % 10 == 0 && timeCount == 0){
        Comp.cubes.items.forEach(function(cube){
            if(cube.pos.x != cube.originPos.x || cube.pos.y != cube.originPos.y || cube.angle != cube.originPos.r){
                var pos = {
                    x: cube.pos.x/Comp.liquid.width,
                    y: cube.pos.y/Comp.liquid.height,
                    r: cube.angle
                }
                Model.setRootNodePos(cube.idx, pos);
                updateRootPos = true;
            }
        })
    }
    if(updateRootPos){
        Model.saveRootNodes();
    }
}