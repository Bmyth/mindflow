Comp.list = {
    container: null,
    init: _nl_init,
    refresh: _nl_refresh
}

function _nl_init(){
    this.container = $('#nodelist');
    this.refresh();
}

var _nl_fontSize = [12, 10, 8, 10, 8];
function _nl_refresh(){   
    Comp.list.container.empty();

    var list = _.sortBy(Model.nodeList, function(n){
        if(n.i == Model.S_baseSpaceIdx){
            return 1;
        }
        var score = n.nVisit || 0;
        return - score - n.nRef;
    })
    
    var i = 0;
    list.forEach(function(n){
        var ele = $('<div class="node-item"></div>').appendTo(Comp.list.container);
        var p = $('<p></p>').attr('i', n.i).appendTo(ele);
        var text = n.t.length > 8 ? n.t.substring (0, 8) + '..' : n.t;
        text = n.t;
        var span = $('<span></span>').text(text);
        if(i < 3){
            span.appendTo(p).css('fontSize', _nl_fontSize[i] + 'px');
            ele.addClass('text');
        }else{
            span.css('opacity', 0).appendTo(p).css({'right': -span.width()});
            ele.addClass('bar');
        }
        if(n.i == Model.S_baseSpaceIdx){
            ele.addClass('root');
            span.text('root');
        }
        i++;
    })
}

function _nl_hover(){
    console.log($(this).attr('i'))
}