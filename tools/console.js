function MyConsole() {
    var myConsole = {};
    myConsole.ele = $('.console');
    myConsole.texts = [];
    myConsole.info = _console_info;
    myConsole.infoStatus = _console_infoStatus;
    myConsole.infoClear = _console_infoClear;
    myConsole.paint = _console_paint;

    var groundRadius = halfWidth / Math.sin(angleD2R * Stage.groundAngle);
    var groupdTop = halfWidth / Math.tan(angleD2R * Stage.groundAngle);
    var h = (groundRadius - groupdTop);
    myConsole.h = Math.min(60, h * 0.5);

    myConsole.ele.css({'height': myConsole.h + 'px', 'bottom': (h * 0.5 - myConsole.h * 0.5)  + 'px'});
    return myConsole;
}

function _console_info(text){
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

_console_hold = false;
function _console_paint(){
    if(_console_hold){
        return;
    }
    var _this = this;
    if(this.texts.length > 0){
        var c = this.ele.find('.console-content');
        if(c.length > 0){
            _console_hold = true;
            c.animate({'marginTop': -c.height() + 'px'}, 800, function(){
                c.remove();
                 _console_hold = false;
                var text = _this.texts.shift();
                if(text){
                    $(generateHtml(text)).appendTo(_this.ele);
                }
                _this.paint();
            })
        }else{
            var text = this.texts.shift();
            $(generateHtml(text)).appendTo(_this.ele);
            _this.paint();
        }
    }
}

function _console_infoClear(){
    this.texts = [];
    this.ele.empty();
}

function generateHtml(t){
    t = t.replace(/\[/g, '<span>');
    t = t.replace(/\]/g, '</span>');
    t = t.replace(/\{/g, '<div class="console-item">');
    t = t.replace(/\}/g, '</div>');
    if(t.indexOf('<console-item>') < 0){
        t = '<p>' + t + '</p>';
    }
    return '<div class="console-content">' + t + '</div>';
}

//console edit
var _console_definedText = {
    'PopHover' : '{[E]dit}{[S]branch}{[C]onnect}{[T]Append text}{[del]ete}',
    'onEdit' : '{[Enter]Ok}{[Esc]Cancel}',
    'onBranchEdit' : '{[Enter]OK}{[Esc]Cancel}',
    'onBranchNodePick': 'Create branch {[Click]Add}{[Esc]Cancel}',
    'onConnectNodePick': 'Connect node {[Pick]Connect}{[Esc]Cancel}',
    'textLenLimit': '{text max length:' + textLengthLimit + '}'
};