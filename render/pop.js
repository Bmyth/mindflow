var shiningNum = 0;

var PopRender = {
	pops: [],
	popReflects: [],
	popAnchors: [],
	orbits: [],
	textLight: null,
	textLightOnGround: null,
	popText: null,
	popTextReflect: null,
	popAnchorText: null
}

PopRender.init = function(){
  	PopRender.textLight = new Path.Rectangle({
        size: [1, view.size.height],
        fillColor: '#666'
    });
    PopRender.textLight.position.y = view.size.height * 0.5;
    PopRender.textLight.opacity = 0;

    PopRender.textLightOnGround = new Path.Circle({
        center: [0, skyHeight],
        radius: 2,
        fillColor: 'white'
    });
    PopRender.textLightOnGround.scale(5, 0.6);
    PopRender.textLightOnGround.opacity = 0;

    PopRender.popText = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePop,
        fillColor : 'white'
    });
    PopRender.popText.opacity = 0;

    PopRender.popTextReflect = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePop,
        fillColor : 'white'
    });
    PopRender.popTextReflect.opacity = 0;
    PopRender.popTextReflect.scale(1, -0.85);

    PopRender.popAnchorText = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePopA,
        fillColor : 'white'
    });
    PopRender.popAnchorText.opacity = 0;
}

PopRender.initPop = function(pt) {
	var x = view.size.width * 0.5 - pt.r * Math.cos(pt.d * angleD2R);
    var y = rotateCenter.y - pt.r * Math.sin(pt.d * angleD2R);
    var popInter = new Path.Circle({
        center: [x, y],
        radius: starRaduisInter,
        fillColor: 'white'
    });

    var popOuter = new Path.Circle({
        center: [x, y],
        radius: starRaduisOuter,
        fillColor: 'white',
        opacity: 0.01
    });
    var pop = new Group([popInter, popOuter]);
    pop.position.x = x;
    pop.position.y = y;
    pop.idx = PopRender.pops.length;
    pop.text = pt.t;
    pop.status = 'floating';
    pop.degree = pt.d;
    PopRender.pops.push(pop);
    pop.on('mouseenter', function(){
    	pop.onHover = true;
    	PopRender.popAnchorText.content = pop.text;
    	Stage.onMouseEnterPop(pop);
    });
    pop.on('mouseleave', function(){
    	pop.onHover = false;
    	PopRender.popAnchorText.content = '';
    	Stage.onMouseLeavePop(pop);
    });

    var popR = new Path.Circle({
        center: [x, getReflectHeight(y)],
        radius: starReflectRaduis,
        fillColor: 'white'
    });
    PopRender.popReflects.push(popR);

    var d = new Point(x, y).getDistance(rotateCenter);
    var orb = new Path.Circle({
        center: rotateCenter,
        radius: d,
        strokeColor: '#666',
        strokeWidth: 1,
        opacity: 0.12
    });
    PopRender.orbits.push(orb);

    var popA = new Path.Rectangle({
        size: [12, 1],
        fillColor: '#aaa'
    });
    popA.position.x = view.size.width;
    popA.position.y = y;
    popA.idx = pop.idx;
    popA.text = pop.text;
    PopRender.popAnchors.push(popA);

    Stage.adjustLayers();
    return pop;
}

PopRender.refresh = function(event){
	this.pops.forEach(function(pop){
        updatePopPosition(pop);
        updatePopStyle(pop);
        updatePopReflection(pop);
        updatePopAnchor(pop);
        if(pop.onHover){
        	updatePopAnchorText(pop);
        }

        if(pop.status == 'floating' && pop.opacity > 0.5 && shiningNum == 0){
            if(Math.random() > 0.996){
                PopRender.Popshine(pop);
            }
        }
        if(pop.status == 'shining'){
        	updatePopShiningEffect(pop);
        }
        if(pop.status == 'falling'){
        	updatePopFallingEffect(pop);
        }
    })
}

PopRender.PopFall = function(pop){
	pop.status = 'falling';
}

