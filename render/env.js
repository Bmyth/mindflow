//light
var colorCardSky = null;
var colorWidth = 1000;
var brightColorIndex = 600;
var middleColorIndex = 0;
var colorChangeDirction = 0;

var EnvRender = {
	ground: null,
	sky: null,
	water: null,
    fringe: null,
    axisY: null
};

EnvRender.init = function(){
	this.ground = new Raster('ground');
	this.ground.on('load', function() {
	    var w = EnvRender.ground.width;
	    EnvRender.ground.size = new Size(view.size.width, EnvRender.ground.height * view.size.width / w);
	    EnvRender.ground.position.x = view.size.width / 2;
	    EnvRender.ground.position.y = skyHeight ;
	    Stage.adjustLayers();
	})

	colorCardSky = new Raster('colorsky');
    colorCardSky.on('load', function() {
        colorCardSky.size = new Size(colorWidth, 10);
        colorCardSky.visible = false;
        EnvRender.sky = new Path.Rectangle({
            name: 'sky',
            size: [view.size.width, skyHeight]
        });
        EnvRender.sky.position.x = view.size.width * 0.5;
        EnvRender.sky.position.y = (skyHeight) * 0.5;

        EnvRender.water = new Path.Rectangle({
            name: 'water',
            size: [view.size.width, groundPostion]
        });
        EnvRender.water.position.x = view.size.width * 0.5;
        EnvRender.water.position.y = view.size.height - groundPostion * 0.5;
        updateSkyAndWater();
        Stage.adjustLayers();
    })

    EnvRender.paintFringe();
    EnvRender.paintAxisY();
}

EnvRender.rotateFringe = function(degree){
    this.fringe.children.forEach(function(i){
        i.rotate(degree, rotateCenter);
    })
}

EnvRender.paintFringe = function(){
    if(this.fringe){
        this.fringe.remove();
    }

    var radius = rotateCenter.y;
    var popInner = new Path.Circle({
        center: rotateCenter,
        radius: radius - 20,
        strokeColor: '#888'
    });
    var popOuter = new Path.Circle({
        center: rotateCenter,
        radius: radius - 35,
        strokeColor: '#bbb'
    });
    this.fringe = new Group([popInner, popOuter]);
    var t = new PointText({
        point: [halfWidth, 45],
        content: '0',
        justification: 'center',
        fontSize: 12,
        fillColor: '#ccc'
    });
    var l = new Path.Line({
        from: [halfWidth, 20],
        to: [halfWidth, 28],
        strokeColor: '#aaa',
        strokeWidth: 1
    });
    for(var i = 0; i< 360; i+=1){
        if(i % 10 == 0){
            var copy = t.clone();
            copy.rotate(i, rotateCenter);
            copy.content = '' + i;
            this.fringe.addChild(copy);
        }
        var copyl = l.clone();
        copyl.rotate(i, rotateCenter);
        this.fringe.addChild(copyl);
    }
    t.remove();
    l.remove();
    this.fringe.visible = false;
}

EnvRender.paintAxisY = function(){
    var initY = rotateCenter.y - galaxyRadius;
    var axisY = new Path.Line({
        from: [rotateCenter.x, rotateCenter.y],
        to: [halfWidth, initY],
        strokeColor: '#aaa',
        strokeWidth: 1
    });
    this.axisY = new Group([axisY]);
    this.axisY.originY = rotateCenter.y;

    var l = new Path.Line({
        from: [0, 0],
        to: [0, 0],
        strokeColor: '#aaa',
        strokeWidth: 1
    });
    var t = new PointText({
        point: [0, initY],
        content: '0',
        justification: 'center',
        fontSize: 12,
        fillColor: '#ccc'
    });
    for(var i = 0; i< galaxyRadius; i+=50){
        var y = rotateCenter.y-i;
        if(i % 100 == 0){
            var copy = t.clone();
            copy.moveTo({x:halfWidth+20, y:y});
            copy.content = '' + i;
            this.axisY.addChild(copy);
        }
        var copyl = l.clone();
        copyl.updateLinkPos({x:halfWidth, y:y}, {x:halfWidth+8, y:y});
        this.axisY.addChild(copyl);
    }
    this.axisY.visible = false;
    t.remove();
    l.remove();
}

EnvRender.adjustRotateCenter = function(){
    var offset = this.axisY.originY - rotateCenter.y;
    this.axisY.children.forEach(function(i){
        i.position.y -= offset;
    })
    this.axisY.originY = rotateCenter.y;
}

EnvRender.refresh = function(count) {
    if(count % 60 == 0){
        if(colorCardSky){
            if(colorChangeDirction == 0){
                brightColorIndex += 1;
                if(brightColorIndex == colorWidth - 1){
                    colorChangeDirction = 1;
                }
            }else{
                brightColorIndex -= 1;
                if(brightColorIndex == 1){
                    colorChangeDirction = 0;
                }
            }
            updateSkyAndWater();
        }
    }
}

EnvRender.showFringe = function(){
    this.fringe.visible = true;
}

EnvRender.hideFringe = function(){
    setTimeout(function(){
       EnvRender.fringe.visible = false; 
    }, 1500);
}

EnvRender.showAxis = function(){
    this.axisY.visible = true;
}

EnvRender.hideAxis = function(){
    setTimeout(function(){
       EnvRender.axisY.visible = false; 
    }, 500);
}

function updateSkyAndWater(){
	// var brightColor = colorCardSky.getPixel(brightColorIndex, 5);
    var brightColor = '#2D64C1';
    var darkColor = '#14366E';
    if(EnvRender.sky){
        EnvRender.sky.fillColor = {
            origin: [view.size.width * 0.5, skyHeight],
            destination: [view.size.width * 0.5, 0],
            gradient: {
                stops: [[brightColor,0.2],[darkColor,0.8]]
            }
        };
    }
    if(EnvRender.water){
        EnvRender.water.fillColor = {
            origin: [view.size.width * 0.5, skyHeight],
            destination: [view.size.width * 0.5, view.size.height+20],
            gradient: {
                stops: [[brightColor, 0.2], [darkColor, 0.8]]
            }
        };
    }
}
