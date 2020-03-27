var MapDiskRadius = 35;

function MapInit(){
    var map = new Group();
    map.diskCenter = new Point(MapDiskRadius,MapDiskRadius);
    var circle = new Path.Circle({
        center: [MapDiskRadius, MapDiskRadius],
        radius: MapDiskRadius,
        fillColor: '#fff',
        strokeColor: '#aaa'
    });
    var disk = new Group([circle]);
    var t = new PointText({
        point: [MapDiskRadius, 10],
        content: '0',
        justification: 'center',
        fontSize: 10,
        fillColor: '#333'
    });
    disk.name = 'disk';
    disk.addChild(t);
    map.addChild(disk);

    map.windowWidth = view.size.width * MapDiskRadius / Stage.galaxyRadius;
    map.windowHeight = view.size.height * MapDiskRadius / Stage.galaxyRadius;

    var windowItem = new Path.Rectangle({
        size: [map.windowWidth, map.windowHeight],
        strokeColor: '#333'
    });
    windowItem.name = 'window';
    map.addChild(windowItem);
    map.name = 'map';
    map.rotateDegree = Stage.degreeOffset;
    map.paint = _map_paint;
    map.paint();
    return map;
}

function _map_paint(){
	var pos = _map_getRelativePosition({x:view.size.width * 0.5, y:view.size.height * 0.5});
	this.children['window'].position.x = pos.x;
    this.children['window'].position.y = pos.y;
    var disk = this.children['disk'];
    disk.rotate(Stage.degreeOffset-this.rotateDegree, this.diskCenter);
    this.rotateDegree = Stage.degreeOffset;
}

function _map_getRelativePosition(pos){
	var x = MapDiskRadius + (pos.x - Stage.rotateCenter.x) * MapDiskRadius / Stage.galaxyRadius;
	var y = MapDiskRadius - (Stage.rotateCenter.y - pos.y) * MapDiskRadius / Stage.galaxyRadius;
	return {x:x, y:y}
}