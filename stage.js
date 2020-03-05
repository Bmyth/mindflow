var startText = null;
var consoleText = null;

var onHoverPop = null;

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

    PopRender.init();
    Model.pops.forEach(function(pt) {
        PopRender.initPop(pt);
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

    updateStageText();
}

Stage.onMouseEnterPop = function(pop){
    onHoverPop = pop;
    Stage.status = 'PopHover';
    updateStageText();
}

Stage.onMouseLeavePop = function(pop){
	onHoverPop = null;
    Stage.status = '';
    updateStageText();
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
	//finish edit
    if(e.which == 13 && Stage.status == 'onEdit'){
        var text = editPanel.find('input').val();
        var r = new Point(editPos.x,editPos.y).getDistance(rotateCenter);
        var v1 = new Point(editPos.x - rotateCenter.x, editPos.y - rotateCenter.y);
        var v2 = new Point(-1, 0);
        var angle =  v2.getDirectedAngle(v1);
        var pt = {t:text, r:r, d:angle};
        if(text){
            var pop = PopRender.initPop(pt); 
            PopRender.Popshine(pop, textLast*0.5)        
        }
        editPanel.hide();
        editPanel.find('input').val('');
        pt.d = (angle - rotateDegree + 360) % 360;
        Model.savePop(pt);
        Stage.status = '';
    }
    //delete
    if(e.which == '100' && Stage.status == 'PopHover'){
        PopRender.PopFall(onHoverPop);
        Model.deletePop(onHoverPop);
        Stage.status = '';
    }
    //associate
    if(e.which == '115' && Stage.status == 'onHover'){
        Stage.status = 'associate';
        setAssociat(onEditPop)
    }
    updateStageText();
}

function editPop(point){
    Stage.status = 'onEdit';
    startText.visible = false;
    editPos = point;
    var x = point.x;
    var y = point.y;
    var w = editPanel.width();
    var h = editPanel.height();
    editPanel.css({'left':(x-w/2),'top':(y-h/2),'display':'flex'});
    editPanel.find('input').focus();
    updateStageText();
}

function updateStageText(){
	consoleText.content = consoleInfo[Stage.status] || '';
    startText.visible = Model.pops.length == 0;
    
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