var MapDiskRadius = 20;

function MapInit(){
    var map = new Group();
    map.diskCenter = new Point(MapDiskRadius,MapDiskRadius);
    var circle = new Path.Circle({
        center: [MapDiskRadius, MapDiskRadius],
        radius: MapDiskRadius,
        strokeColor: '#666'
    });
    var disk = new Group([circle]);
    var t = new PointText({
        point: [MapDiskRadius, 10],
        content: '0',
        justification: 'center',
        fontSize: 8,
        fillColor: '#333'
    });
    disk.addChild(t);
    var t1 = t.clone();
    t1.content = '180';
    t1.rotate(180, map.diskCenter);
    disk.addChild(t1);
    disk.name = 'disk';
    map.addChild(disk);

    map.windowWidth = view.size.width * MapDiskRadius / galaxyRadius;
    map.windowHeight = view.size.height * MapDiskRadius / galaxyRadius;

    var windowItem = new Path.Rectangle({
        size: [map.windowWidth, map.windowHeight],
        strokeColor: '#333'
    });
    windowItem.name = 'window';
    map.addChild(windowItem);
    map.name = 'map';
    map.rotateDegree = degreeOffset;
    map.paint = _map_paint;
    map.paint();
    return map;
}

function _map_paint(){
	var pos = _map_getRelativePosition({x:view.size.width * 0.5, y:view.size.height * 0.5});
	this.children['window'].position.x = pos.x;
    this.children['window'].position.y = pos.y;
    var disk = this.children['disk'];
    disk.rotate(degreeOffset-this.rotateDegree, this.diskCenter);
    this.rotateDegree = degreeOffset;
}

function _map_getRelativePosition(pos){
	var x = MapDiskRadius + (pos.x - rotateCenter.x) * MapDiskRadius / galaxyRadius;
	var y = MapDiskRadius - (rotateCenter.y - pos.y) * MapDiskRadius / galaxyRadius;
	return {x:x, y:y}
}