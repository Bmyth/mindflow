paper.install(window);
//globle
var pops = [];
var popRs = [];
var popAs= [];
var orbits = [];
var clouds = [];
var cloudRs = [];

var storageName = 'popstore';
var angleD2R = Math.PI/180;

//text
var popText = null;
var popTextR = null;
var textLight = null;
var textLightGround = null;
var popAText = null;
var fontSizePop = 50;
var fontSizePopA = 16;
//move
var rotateCenter = null;
var initRoteta = 0;
var rotateSpeed = 0.007;
var rotateDegree = 0;
var nFallingSlow = 2;
var viewCenter = null;
var scaleMin = 0.25;
var scaleMax = 0.8;
var shiningNum = 0;
var textLast = 2000;
var textHeight = 30;
var textReflectOffset = -10;
var fallingDegree = 30;
var fallingSpeed = 2;
//light
var colorCardSky = null;
var colorCard2 = null;
var brightColorIndex = 100;
var middleColorIndex = 0;
var colorWidth = 200;
var colorChangeDirction = 0;
//environment
var sky = null;
var ground = null;
var water = null;
var groundPostion = 150;
var groundRPostionAdjust = 35;
var skyHeight = 0;
var starRaduisInter = 1.2;
var starRaduisOuter = 8;
var starReflectRaduis = 1;
var cloudNum = 16;
var cloudHeight = 30;
var cloudSize = 10;
var cloudRange = 10;
var cloudSpeed = 0.1;
var cloudReflectOffset = 12;
//console edit
var editStatus = '';
var consoleText = null;
var consoleInfo = {
    'popHover' : '[enter]:edit, [d]:delete',
    'onEdit' : '[enter]:add, [esc]:cancel'
};
var onEditPop = null;
var editPanel = null;
var startText = null;
var editPos = null;

// localStorage.removeItem(storageName);
$(function() {
    stageInit();
    $("body").keypress(onKeyPress);
    view.onFrame = onFrame;
});

function onFrame(event) {
    var halfWidth = view.size.width * 0.5;
    rotateDegree += rotateSpeed;
    if(rotateDegree >= 360){
        rotateDegree = 0;
    }
    pops.forEach(function(pop){
        if(pop.status != 'falling'){
           rotatePop(pop, {degree:rotateSpeed}); 
        }else if(pop.status == 'falling'){
            fallPop(pop);
        }

        var popR = popRs[pop.idx];
        if(!popR){
            return;
        }
        popR.position.x = pop.position.x;
        popR.position.y = getReflectHeight(pop.position.y);
        
        var popA = popAs[pop.idx];
        popA.position.y = pop.position.y;
        var opacity = 0;

        if(pop.position.y > skyHeight){
            pop.opacity = 0;
            popR.opacity = 0;
            popA.opacity = 0;
        }else{
            opacity = getLightDegree(pop);
            pop.opacity = opacity;
            popR.opacity = opacity * 0.75;
            popA.opacity = opacity;
        }

        if(pop.onHover){
            popAText.content = pop.text;
            popAText.position.y = pop.position.y;
            popAText.position.x = view.size.width - popAText.bounds.width;
            popAText.opacity = pop.opacity;
        }

        if(pop.status == 'floating' && opacity > 0.5 && shiningNum == 0){
            if(Math.random() > 0.996){
                setShining(pop)
            }
        }
        if(pop.status == 'shining' || pop.status == 'falling'){
            popText.opacity = 0.5 - Math.abs(pop.time - textLast * 0.5) / textLast;
            popText.position.x = pop.position.x;
            popText.position.y = textHeight;
            popTextR.position.x = popText.position.x;
            popTextR.position.y = getReflectHeight(popText.position.y) + textReflectOffset;
            popTextR.opacity = popText.opacity * 0.7;
            textLight.position.x = popText.position.x;
            textLight.opacity = popText.opacity * 0.6;
            textLightGround.position.x = popText.position.x;
            textLightGround.opacity = popText.opacity * 1.5;
            popA.opacity = 1;

            pop.time += 1;
            if(pop.time > textLast){
                pop.status = 'floating';
                popText.opacity = 0;
                popTextR.opacity = 0;
                pop.time = 0;
                shiningNum -= 1;
            }
        }
    })

    var wind = Math.random();
    clouds.forEach(function(c){
        c.position.x += cloudSpeed * wind;
        if(c.bounds.left > view.size.width + 20){
            c.position.x = - c.bounds.width - 120 * Math.random(); 
        }
        cloudRs[c.idx].position.x = c.position.x;
    })

    if(event.count % 60 == 0){
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
    consoleRender();
}

function onKeyPress(e){
    if(e.which == 13 && editStatus == 'onEdit'){
        var text = editPanel.find('input').val();
        var r = new Point(editPos.x,editPos.y).getDistance(rotateCenter);
        var v1 = new Point(editPos.x - rotateCenter.x, editPos.y - rotateCenter.y);
        var v2 = new Point(-1, 0);
        var angle =  v2.getDirectedAngle(v1);
        var pt = {t:text, r:r, d:angle};
        if(text){
            var pop = generatePop(pt); 
            setShining(pop, textLast*0.5)        
        }
        if(pops.length == 0){
            startText.visible = true;
        }

        editPanel.hide();
        editPanel.find('input').val('');
        $('.console').hide();
        pt.d = (angle - rotateDegree + 360) % 360;
        savePop(pt);
        editStatus = '';
        consoleText.content = '';
    }
    if(e.which == '100' && editStatus == 'onHover'){
        if(onEditPop.status == 'shining'){
            setUnShining(onEditPop);
        }
        onEditPop.status = 'falling';
        onEditPop.onHover = false;
        popAText.content = '';
        editStatus = '';
    }
}

function generatePop(pt) {
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
    pop.idx = pops.length;
    pop.text = pt.t;
    pop.status = 'floating';
    pop.degree = pt.d;
    pops.push(pop);
    pop.on('mouseenter', mouseEnterPop);
    pop.on('mouseleave', mouseLeavePop);

    var popR = new Path.Circle({
        center: [x, getReflectHeight(y)],
        radius: starReflectRaduis,
        fillColor: 'white'
    });
    popRs.push(popR);

    var d = new Point(x, y).getDistance(rotateCenter);
    var orb = new Path.Circle({
        center: rotateCenter,
        radius: d,
        strokeColor: '#666',
        strokeWidth: 1,
        opacity: 0.12
    });
    orbits.push(orb);

    var popA = new Path.Rectangle({
        size: [12, 1],
        fillColor: '#aaa'
    });
    popA.position.x = view.size.width;
    popA.position.y = y;
    popA.idx = pop.idx;
    popA.text = pop.text;
    popAs.push(popA);

    adjustLayers();
    return pop;
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
        textLightGround.opacity = 0;
        deletePop(pop);
    }
}

