function NodeList(){
	var nodeList = {
    	refresh: _nl_refresh
    }
    nodeList.container = $('#nodelist')
    Comp.nodeList = nodeList;
    nodeList.refresh();
}

var _nl_fontSize = [12, 10, 10, 10, 8];
function _nl_refresh(){   
    Comp.nodeList.container.empty();

    var list = _.sortBy(Model.nodeList, function(n){
        return -n.nRef;
    })
    
    var i = 0;
    list.forEach(function(n){
        var ele = $('<div class="node-item"></div>').appendTo(Comp.nodeList.container);
        var p = $('<p></p>').attr('i', n.i).appendTo(ele);
        var text = n.t.length > 8 ? n.t.substring (0, 8) + '..' : n.t;
        text = n.t;
        var span = $('<span></span>').text(text).appendTo(p);
        span.css({'right': -span.width()});
        if(i < 3){
            ele.addClass('text');
            span.css('fontSize', _nl_fontSize[i] + 'px');
        }else{
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