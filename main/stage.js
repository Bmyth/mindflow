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
    adjustLayers:_stg_adjustLayers,
    rotateToPop: _stg_rotateToPop,
    adjustAccordingMouse: _stg_adjustAccordingMouse,
    saveParams: _stg_saveParams
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
    this.rotateCenter = new Point(0, view.size.height * 0.5);
    this.galaxyRadius = view.size.width;
    this.degreeOffset = params.degreeOffset ? parseFloat(params.degreeOffset) : 0;
    halfWidth = view.size.width * 0.5;
    halfHeight = view.size.height * 0.5;

    this.hint = Hint();
    this.inputPanel = InputPanel();
    this.textPanel = TextPanel();
    this.sky = Sky();
    this.orbits = Orbits();
    this.meteor = Meteor();
    this.mouseTracker = MouseTracker();
    this.optionCircle = OptionCircle();
    this.colorPicker = ColorPicker();
    Pops.paint();
    this.guide = Guide();

    if(params.trackRoot && params.trackRoot.idx){
        var pt = Model.getModelByRidx(params.trackRoot.ridx);
        if(pt && pt.idx == params.trackRoot.idx){
            ViewController.executeOption(params.trackRoot.ridx, 'trackRootNode');
        }
    }
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
        var autoRotateSpeed = 0.002;
        _stg_rotate(autoRotateSpeed);
    }
}

function _stg_rotate(d){
    Stage.optionCircle.hide();
    Pops.rotate(d);
    Stage.degreeOffset += d;
    Stage.degreeOffset = (360 + Stage.degreeOffset) % 360;
    Stage.guide.updateDegreeIndex();
}

function _stg_adjustLayers() { 
    this.colorPicker && this.colorPicker.bringToFront(); 
    // this.orbits && this.orbits.sendToBack();
}

_stg_mousePosAdjust_limit = 0.85;
_stg_mousePosAdjust_degree = 1.5;
function _stg_adjustAccordingMouse(point) {
    if(rotatingDegree == 0){
        var y = Math.abs(point.y - halfHeight) / halfHeight;
        if(y > _stg_mousePosAdjust_limit){
            if(point.y > halfHeight){
                rotatingDegree = -_stg_mousePosAdjust_degree;
            }else{
                rotatingDegree = _stg_mousePosAdjust_degree;
            }
        }
    }
}

function _stg_rotateToPop(idx){
    var pop = Pops.getPopByIndex(idx);
    if(pop){
        _stg_moveCenterTo({x:pop.pos.x, y:pop.pos.y})
    }else{
        Model.disconnectPop(onHoverPop.idx);
        onHoverPop.updatePopModel();
    }
}

function _stg_moveCenterTo(targetPoint){
    var v1 = new Point(targetPoint.x - Stage.rotateCenter.x, targetPoint.y - Stage.rotateCenter.y);
    var v2 = new Point(1, 0);
    var angle = v1.getDirectedAngle(v2);
    rotatingDegree = angle;
}

var _stg_storageName = 'stageParams';

function _stg_saveParams(){
    var trackRoot = null;
    if(onTrackRootPop){
        trackRoot = {
            ridx: onTrackRootPop.ridx,
            idx: onTrackRootPop.idx
        }
    }
    var params = {
        trackRoot: trackRoot,
        degreeOffset: Stage.degreeOffset
    }
    localStorage.setItem(_stg_storageName,JSON.stringify(params))
}

function _stg_loadParams(){
    return JSON.parse(localStorage.getItem(_stg_storageName)) || {}; 
}

