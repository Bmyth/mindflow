var startText = null;
var consoleText = null;

var onEditPop = null;
var editPanel = null;
var editPos = null;
var rotateCenter = null;

var Stage = {
	status: ''
};

Stage.init = function() {
	paper.install(window);
	$('#myCanvas').attr('height', $('body').height()).attr('width', $('body').width());
    paper.setup('myCanvas');

    var tool = new Tool();
    editPanel = $('.edit-panel');
    
    tool.onMouseDown = function(event) {
        var hitOptions = {
            segments: false,
            stroke: false,
            fill: true,
            tolerance: 5
        };
        var segment = path = null;
        var hitResult = project.hitTest(event.point, hitOptions);

        if(!hitResult.item.isPop && event.point.y < skyHeight){
            editPop(event.point)
        }
    }

    view.onMouseMove = onMouseMove;

    $("body").keypress(onKeyPress);

    view.onFrame = onFrame;

	rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    skyHeight = view.size.height - groundPostion;
    halfWidth = view.size.width * 0.5;

    Model.pops.forEach(function(pt) {
        PopRender.init(pt);
    })

    EnvRender.init();

    startText = new PointText({
        name: 'startText',
        content: "What's in your mind?",
        point: view.center,
        justification: 'center',
        fontSize: 24,
        fillColor: 'white'
    });
    startText.visible = Model.pops.length == 0;

    consoleText = new PointText({
        name: 'consoleText',
        content: "",
        point: [view.size.width*0.5, view.size.height - 15],
        justification: 'center',
        fontSize: 14,
        fillColor: '#ddd'
    });
}

Stage.onMouseEnterPop = function(pop){
	pop.onHover = true;
    consoleText.content = consoleInfo['popHover'];
    onEditPop = pop;
    Stage.status = 'onHover';
}

Stage.onMouseLeavePop = function(pop){
	pop.onHover = false;
    if(Stage.status == 'onHover'){
        popAText.opacity = 0;
        consoleText.content = '';
        onEditPop = null;
        Stage.status = '';
    }
}

function onMouseMove(event){
	
}

function onFrame(event) {
    if(Stage.status == ''){
        rotateDegree += rotateSpeed;
        if(rotateDegree >= 360){
            rotateDegree = 0;
        }
    }
    PopRender.refresh(event);
    EnvRender.refresh(event.count);
}

function onKeyPress(e){
    if(e.which == 13 && Stage.status == 'onEdit'){
        var text = editPanel.find('input').val();
        var r = new Point(editPos.x,editPos.y).getDistance(rotateCenter);
        var v1 = new Point(editPos.x - rotateCenter.x, editPos.y - rotateCenter.y);
        var v2 = new Point(-1, 0);
        var angle =  v2.getDirectedAngle(v1);
        var pt = {t:text, r:r, d:angle};
        if(text){
            var pop = PopRender.initPop(pt); 
            PopRender.shinePop(pop, textLast*0.5)        
        }
        if(Model.pops.length == 0){
            startText.visible = true;
        }

        editPanel.hide();
        editPanel.find('input').val('');
        $('.console').hide();
        pt.d = (angle - rotateDegree + 360) % 360;
        Model.savePop(pt);
        Stage.status = '';
        consoleText.content = '';
    }
    //delete
    if(e.which == '100' && Stage.status == 'onHover'){
        if(onEditPop.status == 'shining'){
            setUnShining(onEditPop);
        }
        onEditPop.status = 'falling';
        onEditPop.onHover = false;
        Stage.status = '';
    }
    //associate
    if(e.which == '115' && Stage.status == 'onHover'){
        Stage.status = 'associate';
        consoleText.content = consoleInfo['associate'];
        setAssociat(onEditPop)
    }
}

function editPop(point){
    Stage.status = 'onEdit';
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

Stage.adjustLayers = function() {
    EnvRender.clouds.forEach(function(c){
        c.bringToFront();
    })
    EnvRender.cloudRs.forEach(function(c){
        c.bringToFront();
    })
    EnvRender.ground && EnvRender.ground.bringToFront(); 
    PopRender.textLightGround && PopRender.textLightGround.bringToFront();
    EnvRender.water && EnvRender.water.sendToBack();
    PopRender.orbits.forEach(function(c){
        c.sendToBack();
    })
    EnvRender.sky && EnvRender.sky.sendToBack();
}