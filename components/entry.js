function Entry(){
	var entry = {};
	Comp.entry = entry;
	entry.toPickItemIndex = 0;
	entry.ele = $('#entry');
	entry.input = $('#entry input');
	entry.input.keyup(_entry_contentKeydown);
	entry.candidatesEle = $('#entry .candidates');
	entry.show = _entry_show;
	entry.hide = _entry_hide;
}

function _entry_contentKeydown(e){
	var e  = event  ||  window.e;          
　　	var key = e.keyCode || e.which;
	var entry = Comp.entry;
	//enter: finish enter
	if(key == 13){
		var pick = $(Comp.entry.candidatesEle.find('p')[Comp.entry.toPickItemIndex]);
    	var text = pick.hasClass('ph') ? entry.input.val() : pick.text();
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
        		var d = new Date();
		        var pt = {t:text, i:d.getTime(), x:Comp.anchor.position.x / windowWidth, y:Comp.anchor.position.y / windowHeight};
		        var parentIdx = Pylon.onBranchingNode ? Pylon.onBranchingNode.idx : Model.space.i;
	            Model.addNodeInSpace(pt, parentIdx);
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
	$('<p class="ph"></p>').appendTo(Comp.entry.candidatesEle);
	matchNodes.forEach(function(n){
		$('<p></p>').text(n.t).attr('idx', n.i).appendTo(Comp.entry.candidatesEle);
	})
	$('<p class="ph"></p>').appendTo(Comp.entry.candidatesEle);
	Comp.entry.toPickItemIndex = 0;
	_entry_updateToPickItem();
}

function _entry_topickChange(type){
	if(type == 'up' && Comp.entry.toPickItemIndex > 0){
		Comp.entry.toPickItemIndex--;
	}
	if(type == 'down' && Comp.entry.toPickItemIndex < Comp.entry.candidatesEle.find('p').length - 1){
		Comp.entry.toPickItemIndex++;
	}
	_entry_updateToPickItem();
}

function _entry_updateToPickItem(){
	Comp.entry.candidatesEle.find('p').each(function(i){
		if(i == Comp.entry.toPickItemIndex){
			$(this).addClass('topick')
		}else{
			$(this).removeClass('topick')
		}
	})
}

function _entry_show(params){
	params = params || {};
	var val = params.val || '';
    Comp.entry.ele.fadeIn();
    Comp.entry.input.focus();
    Comp.entry.candidatesEle.empty();
    setTimeout(function(){
    	Comp.entry.input.val(val);
    },30);
}

function _entry_hide(){
	Comp.entry.ele.fadeOut();
}

function _input_statusText(status){

}