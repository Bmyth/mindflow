var Stage = {
    status: '',
    items: [],
    init: _stg_init,
    onFrame: _stg_onFrame,
    setStatus: _stg_setStatus,
    adjustLayers:_stg_adjustLayers,
    moveCenterToPop: _stg_moveCenterToPop
};

function _stg_init() {
	paper.install(window);
	$('#myCanvas').attr('height', $('body').height()).attr('width', $('body').width());
    paper.setup('myCanvas');

    itemProtoTypeInject();
    popProtoTypeInject();

    rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    console.log(groundPostion)
    skyHeight = view.size.height - groundPostion;
    halfWidth = view.size.width * 0.5;

    this.popConsole = PopConsole();
    this.items.push(this.popConsole);
    this.map = MapInit();
    this.items.push(this.map);
    this.inputPanel = InputPanel();
    this.items.push(this.inputPanel);
    this.headingText = HeadingText();
    this.items.push(this.headingText);
    this.consoleText = ConsoleText();
    this.items.push(this.consoleText);
    this.ground = Ground();
    this.items.push(this.ground);
    this.sky = Sky();
    this.items.push(this.sky);
    this.meteor = Meteor();
    this.items.push(this.meteor);
    this.associateLink = AssociateLink();
    this.items.push(this.associateLink);
    this.items.push(Pops);
    Pops.paint();
    _stg_updateText();
}

function _stg_onFrame(){
    if(rotatingDegree != 0){
        var step = Math.min(Math.abs(rotatingDegree), rotateSpeed);
        var d = rotatingDegree > 0 ? step : -step;
        Pops.rotate(d);
        degreeOffset += d;
        rotatingDegree -=  d;
        if(rotatingDegree == 0){
            Pops.updatePopLink();
            Stage.adjustLayers();
            Stage.map.paint();
            Stage.setStatus('');
        }
    }
    if(movingLen != 0){
        var step = Math.min(Math.abs(movingLen), moveSpeed);
        var d = movingLen > 0 ? step : -step;
        var y = rotateCenter.y + d;
        y = Math.min(y, galaxyRadius);
        y = Math.max(y, view.size.height);
        rotateCenter.y = y;
        Pops.adjustRotateCenter();
        movingLen -= d;
        if(movingLen == 0){
            Pops.updatePopLink();
            Stage.adjustLayers();
            Stage.map.paint();
            Stage.setStatus('');
        }
    }
    if(Stage.meteor.active){
        Stage.meteor.falling();
    }
}

function _stg_setStatus(status){
    this.status = status;
    _stg_updateText();
}

function _stg_updateText(){
    Stage.consoleText.update();
    Stage.headingText.visible = Stage.status == '' && Model.pops.length == 0;
}

function _stg_adjustLayers() { 
    this.ground && this.ground.bringToFront();
    this.map && this.map.bringToFront();
    this.consoleText && this.consoleText.bringToFront();
    this.sky && this.sky.sendToBack();
}

function _stg_moveCenterToPop(idx){
    var pop = Pops.getPopByIndex(idx);
    var popCenter = pop.children['popCenter'];
    _stg_moveCenterTo(popCenter.position)
}

function _stg_moveCenterTo(targetPoint){
    var v1 = new Point(targetPoint.x - rotateCenter.x, targetPoint.y - rotateCenter.y);
    var v2 = new Point(0, -1);
    var angle = v1.getDirectedAngle(v2);
    rotatingDegree = angle;
    var point = new Point(targetPoint.x, targetPoint.y);
    point = point.rotate(angle, rotateCenter);
    var y = point.y - view.size.height * 0.5;
    movingLen = -y;
}

