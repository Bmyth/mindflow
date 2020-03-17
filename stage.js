var startText = null;
var consoleText = null;

var onHoverPop = null;
var onAssociatePop = null;
var onEditPop = null;
var editPanel = null;
var editPos = null;

var Stage = {
	status: ''
};

Stage.init = function() {
	paper.install(window);
	$('#myCanvas').attr('height', $('body').height()).attr('width', $('body').width());
    paper.setup('myCanvas');

    applyPaperPlus();

    rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    skyHeight = view.size.height - groundPostion;
    halfWidth = view.size.width * 0.5;

    editPanel = $('.edit-panel');
    document.onkeydown = function(event){
　　　　	var e  = event  ||  window.e;          
　　　　	var key = e.keyCode || e.which;
		onKeyPress(key, event.target)
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
    if(Stage.status == 'rotating'){
    	if(!EnvRender.fringe.visible){
    		EnvRender.showFringe();
    	}
        if(rotatingDegree != 0){
        	var d = rotatingDegree > 0 ? rotateSpeed : -rotateSpeed;
        	PopRender.rotate(d);
        	EnvRender.rotateFringe(d);
        	degreeOffset += d;
        	rotatingDegree -=  d;
        }else{
        	PopRender.paintLinks();
        	Stage.adjustLayers();
        	EnvRender.hideFringe();
        	Stage.status = '';
        }
    }
    if(Stage.status == 'movingV'){
    	if(!EnvRender.axisY.visible){
    		EnvRender.showAxis();
    	}
        if(movingLen != 0){
        	var d = movingLen > 0 ? moveSpeed : -moveSpeed;
        	moveRotateCenter(d);
        	movingLen -= d;
        }else{
        	PopRender.paintLinks();
        	EnvRender.paintFringe();
        	Stage.adjustLayers();
        	EnvRender.hideAxis();
        	Stage.status = '';
        }
    }
    PopRender.fresh();
}

function onKeyPress(key, target){
	// console.log(key, target.tagName)
	//enter: finish enter
    if(key == 13 && Stage.status == 'onEdit'){
    	Stage.status = '';
        var text = editPanel.find('input').val();
        //update pop
        if(onEditPop){
        	if(text){
		        var pt = {t:text};
	            Model.updatePop(onEditPop, pt);   
	            PopRender.paint();
	        }else{
	        	onEditPop.opacity = 1;
	        }
        }
        //create new pop
        else{
        	if(text){
	        	var r = new Point(editPos.x,editPos.y).getDistance(rotateCenter) / galaxyRadius;
		        var v1 = new Point(editPos.x - rotateCenter.x, editPos.y - rotateCenter.y);
		        var v2 = new Point(-1, 0);
		        var angle = (v2.getDirectedAngle(v1) - degreeOffset + 360) % 360;
		        var date = new Date();
		        var pt = {t:text, r:r, d:angle, idx:date.getTime()};
	            if(onAssociatePop){
	            	Model.addPop(pt, onAssociatePop); 
	            }else{
	            	Model.addPop(pt); 
	            }    
	            PopRender.paint();
	        }
        }
        
        hideEditInput();
        onEditPop = null;
        onAssociatePop = null;
    }
    //e: start edit pop
	else if(key == 69 && Stage.status == 'PopHover'){
		onEditPop = onHoverPop;
		PopRender.mouseleavePop(onHoverPop);
		onEditPop.opacity = 0;
		editPos = new Point(onEditPop.position.x, onEditPop.position.y);
		showEditInput(editPos, onEditPop.content);
		Stage.status = 'onEdit';
    }
    //del
    else if(key == '8' && Stage.status == 'PopHover'){
    	PopRender.makeShootStar(onHoverPop);
        Model.deletePop(onHoverPop);
        PopRender.paint();
        Stage.status = '';
    }
    //s: associate
    else if(key == '83' && Stage.status == 'PopHover'){
        Stage.status = 'associate';
        onAssociatePop = onHoverPop;
        onHoverPop = null;
        PopRender.PopAssociate(onAssociatePop);
    }
    //esc
    else if(key == '27' && Stage.status == 'associate'){
        Stage.status = '';
        PopRender.finishAssociate();
    }
    else if(key == '27' && Stage.status == 'onEdit'){
        Stage.status = '';
        if(onEditPop){
        	PopRender.mouseleavePop(onEditPop);
        	onEditPop.opacity = popTextOpacity;
        }
        onEditPop = null;
        hideEditInput();
    }
    //rotate right
    else if(key == '39' && Stage.status == ''){
        Stage.status = 'rotating';
        rotatingDegree = rotateD;
    }
    //rotate right
    else if(key == '37' && Stage.status == ''){
        Stage.status = 'rotating';
        rotatingDegree = -rotateD;
    }
    //move up
    else if(key == '38' && Stage.status == ''){
       Stage.status = 'movingV';
       movingLen = moveD;
    }
    //move down
    else if(key == '40' && Stage.status == ''){
      	Stage.status = 'movingV';
       	movingLen = -moveD;
    }
    else if(target.tagName == 'INPUT'){
    	checkInput();
    	return;
    }
    updateStageText();
}

function moveRotateCenter(l){
	var y = rotateCenter.y + l;
	y = Math.min(y, galaxyRadius);
	y = Math.max(y, view.size.height);
	rotateCenter.y = y;
	PopRender.adjustRotateCenter();
	EnvRender.adjustRotateCenter();
}

function showEditInput(point, val){
	val = val || '';
    var x = point.x;
    var y = point.y;
    var w = editPanel.width();
    var h = editPanel.height();
    editPanel.css({'left':(x-w/2),'top':(y-h/2),'display':'flex'});
    editPanel.find('input').focus();
    setTimeout(function(){
    	editPanel.find('input').val(val);
    },30);
}

function hideEditInput(){
    editPanel.hide();
    editPanel.find('input').val('');
}

function updateStageText(){
	consoleText.content = consoleInfo[Stage.status] || '';
    startText.visible = Stage.status == '' && Model.pops.length == 0;
    
}

function checkInput(){
	var val = editPanel.find('input').val();
	if(val.length > textLengthLimit){
		editPanel.find('input').val(val.substring(0,textLengthLimit)); 
		consoleText.content = consoleInfo['textLenLimit'];
		setTimeout(function(){
			updateStageText();
		}, 1000);
	}
}

Stage.adjustLayers = function() {
	EnvRender.water && EnvRender.water.bringToFront();
	EnvRender.fringe && EnvRender.fringe.bringToFront();
    EnvRender.ground && EnvRender.ground.bringToFront(); 
    consoleText && consoleText.bringToFront();
    EnvRender.axisY && EnvRender.axisY.sendToBack();
    EnvRender.sky && EnvRender.sky.sendToBack();
}