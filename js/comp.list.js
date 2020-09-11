Comp.list = {
    container: null,
    init: _nl_init,
    refresh: _nl_refresh
}

function _nl_init(){
    this.container = $('#nodelist');
    this.container.on('click', 'p', _nl_onItemClick);
    this.refresh();
}

var _nl_fontSize = [12, 10, 8, 10, 8];
function _nl_refresh(){   
    Comp.list.container.empty();

    var list = _.sortBy(Model.nodeList, function(n){
        var score = 0;
        if(n.i == Comp.space.idx){
            score += 2000;
        }
        if(n.i == Model.S_baseSpaceIdx){
            score += 1000;
        }
        if(n.hasSpace){
            score += 100;
        }
        var nVisit = n.nVisit || 0;
        var nRef = n.nRef || 0;
        score += Math.min(100, (nVisit + nRef)); 
        
        return - score;
    })
    
    var i = 0;
    list.forEach(function(n){
        var ele = $('<div class="node-item"></div>').appendTo(Comp.list.container);
        var p = $('<p></p>').attr('i', n.i).appendTo(ele);
        var text = n.t.length > 8 ? n.t.substring (0, 8) + '..' : n.t;
        text = n.t;
        var span = $('<span></span>').text(text);
        if(n.hasSpace || n.i == Comp.space.idx){
            span.appendTo(p).css('fontSize', _nl_fontSize[i] + 'px');
            ele.addClass('text');
            if(n.i == Comp.space.idx){
                ele.addClass('space');
            }
        }else{
            span.css('opacity', 0).appendTo(p).css({'right': -span.width()});
            ele.addClass('bar');
        }
        i++;
    })
}

function _nl_onItemClick(){
    Pylon.executeOption($(this).attr('i'), 'openSpace');
}