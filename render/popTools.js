function getLinkPoint(pop1, pop2){
    var anglePop1 = getBoundsAngle(pop1.bounds);
    var anglePop2 = getBoundsAngle(pop2.bounds);
    var v1 = new Point(pop1.position.x - pop2.position.x, pop1.position.y - pop2.position.y);
    var v2 = new Point(0, -1);
    var d = v2.getAngle(v1);
    if(d > 90){
        d = 180 - d;
    }
    var r1 = d < anglePop1 ? pop1.bounds.height * 0.5 / Math.cos(angleD2R * d) : pop1.bounds.width * 0.5 / Math.sin(angleD2R * d);
    var r2 = d < anglePop2 ? pop2.bounds.height * 0.5 / Math.cos(angleD2R * d) : pop2.bounds.width * 0.5 / Math.sin(angleD2R * d);
    console.log(pop2.content)
    console.log(d, anglePop1, anglePop2, r1, r2)
    var v3 = v1.normalize(r1);
    var v4 = v1.normalize(r2);
    return {startX:pop1.position.x - v3.x, startY:pop1.position.y - v3.y, endX:pop2.position.x + v4.x, endY:pop2.position.y + v4.y}
}

function getBoundsAngle(bound){
    var v1 = new Point(bound.width, -bound.height);
    var v2 = new Point(0, -1);
    return v2.getAngle(v1);
}

PopRender.PopFall = function(pop){
    pop.status = 'falling';
}

function rotatePop(pop, params) {
    var _center = params.center || rotateCenter;
    pop.rotate(params.degree, _center);
    pop.degree = (pop.degree + params.degree) % 360;
}

function fallPop(pop){
    pop.position.x += fallingSpeed * Math.cos(fallingDegree * angleD2R);
    pop.position.y += fallingSpeed * Math.sin(fallingDegree * angleD2R);
    pop.opacity = pop.opacity * 1.2;

    if(pop.position.y > skyHeight){
        deletePop(pop);
    }
}

PopRender.Popshine = function(pop, time) {
    PopRender.pops.forEach(function(p) {
        p.status = 'floating';
    })
    pop.status = 'shining';
    pop.time = time || 0;
    shiningNum = 1;
}

function updatePopPosition(pop){
    if(Stage.status == '' && pop.status != 'falling'){
       rotatePop(pop, {degree:rotateSpeed}); 
    }else if(pop.status == 'falling'){
        fallPop(pop);
    }
}

function updatePopStyle(pop){
    if(pop.position.y > skyHeight){
        pop.opacity = 0;
    }else{
        opacity = getLightDegree(pop);
        pop.opacity = 0;
    }
}

function updatePopReflection(pop){

}

function updatePopTexts(pop){
	var popT = PopRender.popTexts[pop.idx];
	popT.position.x = pop.position.x;
    // popT.position.y = pop.position.y;
    // popT.opacity = pop.opacity;
}

function updatePopShiningEffect(pop){
    pop.time += 1;
    if(pop.time > textLast){
        pop.status = 'floating';
        pop.time = 0;
        shiningNum -= 1;
    }
}

function updatePopFallingEffect(pop){
    pop.time += 1;
    if(pop.time > textLast){
        pop.status = 'floating';
        pop.time = 0;
        shiningNum -= 1;
    }
}

function setUnShining(pop) {
    pops.forEach(function(p) {
        p.status = 'floating';
    })
    pop.time = 0;
    shiningNum = 0;
    popText.content = '';
    popText.opacity = 0;
    popTextR.content = '';
    popTextR.opacity = 0;
    textLight.opacity = 0;
}