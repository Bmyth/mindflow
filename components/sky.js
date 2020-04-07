function Sky() {
    BackPaper.activate();
    var sky = new BackPaper.Path.Circle({
        name: 'sky',
        center: Stage.rotateCenter,
        radius: Stage.galaxyRadius,
        strokeColor: '#666',
        fillColor: '#5db0ca'
    });

    sky.update = _sky_update;
    sky.update();
    FrontPaper.activate();
    return sky;
}

function _sky_update(){
    this.position.x = Stage.rotateCenter.x;
    this.position.y = Stage.rotateCenter.y;
}