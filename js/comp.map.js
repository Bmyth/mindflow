Comp.map = {
    init: _map_init,
	refresh: _map_refresh,
    fitBlockRatio: _map_fitBlockRatio,
    fitBlockPos: _map_fitBlockPos,
    container: null,
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

function _map_refresh(){
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