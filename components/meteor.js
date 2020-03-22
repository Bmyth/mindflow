function Meteor() {
	var star = new Path.Circle({
        center: [0,0],
        radius: 4,
        fillColor: '#aaa',
        opacity: 0
    });
    star.name = 'star';
    var line = new Path.Line({
        from: [0, 0],
        to: [0, 0],
        strokeColor: '#aaa',
        strokeWidth: 1,
        opacity: 0
    });
    line.name = 'line';
	var meteor = new Group([star, line]);
    meteor.initFalling = _meteor_initFalling;
    meteor.falling = _meteor_falling;
	return meteor;
}

function _meteor_initFalling(pop){
    var star = this.children['star'];
    var popCenter = pop.children['popCenter'];
    star.position.x = popCenter.position.x;
    star.position.y = popCenter.position.y;
    star.opacity = 0.4;
    this.active = true;
    var line = this.children['line'];
    line.updateLinkPos(popCenter.position, popCenter.position);
    line.opacity = 0.4;
}

function _meteor_falling(){
    var fallingAngle = 60;
    var fallingSpeed = 30;
    var x = fallingSpeed * Math.sin(fallingAngle * angleD2R);
    var y = fallingSpeed * Math.cos(fallingAngle * angleD2R);

    var star = this.children['star'];
    star.position.x += x;
    star.position.y += y;
    if(star.opacity.y < 1){
        star.opacity += 0.02;
    }
    if(star.position.y > view.size.height){
        this.active = false;
        star.opacity = 0;
    }

    var maxLen = 120;
    var line = this.children['line'];
    if(this.active){
        var endPos = star.position;
        var startPos = line.segments[0].point;
        var v = new Point(endPos.x - startPos.x, endPos.y - startPos.y);
        var d = endPos.getDistance(startPos);
        d = Math.min(maxLen, d);
        v = v.normalize(d);
        line.segments[0].point.x = endPos.x - v.x;
        line.segments[0].point.y = endPos.y - v.y;
        line.segments[1].point.x = endPos.x;
        line.segments[1].point.y = endPos.y;
        if(line.opacity < 1){
            line.opacity += 0.02;
        } 
    }else{
        line.opacity = 0;
    }
}