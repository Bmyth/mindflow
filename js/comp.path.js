Comp.path = {
    ele: null,
    lineEle: null,
    init: _path_init,
    refresh: _path_refresh
}

function _path_init(){
    Comp.path.ele = $('#path');
    Comp.path.lineEle = $('#path-line');
    $('#path').on('click', '.p-node', _path_trackNode);
    _path_refresh();
}

function _path_refresh(){
    var nodeEles = Comp.path.ele.find('.p-node');
    if(nodeEles.length > Model.path.length){
        nodeEles.each(function(i){
            var ele = $(this)
            if(i >= Model.path.length){
                ele.fadeOut(300, function(){
                    ele.remove();
                })
            }
        })
    }else{
        _path_generateNodeEle(Model.path[Model.path.length - 1]);
    }

    setTimeout(_path_updateLine, 350);
    _path_updateBackground();
}

function _path_trackNode(){
    Pylon.executeOption($(this).attr('i'), 'trackNode');
}

function _path_generateNodeEle(i){
    var node = Model.getNodeInList(i);
    var text = i == Model.S_baseSpaceIdx ? 'root' : node.t;
    var ele = $('<div class="p-node"></div>').attr('i', node.i).text(text).hide().appendTo(Comp.path.ele).fadeIn();
}

function _path_updateLine(){
    var w = 0;
    Comp.path.ele.find('.p-node').each(function(){
        w += $(this).outerWidth();
    })
    Comp.path.lineEle.animate({'width':w}, 600);
}

function _path_updateBackground(){
    var deepth = Model.path.length;
    var n = 255 - 10 * deepth;
    n = Math.max(0, n);
    $('body').css('background','rgb(' + n + ',' + n + ',' + n + ')');
}