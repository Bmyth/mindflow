var Deers = function() {
	var deers = {
		items: []
	};
	deers.init = _deers_init;
	deers.generate = _deer_generate;
	deers.update = _deer_update;
	deers.init();
	return deers;
}

var _deers_possibility = 0.1;
var _deers_maxNum = 1;
function _deers_init(){
	var _this = this;
	var	deerTimer = setInterval(function(){
		if(Math.random() < _deers_possibility && _this.items.length < _deers_maxNum){
			_this.generate();
		}
		_this.items.forEach(function(deer){
			_this.update(deer);
		})
	}, 40);
}


_deer_size = 50;
function _deer_generate(){
	var date = new Date();
	var deer = {
		id : date.getTime()
	}
	deer.ele = $('<div id="deer_hype_container" class="deer"><script type="text/javascript" src="animationObjs/deer.hyperesources/deer_hype_generated_script.js"></script></div').appendTo(Stage.deerContainer);

	var w = deer.ele.width();
	var zoomRatio = _deer_size / w;
	w = _deer_size;
	var h = deer.ele.height() * zoomRatio;
	var posX = halfWidth;
	var posY = groundCenter.y - groundRadius - h * 0.5 + 2;
	deer.ele.css({width: w, height: h});
	deer.ele.find('.HYPE_scene').css({zoom: zoomRatio, width: '100% !important', height: '100% !important'});
	deer.pos = {x: posX, y: posY};
	deer.size = {w: w, h: h};
	deer.d = 0;
	var d = - Stage.groundAngle;
	_deer_rotate(deer, d);
	// _deer_rotate(deer, 10);
	this.items.push(deer);
}

var _deer_speed = 0.02;
function _deer_update(deer){
	_deer_rotate(deer, _deer_speed);
	if(deer.pos.y > view.size.height){
		// deer.ele.remove();
		// this.items = _.reject(this.items, function(item){ return item.id == deer.id; });
	}
}

function _deer_rotate(deer, d){
	var p = new Point(deer.pos.x, deer.pos.y);
	p = p.rotate(d, groundCenter);

	deer.pos.x = p.x;
	deer.pos.y = p.y;
	deer.d = (deer.d + d + 360) % 360;
	_deer_updateCss(deer);
}

function _deer_updateCss(deer){
	console.log(deer.d)
	var left = deer.pos.x - deer.size.w*0.5;
	var top = deer.pos.y - deer.size.h*0.5;
	deer.ele.css({left: left+'px', top: top});
	// deer.ele.css('transform', 'rotate('+ deer.d +'deg)');
}