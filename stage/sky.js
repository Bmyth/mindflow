function Sky() {
    var sky = new Path.Circle({
        name: 'sky',
        center: Stage.rotateCenter,
        radius: Stage.galaxyRadius,
        strokeColor: '#666'
    });

    sky.update = _sky_update;
    sky.update();
    
    return sky;
}

function _sky_update(){
    this.position.x = Stage.rotateCenter.x;
    this.position.y = Stage.rotateCenter.y;
    // console.log(Stage.rotateCenter)
}