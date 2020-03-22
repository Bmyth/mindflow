var headingText = null;
var consoleText = null;
var inputPanel = null;
var Pops = null;
var ground = null;
var sky = null;
var map = null;

var Stage = {
    status: '',
    items: [],
    init: _stg_init,
    onFrame: _stg_onFrame,
    setStatus: _stg_setStatus,
    adjustLayers:_stg_adjustLayers
};

function _stg_init() {
	paper.install(window);
	$('#myCanvas').attr('height', $('body').height()).attr('width', $('body').width());
    paper.setup('myCanvas');

    itemProtoTypeInject();
    popProtoTypeInject();

    rotateCenter = new Point(view.size.width * 0.5, view.size.height * 1.8);
    skyHeight = view.size.height - groundPostion;
    halfWidth = view.size.width * 0.5;

    Pops = PopsInit();
    Pops.paint();
    this.items.push(Pops);
    map = MapInit();
    this.items.push(map);
    inputPanel = InputPanel();
    this.items.push(inputPanel);
    headingText = HeadingText();
    this.items.push(headingText);
    consoleText = ConsoleText();
    this.items.push(consoleText);
    ground = Ground();
    this.items.push(ground);
    sky = Sky();
    this.items.push(sky);
    _stg_updateText();
}

function _stg_onFrame(){
    if(Stage.status == 'rotating'){
        if(rotatingDegree != 0){
            var d = rotatingDegree > 0 ? rotateSpeed : -rotateSpeed;
            Pops.rotate(d);
            degreeOffset += d;
            rotatingDegree -=  d;
        }else{
            Pops.updatePopLink();
            Stage.adjustLayers();
            map.paint();
            Stage.setStatus('');
        }
    }
    if(Stage.status == 'movingV'){
        if(movingLen != 0){
            var d = movingLen > 0 ? moveSpeed : -moveSpeed;
            var y = rotateCenter.y + d;
            y = Math.min(y, galaxyRadius);
            y = Math.max(y, view.size.height);
            rotateCenter.y = y;
            Pops.adjustRotateCenter();
            movingLen -= d;
        }else{
            Pops.updatePopLink();
            Stage.adjustLayers();
            map.paint();
            Stage.setStatus('');
        }
    }
    if(Pops.meteor.active){
        Pops.meteor.falling();
    }
}

function _stg_setStatus(status){
    this.status = status;
    _stg_updateText();
}

function _stg_updateText(){
    consoleText.update();
    headingText.visible = Stage.status == '' && Model.pops.length == 0;
}

function _stg_adjustLayers() { 
    ground && ground.bringToFront();
    map && map.bringToFront();
    consoleText && consoleText.bringToFront();
    sky && sky.sendToBack();
}