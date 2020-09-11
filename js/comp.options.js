Comp.options = {
	ele: null,
	init: _options_init,
	refresh: _options_refresh,
	status: {
    	'NORMAL': {
    		keys: ['open_space']
    	},
    	'NODE_ON_HOVER': {
    		keys: ['node_edit','node_branch','node_delete','|','open_space']
    	},
    	'NODE_ON_BRANCH': {
    		keys: ['node_branch_click','cancel']
    	},
    	'NODE_ON_EDIT': {
    		keys: ['edit_finish', 'cancel']
    	},
    	'NODE_ON_CREATE': {
    		keys: ['edit_finish', 'cancel']
    	},
    	'NODE_ON_CREATE_BRANCH': {
    		keys: ['edit_finish', 'cancel']
    	},
    	'PICK_SPACE': {
    		keys: ['edit_finish', 'cancel']
    	}
    },
    optionData: [{
    	key: 'open_space',
    	shortKey: 'Ctr+S',
    	desc: 'open space',
    	clickEvent: 'pickSpace'
    },{
    	key: 'node_branch',
    	shortKey: 'S',
    	desc: 'sub branch'
    },{
    	key: 'node_edit',
    	shortKey: 'E',
    	desc: 'edit'
    },{
    	key: 'node_delete',
    	shortKey: 'Del',
    	desc: 'delete'
    },{
    	key: 'node_branch_click',
    	shortKey: 'Click',
    	desc: 'create branch'
    },{
    	key: 'edit_finish',
    	shortKey: 'Enter',
    	desc: 'finish'
    },{
    	key: 'cancel',
    	shortKey: 'Esc',
    	desc: 'cancel'
    }],
}

function _options_init() {
	this.ele = $('#options');
	this.ele.on('click', '.opt-block', _options_onClick);
	this.refresh();
}

function _options_refresh() {
	var options = Comp.options;

	var blockSize = Comp.map.blockSize;
	var top = (parseInt(windowHeight / blockSize) - 1) * blockSize;
	var right = windowWidth - (parseInt(windowWidth / blockSize) + 1) * blockSize;
	options.ele.css({'top':top,'right':right}).empty();

	var keys = options.status[Pylon.status].keys;
	keys.forEach(function(key){
		var data = options.optionData.find(function(opt){
			return opt.key == key;
		})
		if(data){
			var ele = $('<div class="opt-block"></div>').css({'width':blockSize-1, 'height':blockSize-1}).appendTo(options.ele);
			$('<p></p>').text(data.shortKey).appendTo(ele);
			$('<span></span>').text(data.desc).appendTo(ele);
			if(data.clickEvent){
				ele.attr('clickevent', data.clickEvent);
			}
		}
	})
	options.ele.css('width',blockSize*(options.ele.find('.opt-block').length + 1));
}

function _options_onClick(){
	var clickEvent = $(this).attr('clickevent');
	if(clickEvent){
		Pylon.executeOption(0, clickEvent);
	}
}