function rotatePop(pop, params) {
    var _center = params.center || rotateCenter;
    var p = pop.position.rotate(params.degree, _center);
    pop.position.x = p.x;
    pop.position.y = p.y;
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
    PopRender.popText.content = pop.text;
    PopRender.popText.idx = pop.idx;
    PopRender.popText.opacity = 0;
    PopRender.popTextReflect.content = pop.text;
    PopRender.popTextReflect.opacity = 0;
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
        popR.opacity = 0;
        popA.opacity = 0;
    }else{
        opacity = getLightDegree(pop);
        pop.opacity = opacity;
    }
}

function updatePopReflection(pop){
	var popR = PopRender.popReflects[pop.idx];
    popR.position.x = pop.position.x;
    popR.position.y = getReflectHeight(pop.position.y);
    popR.opacity = pop.opacity * 0.75;
}

function updatePopAnchor(pop){
	var popA = PopRender.popAnchors[pop.idx];
    popA.position.y = pop.position.y;
    popA.opacity = pop.opacity;
}

function updatePopAnchorText(pop){
    PopRender.popAnchorText.content = pop.text;
    PopRender.popAnchorText.position.y = pop.position.y;
    PopRender.popAnchorText.position.x = view.size.width - PopRender.popAnchorText.bounds.width;
    PopRender.popAnchorText.opacity = pop.opacity;
}

function updatePopShiningEffect(pop){
    PopRender.popText.opacity = 0.5 - Math.abs(pop.time - textLast * 0.5) / textLast;
    PopRender.popText.position.x = pop.position.x;
    PopRender.popText.position.y = textHeight;
    PopRender.popTextReflect.position.x = PopRender.popText.position.x;
    PopRender.popTextReflect.position.y = getReflectHeight(PopRender.popText.position.y) + textReflectOffset;
    PopRender.popTextReflect.opacity = PopRender.popText.opacity * 0.7;
    PopRender.textLight.position.x = PopRender.popText.position.x;
    PopRender.textLight.opacity = PopRender.popText.opacity * 0.6;
    PopRender.textLightOnGround.position.x = PopRender.popText.position.x;
    PopRender.textLightOnGround.opacity = PopRender.popText.opacity * 1.5;
    PopRender.popAnchorText.opacity = 1;

    pop.time += 1;
    if(pop.time > textLast){
        pop.status = 'floating';
        PopRender.popText.opacity = 0;
        PopRender.popTextReflect.opacity = 0;
        pop.time = 0;
        shiningNum -= 1;
    }
}

function updatePopFallingEffect(pop){
    PopRender.popText.opacity = 0.5 - Math.abs(pop.time - textLast * 0.5) / textLast;
    PopRender.popText.position.x = pop.position.x;
    PopRender.popText.position.y = textHeight;
    PopRender.popTextReflect.position.x = PopRender.popText.position.x;
    PopRender.popTextReflect.position.y = getReflectHeight(PopRender.popText.position.y) + textReflectOffset;
    PopRender.popTextReflect.opacity = PopRender.popText.opacity * 0.7;
    PopRender.textLight.position.x = PopRender.popText.position.x;
    PopRender.textLight.opacity = PopRender.popText.opacity * 0.6;
    PopRender.textLightOnGround.position.x = PopRender.popText.position.x;
    PopRender.textLightOnGround.opacity = PopRender.popText.opacity * 1.5;
    PopRender.popAnchorText.opacity = 1;

    pop.time += 1;
    if(pop.time > textLast){
        pop.status = 'floating';
        PopRender.popText.opacity = 0;
        PopRender.popTextReflect.opacity = 0;
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

function setAssociat(pop){
    pops.forEach(function(p) {
        p.status = 'floating';
    })
    pop.status = 'associating';
    var popOuter = pop.children[1];
    popOuter.opacity = 1;
    popOuter.fillColor = 'transparent';
    popOuter.strokeColor = 'white';
}

function deletePop(pop){
    var d = PopRender.pops.splice(idx, 1);
    d[0].remove();
    PopRender.pops.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    d = PopRender.popReflects.splice(idx, 1);
    d[0].remove();
    d = PopRender.popAnchors.splice(idx, 1);
    d[0].remove();
    PopRender.popAnchors.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    d = PopRender.orbits.splice(idx, 1);
    d[0].remove();
}

function getLightDegree(pop){
    var d = Math.sin(pop.degree * angleD2R);
    return  d;
}

function getReflectHeight(y) {
    var d = (skyHeight - y) / (skyHeight);
    return skyHeight +  groundPostion * d;
}