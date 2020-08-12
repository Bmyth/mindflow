function MindPath(){
    var path = {
        ele: $('#path'),
        refresh: _path_refresh
    };
    Comp.path = path;
    _path_refresh();
    $('#path').on('click', '.p-node', _path_trackNode);
}

function _path_refresh(){
     _path_generateNodeEle(Model.path[0].i);
}

function _path_trackNode(){
    var pathNode = Comp.board.getPthNodeByIndex($(this).attr('i'));
    Pylon.executeOption(pathNode, 'trackNode');
}

function _path_generateNodeEle(i){
    var node = Model.getNodeInList(i);
    var text = i == Model.S_baseSpaceIdx ? 'root' : node.t;
    var ele = $('<div class="p-node"></div>').attr('i', node.i).text(text).hide().prependTo(Comp.path.ele);
    var w = ele.width();
    ele.css('width',0).show().animate({'width':w}, 500)
}

function _path_clear(){
    Comp.path.ele.empty();
}