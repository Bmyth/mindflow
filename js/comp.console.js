Comp.console = {
    init: _console_init,
    ele: null,
    status: {
    	'NORMAL': {
    		options: []
    	},
    	'NODE_ON_HOVER': {
    		options: ['E','S','Del','Click-goto']
    	},
    	'NODE_ON_BRANCH': {
    		options: ['Click-branch','Esc']
    	},
    	'NODE_ON_EDIT': {
    		options: ['Enter-finishEdit', 'Esc']
    	},
    	'NODE_ON_CREATE': {
    		options: ['Enter-finishEdit', 'Esc']
    	},
    	'NODE_ON_CREATE_BRANCH': {
    		options: ['Enter-finishEdit', 'Esc']
    	}
    },
    options: [{
    	key: 'E',
    	text: 'E',
    	desc: 'edit'
    },{
    	key: 'S',
    	text: 'S',
    	desc: 'sub branch'
    },{
    	key: 'Del',
    	text: 'Del',
    	desc: 'delete'
    },{
    	key: 'Click-goto',
    	text: 'Click',
    	desc: 'go to'
    },{
    	key: 'Click-branch',
    	text: 'Click',
    	desc: 'create branch'
    },{
    	key: 'Enter-finishEdit',
    	text: 'Enter',
    	desc: 'finish'
    },{
    	key: 'Esc',
    	text: 'Esc',
    	desc: 'cancel'
    }],
	refresh: _console_refresh
}

function  _console_init() {
	this.ele = $('#console');
}

function  _console_refresh() {
	var blockSize = Comp.map.blockSize;
	Comp.console.ele.empty();
	var options = this.status[Pylon.status].options;
	options.forEach(function(option){
		var data = Comp.console.options.find(function(opt){
			return opt.key == option;
		})
		var ele = $('<div class="opt-block"></div>').css({width:blockSize - 1, height:blockSize - 1}).appendTo(Comp.console.ele);
		$('<p></p>').text(data.text).appendTo(ele);
		$('<span></span>').text(data.desc).appendTo(ele);
	})
	var w = options.length * blockSize;
	var h = (parseInt(windowHeight / blockSize) - 1 )  * blockSize;
	var left = parseInt((windowWidth - w) / blockSize / 2) * blockSize;
	Comp.console.ele.css({width: w + blockSize, top: h + 'px', left: left});
}