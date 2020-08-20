Comp.entry = {
	toPickItemIndex:0,
	on: false,
	ele: null,
	input: null,
	optEle: null, 
	optInput: null, 
	candidatesEle: null, 
	init: _entry_init,
	enter: _entry_enter,
	show: _entry_show,
	hide: _entry_hide
}

function _entry_init(){
	this.ele = $('#entry');
	this.input = $('#entry input');
	this.optEle = $('#entry .edit-opt');
	this.optInput = $('#entry .edit-opt input');
	this.candidatesEle = $('#entry .candidates');
	this.input.keyup(_entry_contentKeydown);
	this.candidatesEle.on('click', 'p', _entry_clickCandidate);
}

function _entry_contentKeydown(e){
	var e  = e ||  window.e;          
　　	var key = e.keyCode || e.which;
	var entry = Comp.entry;
	//enter: finish enter
	if(key == 13){
    	var text = entry.input.val();
    	var matchedNode = Model.nodeList.find(function(n){
    		return n.t == text;
    	});
        //edit node
        if(entry.editNode){
        	var applyToAll = entry.optInput.is(":checked");
        	if(matchedNode && applyToAll){
	        	Model.replaceNodeInList(entry.editNode.i, matchedNode.i);
	        }
	        if(!matchedNode && applyToAll){
	        	Model.updateNodeTextInList(entry.editNode.i, text);
	        }
	        else{
	        	var pt = {t:text, x:entry.editNode.pos.x / windowWidth, y:entry.editNode.pos.y / windowHeight};
	        	if(matchedNode){
		        	pt.i = matchedNode.i;
		        }
		    	Comp.space.deleteNode(entry.editNode.uid);
		    	Comp.space.addNode(pt, entry.editNode.parentUid);
	        }
        }
        //create node
        else{
        	if(text){
		        var pt = {t:text, x:Comp.anchor.position.x / windowWidth, y:Comp.anchor.position.y / windowHeight};
		        if(matchedNode){
		        	pt.i = matchedNode.i;
		        }
		        var parentUid = Pylon.onBranchingNode ? Pylon.onBranchingNode.uid : Comp.space.data.uid;
	            Comp.space.addNode(pt, parentUid);
	            if(Pylon.onBranchingNode){
	            	Pylon.onBranchingNode = null;
	            }
	        }
        }
        entry.input.val('');
        entry.hide();
        Comp.anchor.hide();
    }
    // esc: cancel edit
    else if(key == '27'){
        entry.hide();
        Comp.anchor.hide();
    }
    // up: to pick
    else if(key == '38'){
        _entry_topickChange('up');
    }
    // down: to pick
    else if(key == '40'){
        _entry_topickChange('down');
    }
    else{
    	_entry_contentChange();
    }
}

function _entry_contentChange(){
	Comp.entry.candidatesEle.empty();
	var v = Comp.entry.input.val();
	if(v == ''){
		return;
	}
	var matchNodes = _.filter(Model.nodeList, function(n){		
		return n.t && n.t.indexOf(v) >= 0;
	})
	Comp.entry.toPickItemIndex = 0;
	$('<p class="ph"></p>').appendTo(Comp.entry.candidatesEle);
	matchNodes.forEach(function(n, i){
		var p = $('<p></p>').text(n.t).attr('idx', n.i).attr('i',i).appendTo(Comp.entry.candidatesEle);
		if(n.t == v && v !== ''){
			p.addClass('topick');
			Comp.entry.toPickItemIndex = i;
		}
	})
	$('<p class="ph"></p>').appendTo(Comp.entry.candidatesEle);
	
}

function _entry_topickChange(type){
	if(type == 'up' && Comp.entry.toPickItemIndex > 0){
		Comp.entry.toPickItemIndex--;
	}
	if(type == 'down' && Comp.entry.toPickItemIndex < Comp.entry.candidatesEle.find('p').length - 1){
		Comp.entry.toPickItemIndex++;
	}
	Comp.entry.candidatesEle.find('.topick').removeClass('topick');
	var ele = $(Comp.entry.candidatesEle.find('p')[Comp.entry.toPickItemIndex]);
	if(!ele.hasClass('ph')){
		ele.addClass('topick');
		Comp.entry.input.val(ele.text());
	}
}

function _entry_enter(){
	_entry_contentKeydown({which:13})
}

function _entry_show(param){
	param = param || {};
	Comp.entry.on = true;
	if(param.editNode){
		Comp.entry.editNode = param.editNode;
		Comp.entry.optEle.show();
		Comp.entry.optInput.val(true);
	}else{
		Comp.entry.editNode = null;
		Comp.entry.optEle.hide();
		Comp.entry.optInput.val(false);
	}
	var val = param.editNode ? Model.getNodeInList(param.editNode.i).t : '';
    Comp.entry.ele.fadeIn();

    Comp.entry.candidatesEle.empty();
    Comp.entry.toPickItemIndex = 0;

    var candidatesEleHeight = windowHeight - (Comp.entry.input.offset().top + Comp.entry.input.outerHeight()) - 40;
    Comp.entry.candidatesEle.css('maxHeight', candidatesEleHeight + 'px');
    setTimeout(function(){
    	Comp.entry.input.focus();
    	Comp.entry.input.val(val);
    },30);
}

function _entry_hide(){
	Comp.entry.on = false;
	Comp.entry.ele.fadeOut();
}

function _entry_clickCandidate(){
	Comp.entry.toPickItemIndex = $(this).attr('i');
	_entry_topickChange();
}

function _input_statusText(status){

}