function MindPath(){
    var path = {
        ele: $('#path'),
        refresh: _path_refresh
    };
    Comp.path = path;
    path.refresh();
}

function _path_refresh(){
    _path_clear();
    Model.path.forEach(function(n) {
        _path_generateNodeEle(n.i);
    })
}

function _path_generateNodeEle(i){
    var node = Model.getNodeInList(i);
    var text = i == Model.S_baseSpaceIdx ? 'root' : node.t;
    var ele = $('<div class="p-node"></div>').attr('i', node.i).text(text).appendTo(Comp.path.ele);
    // $('<i></i>').text(node.i).appendTo(ele)
}

function _path_clear(){
    Comp.path.ele.empty();
}