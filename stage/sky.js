function Sky() {
    var sky = new Path.Rectangle({
        name: 'sky',
        size: [view.size.width, skyHeight]
    });
    sky.position.x = view.size.width * 0.5;
    sky.position.y = (skyHeight) * 0.5;
    sky.updateColor = _sky_updateColor;
    sky.updateColor();
    return sky;
}

function _sky_updateColor(){
    var brightColor = '#2D64C1';
    var darkColor = '#14366E';
    // this.fillColor = {
    //     origin: [view.size.width * 0.5, skyHeight],
    //     destination: [view.size.width * 0.5, 0],
    //     gradient: {
    //         stops: [[brightColor,0.2],[darkColor,0.8]]
    //     }
    // };
    this.fillColor = new Color('white');
}