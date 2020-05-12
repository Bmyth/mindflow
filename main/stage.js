var FrontPaper = null;
var BackPaper = null;
var Stage = {
    rotating: true,
    rotateCenter: null,
    degreeOffset: 0,
    galaxyRadius: 2000,
    groundAngle: 10,
    status: '',
    items: [],
    init: _stg_init,
    onFrame: _stg_onFrame,
    setStatus: _stg_setStatus,
    adjustLayers:_stg_adjustLayers,
    rotateToPop: _stg_rotateToPop
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
    console.log('Paper start');

    this.middleLayer = $('#middle-layer').css('height', windowHeight+ 'px').css('width', windowWidth + 'px');
    this.popContainer = $('<div class="pop-container"></div>').appendTo(this.middleLayer).css({
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });

    itemProtoTypeInject();
    popProtoTypeInject();

    var params = _stg_loadParams();
    var heightPosition = params.heightPosition ? parseFloat(params.heightPosition) : 0.5;
    this.rotateCenter = new Point(0, view.size.height * 0.5);
    this.galaxyRadius = view.size.width;
    this.degreeOffset = params.degreeOffset ? parseFloat(params.degreeOffset) : 0;
    halfWidth = view.size.width * 0.5;
    halfHeight = view.size.height * 0.5;

    this.console = MyConsole();
    this.popIndex = PopIndex();
    this.inputPanel = InputPanel();
    this.textPanel = TextPanel();
    this.sky = Sky();
    this.orbits = Orbits();
    this.meteor = Meteor();
    this.mouseTracker = MouseTracker();
    this.optionCircle = OptionCircle();
    Pops.paint();
    this.guide = Guide();
    this.setStatus('rotating');
    this.console.info('ready.');
}

function _stg_onFrame(){
    if(rotatingDegree != 0){
        var step = Math.min(Math.abs(rotatingDegree), rotateSpeed);
        var d = rotatingDegree > 0 ? step : -step;
        _stg_rotate(d);
        rotatingDegree -=  d;
        if(rotatingDegree == 0){
            Pops.updatePopLink();
            Stage.adjustLayers();
            _stg_saveParams();
        }
    }else if(Stage.rotating){
        var autoRotateSpeed = 0.01;
        _stg_rotate(autoRotateSpeed);
    }
}

function _stg_rotate(d){
    Pops.rotate(d);
    Stage.degreeOffset += d;
    Stage.degreeOffset = (360 + Stage.degreeOffset) % 360;
    Stage.guide.updateDegreeIndex();
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
    // this.guide && this.guide.bringToFront();
    // this.orbits && this.orbits.sendToBack();
}

function _stg_rotateToPop(idx){
    var pop = Pops.getPopByIndex(idx);
    if(pop){
        _stg_moveCenterTo({x:pop.pos.x, y:pop.pos.y})
    }else{
        Model.disconnectPop(onHoverPop.idx);
        onHoverPop.updatePopModel();
        Stage.console.info('connected node not found');
    }
}

function _stg_moveCenterTo(targetPoint){
    var v1 = new Point(targetPoint.x - Stage.rotateCenter.x, targetPoint.y - Stage.rotateCenter.y);
    var v2 = new Point(1, 0);
    var angle = v1.getDirectedAngle(v2);
    rotatingDegree = angle;
    // var point = new Point(targetPoint.x, targetPoint.y);
    // point = point.rotate(angle, Stage.rotateCenter);
    // var y = point.y - view.size.height * 0.5;
    // movingLen = -y;
}

var _stg_storageName = 'stageParams';

function _stg_saveParams(){
    var heightPosition = (Stage.rotateCenter.y - view.size.height * 0.5) / Stage.galaxyRadius;
    var params = {
        heightPosition: heightPosition,
        degreeOffset: Stage.degreeOffset
    }
    localStorage.setItem(_stg_storageName,JSON.stringify(params))
}

function _stg_loadParams(){
    return JSON.parse(localStorage.getItem(_stg_storageName)) || {}; 
}

