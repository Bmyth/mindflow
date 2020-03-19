var MapRender = {
	objGroup : null,
	disk : null,
	window : null,
	windowWidth : 0,
	windowHeight : 0,
	rotateDegree : 0
}

var MapDiskRadius = 45;
var diskCenter = null;

MapRender.init = function() {
	diskCenter = new Point(MapDiskRadius,MapDiskRadius);
	var circle = new Path.Circle({
        center: [MapDiskRadius, MapDiskRadius],
        radius: MapDiskRadius,
        strokeColor: '#ccc'
    });
	this.disk = new Group([circle]);
	var t = new PointText({
        point: [MapDiskRadius, 8],
        content: '0',
        justification: 'center',
        fontSize: 8,
        fillColor: '#aaa'
    });
    this.disk.addChild(t);
    var t1 = t.clone();
    t1.content = '90';
    t1.rotate(90, diskCenter);
    this.disk.addChild(t1);
    var t2 = t.clone();
    t2.content = '180';
    t2.rotate(180, diskCenter);
    this.disk.addChild(t2);
    var t3 = t.clone();
    t3.content = '270';
    t3.rotate(270, diskCenter);
    this.disk.addChild(t3);

    MapRender.windowWidth = view.size.width * MapDiskRadius / galaxyRadius;
    MapRender.windowHeight = view.size.height * MapDiskRadius / galaxyRadius;

    this.window = new Path.Rectangle({
        size: [MapRender.windowWidth, MapRender.windowHeight],
        strokeColor: '#ccc'
    });
    this.objGroup = new Group([this.disk, this.window]);
    MapRender.paint();
}

MapRender.paint = function(){
	var pos = getRelativePositionInMap({x:view.size.width * 0.5, y:view.size.height * 0.5});
	this.window.position.x = pos.x;
    this.window.position.y = pos.y;

    this.disk.rotate(degreeOffset-this.rotateDegree, diskCenter);
    this.rotateDegree = degreeOffset;
}

function getRelativePositionInMap(pos){
	var x = MapDiskRadius + (pos.x - rotateCenter.x) * MapDiskRadius / galaxyRadius;
	var y = MapDiskRadius - (rotateCenter.y - pos.y) * MapDiskRadius / galaxyRadius;
	return {x:x, y:y}
}