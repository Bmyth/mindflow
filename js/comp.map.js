Comp.map = {
    init: _map_init,
	refresh: _map_refresh,
    fitBlockRatio: _map_fitBlockRatio,
    fitBlockPos: _map_fitBlockPos,
    get4VecPos: _map_get4VecPos,
    testHitPos: _map_testHitPos,
    container: null,
    block: null,
    blockSize: 50,
    blockTextSize: 40
}

function _map_init() {
    this.container = $('#map');
    _map_refresh();
}

function _map_fitBlockRatio(ele){
    var w = $(ele)[0].clientWidth;
    var h = $(ele)[0].clientHeight;
    var rW = Comp.map.blockSize / w;
    var rH = Comp.map.blockSize / h;
    var r = Math.min(rW, rH, 1);
    return r;
}

function _map_fitBlockPos(pos){
    var x = parseInt(pos.x / Comp.map.blockSize) *  Comp.map.blockSize + Comp.map.blockSize * 0.5;
    var y = parseInt(pos.y / Comp.map.blockSize) *  Comp.map.blockSize + Comp.map.blockSize * 0.5;
    return {x: x, y: y}
}

function _map_get4VecPos(pos){
    var bs = Comp.map.blockSize * 0.5;
    var mp = _map_fitBlockPos(pos);
    return [{x:mp.x - bs,y:mp.y-bs},{x:mp.x + bs,y:mp.y-bs},{x:mp.x + bs,y:mp.y + bs},{x:mp.x - bs,y:mp.y + bs}]
}

function _map_testHitPos(pos){
    var blockPos = _map_fitBlockPos(pos);
    var l1 = {}, r1 = {};
    l1.x = blockPos.x - Comp.map.blockSize * 0.5;
    l1.y = blockPos.y - Comp.map.blockSize * 0.5;
    r1.x = blockPos.x + Comp.map.blockSize * 0.5;
    r1.y = blockPos.y + Comp.map.blockSize * 0.5;
    var overlapNode = null;
    Comp.space.group.children.forEach(function(n){
        if(n.children['mask'] && n.ele.text() == 'MD'){
            var l2 = {}, r2 = {};
            l2.x = n.pos.x - Comp.map.blockSize * 0.5;
            l2.y = n.pos.y - Comp.map.blockSize * 0.5;
            r2.x = n.pos.x + Comp.map.blockSize * 0.5;
            r2.y = n.pos.y + Comp.map.blockSize * 0.5;
            var overlap = blockPos.x == n.pos.x && blockPos.y == n.pos.y;
            if(overlap){
                overlapNode = n;
            }
        }
    })
    return overlapNode == null;
}

function _map_isOverlap(l1, r1, l2, r2) { 
    if (l1.x >= r2.x || l2.x >= r1.x) { 
        return false; 
    } 
    if (l1.y <= r2.y || l2.y <= r1.y) { 
        return false; 
    } 
    return true; 
} 

function _map_refresh(){
    Comp.map.container.empty();
    Comp.map.block = $('<div class="map-"></div>').appendTo(Comp.map.container).hide();
    var p = 0;
    while(p <= windowHeight){
        $('<div class="map-row"></div>').appendTo(Comp.map.container).css({'left':0, top:p + 'px'});
        p += Comp.map.blockSize;
    }
    p = 0;
    while(p <= windowWidth){
        $('<div class="map-column"></div>').appendTo(Comp.map.container).css({'top':0, left: p + 'px'});
        p += Comp.map.blockSize;
    }
}