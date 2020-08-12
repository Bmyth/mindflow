function Entry(){
	var entry = {};
	Comp.entry = entry;
	entry.toPickItemIndex = 0;
	entry.on = false;
	entry.ele = $('#entry');
	entry.input = $('#entry input');
	entry.input.keyup(_entry_contentKeydown);
	entry.candidatesEle = $('#entry .candidates');
	entry.candidatesEle.on('click', 'p', _entry_clickCandidate);
	entry.enter = _entry_enter;
	entry.show = _entry_show;
	entry.hide = _entry_hide;
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
        //update node
        if(entry.status == 'editNode'){
        	// if(text){
		       //  var pt = {t:text};
	        //     Model.updatePop(inputPanel.pop, pt);   
	        //     inputPanel.pop.updatePopModel();
	        // }
	        // inputPanel.pop.refreshPop();
        }
        //create node
        else{
        	if(text){
		        var pt = {t:text, x:Comp.anchor.position.x / windowWidth, y:Comp.anchor.position.y / windowHeight};
		        if(matchedNode){
		        	pt.i = matchedNode.i;
		        }
		        var parentIdx = Pylon.onBranchingNode ? Pylon.onBranchingNode.idx : Model.space.i;
	            Model.addNodeInSpace(pt, parentIdx);
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
    
	// var val = $(this).val();
	// if(val.length > textLengthLimit){
	// 	$(this).val(val.substring(0,textLengthLimit)); 
	// 	setTimeout(function(){
	// 		Stage.console.infoStatus['textLenLimit'];
	// 	}, 1000);
	// }
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

function _entry_show(editNode){
	Comp.entry.on = true;
	if(editNode){
		Comp.entry.editNode = editNode;
	}
	var val = editNode ? Model.getNodeInList(editNode.idx).t : '';
    Comp.entry.ele.fadeIn();
    Comp.entry.input.focus();
    Comp.entry.candidatesEle.empty();
    Comp.entry.toPickItemIndex = 0;
    setTimeout(function(){
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