function editPop(point){
    editStatus = 'onEdit';
    consoleText.content = consoleInfo['onEdit'];
    startText.visible = false;
    editPos = point;
    var x = point.x;
    var y = point.y;
    var w = editPanel.width();
    var h = editPanel.height();
    editPanel.css({'left':(x-w/2),'top':(y-h/2),'display':'flex'});
    editPanel.find('input').focus();
    $('.console').show();
}

function setShining(pop, time) {
    pops.forEach(function(p) {
        p.status = 'floating';
    })
    pop.status = 'shining';
    pop.time = time || 0;
    shiningNum = 1;
    popText.content = pop.text;
    popText.idx = pop.idx;
    popText.opacity = 0;
    popTextR.content = pop.text;
    popTextR.opacity = 0;
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

function getLightDegree(pop){
    var d = Math.sin(pop.degree * angleD2R);
    return  d;
}

function getReflectHeight(y) {
    var d = (skyHeight - y) / (skyHeight);
    return skyHeight +  groundPostion * d;
}

function updateSkyAndWater() {
    if(colorCardSky){
        var brightColor = colorCardSky.getPixel(brightColorIndex, 5);
        if(sky){
            sky.fillColor = {
                origin: [view.size.width * 0.5, skyHeight],
                destination: [view.size.width * 0.5, 0],
                gradient: {
                    stops: [[brightColor,0.05],['#162C44',0.3],['black',0.65]]
                }
            };
        }
        if(water){
            water.fillColor = {
                origin: [view.size.width * 0.5, skyHeight],
                destination: [view.size.width * 0.5, view.size.height],
                gradient: {
                    stops: [[brightColor, 0.05], ['#162C44', 0.3], ['black', 0.65]]
                }
            };
        } 
    }
}

function mouseEnterPop(){
    this.onHover = true;
    consoleText.content = consoleInfo['popHover'];
    onEditPop = this;
    editStatus = 'onHover';
}

function mouseLeavePop(){
    this.onHover = false;
    popAText.opacity = 0;
    consoleText.content = '';
    onEditPop = null;
    editStatus = '';
}

function adjustLayers() {
    clouds.forEach(function(c){
        c.bringToFront();
    })
    cloudRs.forEach(function(c){
        c.bringToFront();
    })
    ground && ground.bringToFront(); 
    textLightGround && textLightGround.bringToFront();
    water && water.sendToBack();
    orbits.forEach(function(c){
        c.sendToBack();
    })
    sky && sky.sendToBack();
}

function deletePop(pop){
    var idx = pop.idx;
    pops.splice(idx, 1);
    pops.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    popRs.splice(idx, 1);
    popAs.splice(idx, 1);
    popAs.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    orbits.splice(idx, 1);
    var popstore = JSON.parse(localStorage.getItem(storageName));
    popstore.splice(idx, 1);
    localStorage.setItem(storageName,JSON.stringify(popstore))
}

function savePop(pt) {
    var popstore = JSON.parse(localStorage.getItem(storageName));
    popstore = popstore || [];
    popstore.push(pt);
    localStorage.setItem(storageName,JSON.stringify(popstore))
}

function loadPops() {
    var popstore = JSON.parse(localStorage.getItem(storageName));
    popstore = popstore || [];
    popstore.forEach(function(pt) {
        generatePop(pt);
    })
    startText.visible = popstore.length == 0;
}

function stageInit(){
    $('#myCanvas').attr('height', $('body').height()).attr('width', $('body').width());
    paper.setup('myCanvas');
    var tool = new Tool();
    editPanel = $('.edit-panel');
    rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    skyHeight = view.size.height - groundPostion;
    ground = new Raster('ground');
    ground.on('load', function() {
        var w = ground.width;
        ground.size = new Size(view.size.width, ground.height * view.size.width / w);
        ground.position.x = view.size.width / 2;
        ground.position.y = skyHeight ;
        ground.name = 'ground';
        adjustLayers();
    })

    popText = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePop,
        strokeColor : 'white'
    });
    popText.opacity = 0;

    popTextR = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePop,
        strokeColor : 'white'
    });
    popTextR.opacity = 0;
    popTextR.scale(1, -0.85);


    textLight = new Path.Rectangle({
        size: [1, view.size.height],
        fillColor: '#666'
    });
    textLight.position.y = view.size.height * 0.5;
    textLight.opacity = 0;

    textLightGround = new Path.Circle({
        center: [0, skyHeight],
        radius: 2,
        fillColor: 'white'
    });
    textLightGround.scale(5, 0.6);
    textLightGround.opacity = 0;

    popAText = new PointText({
        point: [0, 0],
        content: '',
        justification: 'center',
        fontSize: fontSizePopA,
        fillColor : 'white'
    });
    popAText.opacity = 0;
    var cloudPos = skyHeight - cloudHeight;

    for(var i =0; i < cloudNum; i++){
        var x = view.size.width * Math.random();
        var y = cloudPos + cloudRange * Math.random();
        var cloud = new Path.Circle({
            center: [x, y],
            radius: cloudSize,
            fillColor: '#162C44',
            blendMode: 'darker'
        });
        var scaleX = 7 + 4 * Math.random();
        var scaleY = 0.3 * Math.random();
        cloud.opacity = 0.8;
        cloud.scale(scaleX, scaleY);
        cloud.idx = i;
        clouds.push(cloud);
        var cloudR = cloud.clone();
        cloudR.position.y = getReflectHeight(cloudR.position.y) + cloudReflectOffset;
        cloudRs.push(cloudR);
    }

    colorCardSky = new Raster('colorsky');
    colorCardSky.on('load', function() {
        colorCardSky.size = new Size(colorWidth, 10);
        colorCardSky.visible = false;
        sky = new Path.Rectangle({
            name: 'sky',
            size: [view.size.width, skyHeight]
        });
        sky.position.x = view.size.width * 0.5;
        sky.position.y = (skyHeight) * 0.5;

        water = new Path.Rectangle({
            name: 'water',
            size: [view.size.width, groundPostion]
        });
        water.position.x = view.size.width * 0.5;
        water.position.y = view.size.height - groundPostion * 0.5;
        updateSkyAndWater();
        loadPops();
        adjustLayers();
    })

    startText = new PointText({
        name: 'startText',
        content: "What's in your mind?",
        point: view.center,
        justification: 'center',
        fontSize: 24,
        fillColor: 'white'
    });

    consoleText = new PointText({
        name: 'consoleText',
        content: "",
        point: [view.size.width*0.5, view.size.height - 15],
        justification: 'center',
        fontSize: 14,
        fillColor: '#ddd'
    });

    tool.onMouseDown = function(event) {
        var hitOptions = {
            segments: false,
            stroke: false,
            fill: true,
            tolerance: 5
        };
        var segment = path = null;
        var hitResult = project.hitTest(event.point, hitOptions);

        if(!hitResult.item.isPop){
            editPop(event.point)
        }
    }
}

function consoleRender(){

}