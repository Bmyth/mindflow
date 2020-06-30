function Hint() {
    var hint = new Group();
    var text = new PointText({
        content: "",
        justification: 'left',
        fontSize: 12,
        fillColor: theme.fontColor
    });
    text.name = 'text';
    hint.addChild(text);

    var line = new Path.Line({
        from: [0, 0],
        to: [0, 0],
        strokeColor: theme.fontColor,
        strokeWidth: 1,
        dashArray: [5,5],
        opacity: 0
    });
    line.name = 'line';
    hint.addChild(line);

    hint.info = _hint_info;
    hint.infoCase = _hint_infoCase;
    hint.infoClear = _hint_infoClear;
    return hint;
}

function _hint_info(text){
    this.texts.push(text);
    this.paint();
}

function _hint_infoCase(status){
    if(!status){
        this.infoClear();
    }
    var text = _console_definedText[status];
    if(text){
        this.info(text);
    }
}

function _hint_infoClear(){
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