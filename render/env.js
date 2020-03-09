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
	clouds: [],
	cloudRs: []
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

	var cloudPos = skyHeight - cloudHeight;

    for(var i =0; i < cloudNum; i++){
        var x = view.size.width * Math.random();
        var y = cloudPos + cloudRange * Math.random();
        var cloud = new Path.Circle({
            center: [x, y],
            radius: cloudSize,
            fillColor: '#2A3458',
            blendMode: 'darker'
        });
        var scaleX = 7 + 4 * Math.random();
        var scaleY = 0.3 * Math.random();
        cloud.opacity = 0.8;
        cloud.scale(scaleX, scaleY);
        cloud.idx = i;
        EnvRender.clouds.push(cloud);
        var cloudR = cloud.clone();
        cloudR.position.y = getReflectHeight(cloudR.position.y) + cloudReflectOffset;
        EnvRender.cloudRs.push(cloudR);
    }
}

EnvRender.refresh = function(count) {
	var wind = Math.random();
    EnvRender.clouds.forEach(function(c){
        c.position.x += cloudSpeed * 0.5 + cloudSpeed * wind;
        if(c.bounds.left > view.size.width + 20){
            c.position.x = - c.bounds.width - 120 * Math.random(); 
        }
        EnvRender.cloudRs[c.idx].position.x = c.position.x;
    })

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

function updateSkyAndWater(){
	// var brightColor = colorCardSky.getPixel(brightColorIndex, 5);
    var brightColor = '#1E62CD';
    if(EnvRender.sky){
        EnvRender.sky.fillColor = {
            origin: [view.size.width * 0.5, skyHeight],
            destination: [view.size.width * 0.5, 0],
            gradient: {
                stops: [[brightColor,0.2],['black',0.8]]
            }
        };
    }
    if(EnvRender.water){
        EnvRender.water.fillColor = {
            origin: [view.size.width * 0.5, skyHeight],
            destination: [view.size.width * 0.5, view.size.height],
            gradient: {
                stops: [[brightColor, 0.1], ['black', 0.9]]
            }
        };
    }
}
