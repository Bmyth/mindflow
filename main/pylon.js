var Pylon = {
    init: _render_init,
    refresh: _render_refresh
}

var Comp = {};

var boardWidth = 0.85;
var timeCount = 0;
var timeSecondCount = 0;
var timeMinuteCount = 0;

function _render_init(){
    $("#front-canvas").css({
        width: windowWidth,
        height: windowHeight
    })
    var FrontPaper = new paper.PaperScope();
    FrontPaper.setup($("#front-canvas")[0]);
    FrontPaper.install(window);

    itemProtoTypeInject();
    popProtoTypeInject();
    cubeProtoTypeInject();

    view.onFrame = _render_onFrame;

    Comp.board = Board();
    Comp.cubes = Cubes();
    Comp.liquid = Liquid();
    Comp.newBtn = $('.new-cube');
    Comp.inputPanel = InputPanel();
    Comp.meteor = Meteor();
    Comp.mouseTracker = MouseTracker();
    Comp.optionCircle = OptionCircle();

    this.refresh();
}

function _render_refresh(){
    Comp.board.refresh();
    Comp.cubes.refresh();
}

function _render_onFrame(){
    timeCount += 1;
    if(timeCount == 60){
        timeCount = 0;
        timeSecondCount += 1;
        if(timeSecondCount == 60){
            timeSecondCount = 0;
            timeMinuteCount += 1;
        }
    }
}



