var FrontPaper = null;
var BackPaper = null;
var MiddleLayer = null;
var Stage = {
    middleLayer: null,
    rotateCenter: null,
    degreeOffset: 0,
    galaxyRadius: 2000,
    groundAngle: 15,
    status: '',
    items: [],
    init: _stg_init,
    onFrame: _stg_onFrame,
    setStatus: _stg_setStatus,
    adjustLayers:_stg_adjustLayers,
    moveCenterToPop: _stg_moveCenterToPop
};

function _stg_init() {
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();

    $('#back-canvas').attr('height', windowHeight).attr('width', windowWidth);
    BackPaper = new paper.PaperScope();
    BackPaper.setup($("#back-canvas")[0]);

    $('#front-canvas').attr('height', windowHeight).attr('width', windowWidth);
    FrontPaper = new paper.PaperScope();
    FrontPaper.setup($("#front-canvas")[0]);
    FrontPaper.install(window);

    MiddleLayer = $('#middle-layer').css('height', windowHeight+ 'px').css('width', windowWidth + 'px');

    itemProtoTypeInject();
    popProtoTypeInject();

    var params = _stg_loadParams();
    var rotateCenterH = params.rotateCenterY ? parseFloat(params.rotateCenterY) : 1.8;
    this.rotateCenter = new Point(view.size.width * 0.5, view.size.height * rotateCenterH);
    Stage.degreeOffset = params.degreeOffset ? parseFloat(params.degreeOffset) : 0;
    halfWidth = view.size.width * 0.5;

    this.console = MyConsole();
    this.items.push(this.console);
    this.console.info('data loaded.');
    this.console.info('location used.');

    this.popConsole = PopConsole();
    this.inputPanel = InputPanel();
    this.textBox = TextBox();

    this.ground = Ground();
    this.items.push(this.ground);
    this.sky = Sky();
    this.items.push(this.sky);
    this.meteor = Meteor();
    this.items.push(this.meteor);
    this.mouseTracker = MouseTracker();
    this.items.push(this.mouseTracker);
    this.optionCircle = OptionCircle();
    this.items.push(this.optionCircle);
    Pops.paint();
    this.items.push(Pops);
    this.guide = Guide();
    this.items.push(this.guide);
    this.console.info('content paint.');
    this.console.info('ready.');
}

function _stg_onFrame(){
    if(rotatingDegree != 0){
        var step = Math.min(Math.abs(rotatingDegree), rotateSpeed);
        var d = rotatingDegree > 0 ? step : -step;
        Pops.rotate(d);
        Stage.degreeOffset += d;
        Stage.degreeOffset = (360 + Stage.degreeOffset) % 360;
        rotatingDegree -=  d;
        Stage.guide.updateDegreeIndex();
        if(rotatingDegree == 0){
            Stage.guide.updateDots();
            Pops.updatePopLink();
            Stage.adjustLayers();
            _stg_saveParams();
        }
    }
    if(movingLen != 0){
        var step = Math.min(Math.abs(movingLen), moveSpeed);
        var d = movingLen > 0 ? step : -step;
        var y = Stage.rotateCenter.y + d;
        y = Math.min(y, Stage.galaxyRadius);
        y = Math.max(y, view.size.height);
        Stage.rotateCenter.y = y;
        Pops.adjustRotateCenter();
        Stage.sky.update();
        Stage.guide.updateHeightIndex();
        movingLen -= d;
        if(movingLen == 0){
            Stage.guide.updateDots();
            Pops.updatePopLink();
            Stage.adjustLayers();
            _stg_saveParams();
        }
    }
}

function _stg_setStatus(status){
    this.status = status;
    this.console.infoStatus(status);
    if(this.status == '' || this.status == 'onEdit'){
        Stage.optionCircle.hide();
    }
}

function _stg_adjustLayers() { 
    // this.optionCircle && this.optionCircle.bringToFront();
    this.ground && this.ground.bringToFront();
    this.guide && this.guide.bringToFront();
    this.console && this.console.bringToFront();
}

function _stg_moveCenterToPop(idx){
    var pop = Pops.getPopByIndex(idx);
    _stg_moveCenterTo({x:pop.pos.x, y:pop.pos.y + 60})
}

function _stg_moveCenterTo(targetPoint){
    var v1 = new Point(targetPoint.x - Stage.rotateCenter.x, targetPoint.y - Stage.rotateCenter.y);
    var v2 = new Point(0, -1);
    var angle = v1.getDirectedAngle(v2);
    rotatingDegree = angle;
    var point = new Point(targetPoint.x, targetPoint.y);
    point = point.rotate(angle, Stage.rotateCenter);
    var y = point.y - view.size.height * 0.5;
    movingLen = -y;
}

var _stg_storageName = 'stageParams';

function _stg_saveParams(){
    var params = {
        rotateCenterY: Stage.rotateCenter.y / view.size.height,
        degreeOffset: Stage.degreeOffset
    }
    localStorage.setItem(_stg_storageName,JSON.stringify(params))
}

function _stg_loadParams(){
    return JSON.parse(localStorage.getItem(_stg_storageName)) || {}; 
}

