var groundCenter = null;
var groundRadius = 0;
var groupdTop = 0;
var ground = null;

var cloudTimer = null;
var deerTimer = null;
function Ground(){
	ground = new Group();

	groundRadius = halfWidth / Math.sin(angleD2R * Stage.groundAngle);
	groupdTop = halfWidth / Math.tan(angleD2R * Stage.groundAngle);
	groundCenter = new Point(halfWidth, groupdTop + view.size.height);
	var base = new Path.Circle({
        radius: groundRadius,
        fillColor: theme.groundColor
    });
	base.position.x = halfWidth;
	base.position.y = groundCenter.y;
	base.name = 'base';
	ground.addChild(base);
	ground.base = base;

	ground.trees = [];
	ground.clouds = [];
	ground.deers = Deers();

	_ground_generateTrees();
	Stage.console.info('trees init.');
	_ground_generateClouds();
	Stage.console.info('clouds init.');
	_ground_initCloudsAnimation();		
	return ground;
}

var _ground_tree_typeNum = 4;
var  _ground_tree_ratio = 0.4;
var _ground_tree_possibility = 0.1;
function _ground_generateTrees(){
	for(var i = 1; i <= _ground_tree_typeNum; i++){
		var item = new Raster('asset/tree' + i + '.png');
		item.name = 'tree' + i;
		item.on('load', function() {
			var item = this;
			var symbol = new SymbolDefinition(item);
			
			var angleStep = 0.5;
			for(var j = -Stage.groundAngle; j < Stage.groundAngle; j += angleStep){
				if(Math.random() < _ground_tree_possibility){
					var tree = new SymbolItem(symbol);
					var ratio = _ground_tree_ratio * (0.2 + 0.8 * Math.random());
					tree.scale(ratio);
					tree.position.x = halfWidth;
					var posY = groundCenter.y - groundRadius - tree.bounds.height * 0.5 + 5 + 10 * Math.random();
					tree.position.y = posY;
					var d = j + angleStep * Math.random();
					tree.rotate(d, groundCenter);
					ground.addChild(tree);
					tree.sendToBack();
				}
			}

		})
	}
}

var  _ground_cloud_ratio = 0.5;
var _ground_cloud_possibility = 0.5;
var _ground_cloudNum = 10;
var _ground_cloudHeight = 120;
function _ground_generateClouds(){
	var item = new Raster('asset/cloud.png');
	item.on('load', function() {
		var item = this;
		var symbol = new SymbolDefinition(item);
		for(var i =0; i < _ground_cloudNum; i++){
			if(Math.random() < _ground_cloud_possibility){
				var cloud = new SymbolItem(symbol);
				var ratio = _ground_tree_ratio * (0.2 + 0.8 * Math.random());
				cloud.scale(ratio);
				cloud.position.x = halfWidth;
				var posY = groundCenter.y - groundRadius - _ground_cloudHeight * (0.7 + 0.3*Math.random());
				cloud.position.y = posY;
				var d = Stage.groundAngle - Stage.groundAngle * 2 * Math.random();
				cloud.rotate(d, groundCenter);
				ground.addChild(cloud);
				ground.clouds.push(cloud);
				cloud.sendToBack();
			}
		}
	})
}

function _ground_initCloudsAnimation(){
	cloudTimer = setInterval(_clouds_move, 50);
}

var _cloud_speed = 0.01;
function _clouds_move(){
	ground.clouds.forEach(function(cloud){
		var speed = cloud.position.y > view.size.height ? 5 :  _cloud_speed;
		cloud.rotate(speed, groundCenter)
	})
}
