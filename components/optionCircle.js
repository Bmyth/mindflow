function OptionCircle(){
	var optionCircle = new Group();
	// optionCircle.visible = false;
	optionCircle.show = _oc_show;
	optionCircle.hide = _oc_hide;
	optionCircle.options = [];
	optionCircle.showDesc = _optionCircle_showDesc;
	optionCircle.clearDesc = _optionCircle_clearDesc;
	optionCircle.doOption = _optionCircle_doOption;
	optionCircle.pop = null;
	// optionCircle.onMouseLeave = _optionCircle_mouseLeave;
	optionCircle.bringToFront();
	return optionCircle;
}

function _oc_show(pop){
	this.hide();
	var popText = pop.children['popText'];
	var radius = popText.bounds.width * 0.5;
	radius = Math.max(radius, 35);
	var color = theme.fontColor;
	var innerCircle = new Path.Circle({
        center: [pop.pos.x, pop.pos.y],
        radius: radius,
        strokeColor: color
    });
    innerCircle.opacity = 0.6;
    innerCircle.name = 'innerCircle';
    this.addChild(innerCircle);
    var outerCircle = new Path.Circle({
        center: [pop.pos.x, pop.pos.y],
        radius: radius + 10,
        strokeColor: color,
        fillColor: new Color(0, 0, 0, 0.05)
    });
    outerCircle.opacity = 0.4;
    outerCircle.name = 'outerCircle';
    outerCircle.onMouseLeave = _optionCircle_mouseLeave;
    this.addChild(outerCircle);
	this.visible = true;
}

function _oc_hide(){
	if(this.children['outerCircle']){
		this.children['outerCircle'].remove();
	}
	if(this.children['innerCircle']){
		this.children['innerCircle'].remove();
	}
	this.visible = false;
}

function _optionCircle_mouseLeave(){
	Comp.optionCircle.hide();
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