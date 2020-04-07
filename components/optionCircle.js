function OptionCircle(){
	var optionCircle = new Group();
	optionCircle.visible = false;
	optionCircle.show = _oc_show;
	optionCircle.hide = _oc_hide;
	optionCircle.options = [];
	optionCircle.onMouseLeave = _optionCircle_mouseLeave;
	optionCircle.showDesc = _optionCircle_showDesc;
	optionCircle.clearDesc = _optionCircle_clearDesc;
	optionCircle.doOption = _optionCircle_doOption;
	optionCircle.pop = null;
	_optionCircle_initOptions(optionCircle);
	return optionCircle;
}

function _oc_show(pop){
	this.hide();
	var _this = this;
	var popText = pop.children['popText'];
	var radius = popText.bounds.width * 0.5;
	radius = Math.max(radius, 35);
	var centerCircle = new Path.Circle({
        center: [pop.pos.x, pop.pos.y],
        radius: radius + 12,
        strokeColor: '#ddd'
    });
    centerCircle.name = 'centerCircle';
    centerCircle.radius = radius;
	var innerCircle = new Path.Circle({
        center: [pop.pos.x, pop.pos.y],
        radius: radius + 24,
        strokeColor: theme.skyColor,
        strokeWidth: 24
    });
    innerCircle.name = 'innerCircle';
    var outerCircle = new Path.Circle({
        center: [pop.pos.x, pop.pos.y],
        radius: radius + 36,
        strokeColor: '#eee'
    });
    outerCircle.name = 'outerCircle';
    this.addChild(centerCircle);
    this.addChild(outerCircle);
    this.addChild(innerCircle);
    centerCircle.sendToBack();
    outerCircle.sendToBack();
    innerCircle.sendToBack();

    var i = 0;
    this.options.forEach(function(opt){
    	var p = new Point(pop.pos.x + radius + 24, pop.pos.y);
    	p = p.rotate(51 * i, pop.pos);
    	opt.position.x = p.x;
    	opt.position.y = p.y;
    	i++;
    })

    var desc = this.children['desc'];
    desc.position.x = pop.pos.x;
    desc.position.y = pop.pos.y + radius * 0.7;
    this.pop = pop;
	this.visible = true;
}

function _oc_hide(){
	if(this.children['centerCircle']){
		this.children['centerCircle'].remove();
	}
	if(this.children['outerCircle']){
		this.children['outerCircle'].remove();
	}
	if(this.children['innerCircle']){
		this.children['innerCircle'].remove();
	}
	this.visible = false;
}

function _optionCircle_mouseLeave(e){
	var cirlce = this.children['centerCircle'];
	if(cirlce){
		var point = e.point;
		var center = new Point(cirlce.position.x, cirlce.position.y);
		var d = center.getDistance(e.point);
		if(d > cirlce.radius + 36){
			this.hide();
		}
	}
}

function _optionCircle_initOptions(optionCircle){
	var options = ['edit', 'branch', 'connect', 'move', 'toggle', 'delete', 'more'];
	options.forEach(function(opt){
		var item = new Raster('asset/icon/' + opt + '.png');
		item.on('load', function() {
			var item = this;
			item.name = opt;
			item.size.width = 18;
			item.size.height = 18;
			item.onMouseEnter = function(){
				optionCircle.showDesc(this.name)
			};
			item.onMouseLeave = function(){
				optionCircle.clearDesc()
			};
			item.onClick = function(){
				optionCircle.doOption(this.name, this.position)
			}
			optionCircle.addChild(item);
			optionCircle.options.push(item);
		})
	})
  	var text = new PointText({
        content: '',
        justification: 'center',
        fontSize: 12,
        fillColor: theme.fontColor
    });
    text.name = 'desc';
    optionCircle.addChild(text);
}

function _optionCircle_showDesc(text){
	this.children['desc'].content = text;
}

function _optionCircle_clearDesc(){
	this.children['desc'].content = '';
}

function _optionCircle_doOption(option, position){
	ViewController.executeOption(this.pop, option, position);
	this.hide();
}