function ConsoleText() {
	var  consoleText = new PointText({
        name: 'consoleText',
        content: "",
        point: [view.size.width*0.5, view.size.height - 15],
        justification: 'center',
        fontSize: 14,
        fillColor: '#ddd'
    });
    consoleText.update = _console_update;
    return consoleText;
}

function _console_update(){
	this.content = consoleInfo[Stage.status] || '';
}

//console edit
var consoleInfo = {
    'PopHover' : '[e]:edit, [s]:sub_branch, [del]:delete',
    'onEdit' : '[enter]:ok, [esc]:cancel',
    'associate': '[click]:add here,[esc]:cancel',
    'textLenLimit': 'text max length 25'
};