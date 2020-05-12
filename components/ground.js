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
	return ground;
}