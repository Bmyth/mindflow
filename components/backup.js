function Fringe(){
    var radius = Stage.rotateCenter.y;
    var popInner = new Path.Circle({
        center: Stage.rotateCenter,
        radius: radius - 20,
        strokeColor: '#888'
    });
    var popOuter = new Path.Circle({
        center: Stage.rotateCenter,
        radius: radius - 35,
        strokeColor: '#bbb'
    });
    var fringe = new Group([popInner, popOuter]);
    fringe.name = 'fringe';
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
            copy.rotate(i, Stage.rotateCenter);
            copy.content = '' + i;
            fringe.addChild(copy);
        }
        var copyl = l.clone();
        copyl.rotate(i, Stage.rotateCenter);
        fringe.addChild(copyl);
    }
    t.remove();
    l.remove();
    fringe.visible = false;
    fringe.rotate = _fringe_rotate;
    return fringe;
}

function _fringe_rotate(degree){
    this.fringe.children.forEach(function(i){
        i.rotate(degree, Stage.rotateCenter);
    })
}

function AxisY(){
    var initY = Stage.rotateCenter.y - galaxyRadius;
    var axisY = new Path.Line({
        from: [Stage.rotateCenter.x, Stage.rotateCenter.y],
        to: [halfWidth, initY],
        strokeColor: '#aaa',
        strokeWidth: 1
    });
    var axisY = new Group([axisY]);
    axisY.originY = Stage.rotateCenter.y;

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
        var y = Stage.rotateCenter.y-i;
        if(i % 100 == 0){
            var copy = t.clone();
            copy.updatePointPos({x:halfWidth+20, y:y});
            copy.content = '' + i;
            axisY.addChild(copy);
        }
        var copyl = l.clone();
        copyl.updateLinkPos({x:halfWidth, y:y}, {x:halfWidth+8, y:y});
        axisY.addChild(copyl);
    }
    axisY.visible = false;
    axisY.name = 'axisY';
    t.remove();
    l.remove();
    axisY.adjustStage.rotateCenter = _asixY_adjustStage.rotateCenter;
    return axisY;
}

function _asixY_adjustStage.rotateCenter(){
    var offset = this.originY - Stage.rotateCenter.y;
    this.children.forEach(function(i){
        i.position.y -= offset;
    })
    this.originY = Stage.rotateCenter.y;
}

function refreshBackColor(count) {
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