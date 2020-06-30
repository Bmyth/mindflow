_colorpicker_itemsize = 20;
_colorpicker_radius = 40;
function ColorPicker(){
	var colorPicker = new Group();
	var colors = ['coral','lightblue','hotpink','orange', 'lightsalmon'];
	colors.forEach(function(color){
		var colorShape = new Path.Rectangle({
	    	size: [_colorpicker_itemsize, _colorpicker_itemsize],
	    	fillColor: color
	    });
	    colorShape.color = color;
	    colorShape.onClick = _colorpicker_pick;
	    colorPicker.addChild(colorShape);
	})
	colorPicker.show = _colorpicker_show;
	colorPicker.hide = _colorpicker_hide;
	colorPicker.visible = false;
	return colorPicker;
} 

function _colorpicker_pick(){
	var colorPicker = Stage.colorPicker;
	ViewController.executeOption(colorPicker.pop, 'setRootColor', this.color);
	colorPicker.hide();
}

function _colorpicker_show(params){
	var _cp = this;
	this.point = params.point;
	this.pop = params.pop;
	var originPoint = new Point(this.point.x, this.point.y + _colorpicker_radius);
	var d = 0;
	this.children.forEach(function(colorShape){
		colorShape.position.x = originPoint.x + d;
		colorShape.position.y = originPoint.y;
		d += 40;
	})
	this.visible = true;
}

function _colorpicker_hide(){
	this.visible = false;
}