var startText = null;
var consoleText = null;

var onHoverPop = null;
var onAssociatePop = null;
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

    rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    skyHeight = view.size.height - groundPostion;
    halfWidth = view.size.width * 0.5;

    editPanel = $('.edit-panel');
    document.onkeydown = function(event){
　　　　	var e  = event  ||  window.e;          
　　　　	var key = e.keyCode || e.which;
		onKeyPress(key)
	}
    
    view.onMouseDown = onMouseDown;
    view.onMouseMove = onMouseMove;
    view.onFrame = onFrame;

    PopRender.init();
    PopRender.paint();
    EnvRender.init();

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

    updateStageText();
}

Stage.onMouseEnterPop = function(popText){
    onHoverPop = popText;
    Stage.status = 'PopHover';
    updateStageText();
}

Stage.onMouseLeavePop = function(){
	if(Stage.status == 'PopHover'){
		onHoverPop = null;
	    Stage.status = '';
	    updateStageText();
	}
}

var hitOptions = {
    segments: false,
    stroke: false,
    fill: true,
    tolerance: 5
};

function onMouseDown(event){
	if(Stage.status == 'associate'){
		PopRender.finishAssociate();
	}
	if(Stage.status == '' || Stage.status == 'associate'){
		editPos = event.point;
		showEditInput(event.point);
		Stage.status = 'onEdit';
	}
	updateStageText();
	// var hitResult = project.hitTest(event.point, hitOptions)
}

function onMouseMove(event){
	if(Stage.status == 'associate'){
		PopRender.refreshAssociate(event.point);
	}
}

function onFrame(event) {
    // if(Stage.status == ''){
    //     PopRender.rotateDegree += rotateSpeed;
    //     if(PopRender.rotateDegree >= 360){
    //         PopRender.rotateDegree = 0;
    //     }
    // }
    // PopRender.refresh(event);
    // EnvRender.refresh(event.count);
}

function onKeyPress(key){
	// console.log(key)
	//finish edit
    if(key == 13 && Stage.status == 'onEdit'){
    	Stage.status = '';
        var text = editPanel.find('input').val();
        if(text){
        	var r = new Point(editPos.x,editPos.y).getDistance(rotateCenter);
	        var v1 = new Point(editPos.x - rotateCenter.x, editPos.y - rotateCenter.y);
	        var v2 = new Point(-1, 0);
	        var angle = (v2.getDirectedAngle(v1) - PopRender.rotateDegree + 360) % 360;
	        var date = new Date();
	        var pt = {t:text, r:r, d:angle, idx:date.getTime()};
            if(onAssociatePop){
            	Model.addPop(pt, onAssociatePop); 
            }else{
            	Model.addPop(pt); 
            }    
            PopRender.paint();
        }
        hideEditInput();
        onAssociatePop = null;
    }
    //delete
    if(key == '8' && Stage.status == 'PopHover'){
    	console.log('de')
        Model.deletePop(onHoverPop);
        PopRender.paint();
        Stage.status = '';
    }
    //associate
    if(key == '83' && Stage.status == 'PopHover'){
        Stage.status = 'associate';
        onAssociatePop = onHoverPop;
        onHoverPop = null;
        PopRender.PopAssociate(onAssociatePop);
    }
    if(key == '27' && Stage.status == 'associate'){
        Stage.status = '';
        PopRender.finishAssociate();
    }
    updateStageText();
}

function showEditInput(point){
    var x = point.x;
    var y = point.y;
    var w = editPanel.width();
    var h = editPanel.height();
    editPanel.css({'left':(x-w/2),'top':(y-h/2),'display':'flex'});
    editPanel.find('input').focus();
}

function hideEditInput(){
    editPanel.hide();
    editPanel.find('input').val('');
}

function updateStageText(){
	consoleText.content = consoleInfo[Stage.status] || '';
    startText.visible = Stage.status == '' && Model.pops.length == 0;
    
}

Stage.adjustLayers = function() {
    EnvRender.clouds.forEach(function(c){
        c.bringToFront();
    })
    EnvRender.cloudRs.forEach(function(c){
        c.bringToFront();
    })
    EnvRender.ground && EnvRender.ground.bringToFront(); 
    EnvRender.water && EnvRender.water.sendToBack();
    EnvRender.sky && EnvRender.sky.sendToBack();
}