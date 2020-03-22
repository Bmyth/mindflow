var groundPostion = 120;

function Ground(){
	var ground = new Group();
	var mountain = new Raster('./asset/mountain.png');
	mountain.on('load', function() {
	    var w = mountain.width;
	    mountain.size = new Size(view.size.width, mountain.height * view.size.width / w);
	    mountain.position.x = view.size.width / 2;
	    mountain.position.y = skyHeight;
	    Stage.adjustLayers();
	})
	mountain.name = 'mountain';
	ground.mountain = mountain;
	ground.addChild(mountain);
	var base = new Path.Rectangle({
	    name: 'water',
	    size: [view.size.width, groundPostion]
	});
	base.position.x = view.size.width * 0.5;
	base.position.y = view.size.height - groundPostion * 0.5;
	base.updateColor = _groundbase_updateColor;
	base.updateColor();
	base.name = 'base';
	ground.addChild(base);
	ground.base = base;
	return ground;
}

function _groundbase_updateColor(){
	var brightColor = '#2D64C1';
    var darkColor = '#14366E';
	// this.fillColor = {
 //        origin: [view.size.width * 0.5, skyHeight],
 //        destination: [view.size.width * 0.5, view.size.height+20],
 //        gradient: {
 //            stops: [[brightColor, 0.2], [darkColor, 0.8]]
 //        }
 //    };
    this.fillColor = new Color('#ddd');
}

