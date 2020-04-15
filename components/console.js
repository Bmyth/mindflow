function MyConsole() {
    var myConsole = new Group();
    myConsole.texts = [];
    myConsole.waitingTexts = [];
    myConsole.info = _console_info;
    myConsole.infoStatus = _console_infoStatus;
    myConsole.infoClear = _console_infoClear;
    myConsole.checkWaitingTexts = _console_checkWaitingTexts;
    myConsole.paint = _console_paint;

    var groundRadius = halfWidth / Math.sin(angleD2R * Stage.groundAngle);
    var groupdTop = halfWidth / Math.tan(angleD2R * Stage.groundAngle);
    myConsole.h = view.size.height - (groundRadius - groupdTop) * 0.5;
    myConsole.info('console init.');
    setInterval(function(){
        myConsole.checkWaitingTexts();
    }, 200);
    return myConsole;
}

function _console_info(text){
    this.waitingTexts.push(text);
}

var _console_lineNum = 1;
function _console_checkWaitingTexts(){
    var _this = this;
    if(this.waitingTexts.length == 0){
        return;
    }

    var text = this.waitingTexts.shift();

    var length = this.texts.length;
    if(this.texts[length - 1] &&  text == this.texts[length - 1]){
        return;
    }

    if(this.texts.length == _console_lineNum){
        this.texts.splice(0, 1);
    }

    this.texts.push(text);
    this.paint();
}

function _console_infoStatus(status){
    if(!status){
        this.infoClear();
    }
    var text = _console_definedText[status];
    if(text){
        this.info(text);
    }
}

function _console_paint(){
    var _this = this;
    this.removeChildren();
    var i = 0;
    this.texts.forEach(function(t){
        var h = _this.h;
        var text = new PointText({
            content: t,
            point: [view.size.width*0.5, h],
            justification: 'center',
            fontSize: 12,
            fillColor: '#ddd'
        });
        _this.addChild(text);
        i++;
    })
}

function _console_infoClear(){
    this.texts.pop();
    this.paint();
}

//console edit
var _console_definedText = {
    'PopHover' : 'Options: [E]dit, [S]branch, [C]onnect, [T]Append text, [Y]Style, [del]ete',
    'onEdit' : '[Enter]:OK, [Esc]:cancel',
    'onBranchEdit' : '[Enter]:OK, [Esc]:cancel',
    'onBranchNodePick': 'Start branch [Click]:add,[Esc]:cancel',
    'onConnectNodePick': 'Start connect [Click node]:connect,[Esc]:cancel',
    'textLenLimit': 'text max length ' + textLengthLimit
};