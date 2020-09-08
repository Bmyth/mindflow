Effect.highlightNodeText = _effect_highlightNodeText

function _effect_highlightNodeText(params, status){
	var node = params.node;
	var type = params.type || 'hover';
	var className = {
		hover : 'onhover',
		branch : 'onbranch'
	}
	if(status == 'start'){
		node.ele.addClass(className[type]);
	}else if(status == 'end'){
		node.ele.removeClass(className[type]);
	}	
}