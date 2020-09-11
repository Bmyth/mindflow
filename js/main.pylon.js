var Pylon = {
    status: 'NORMAL',
    node: null,
    anchor: null,
    init: _pylon_init,
    executeOption: _pylon_executeOption,
    setStatus: _pylon_setStatus,
    refreshView: _pylon_refreshView
}

var Comp = {}, Effect = {};

var timeCount = 0;
var timeSecondCount = 0;
var timeMinuteCount = 0;

function _pylon_init(){
    //init canvas
    $("#front-canvas").css({
        width: windowWidth,
        height: windowHeight
    })
    var FrontPaper = new paper.PaperScope();
    FrontPaper.setup($("#canvas")[0]);
    FrontPaper.install(window);

    itemProtoTypeInject();
    nodeProtoTypeInject();

    //init comp
    Comp.map.init();
    Comp.space.init();
    Comp.entry.init();
    Comp.list.init();
    Comp.options.init();

    //init event
    window.onkeydown = _pylon_keyPress;
    view.onMouseDown = _pylon_mouseDown;
    $(document).mousemove(_.throttle(function(e){
        _pylon_mouseMove(e);
    }, 100));
}

function _pylon_keyPress(event){
    var e  = event  ||  window.e;          
　　 var key = e.keyCode || e.which;
    if(event.target.tagName != 'BODY'){
        return;
    }
    console.log('press key:' + key);
    //enter: pass to entry enter
    if(key == 13 && Comp.entry.on){
        Comp.entry.enter();
    }
    //e: start edit pop
    if(key == 69 && Pylon.status == 'NODE_ON_HOVER'){
        _pylon_optionEdit(Pylon.node);
    }
    //del
    else if(key == '8' && Pylon.status == 'NODE_ON_HOVER'){
        _pylon_optionDelete(Pylon.node);
    }
    //s: branch
    else if(key == '83' && !event.ctrlKey && Pylon.status == 'NODE_ON_HOVER'){
        _pylon_optionBranch();
    }
    //crtl+s: branch
    else if(key == '83' && event.ctrlKey){
        _pylon_pickSpace();
    }
    //esc: reset to normal
    else if(key == '27'){
        _pylon_reset();
    }
}

function _pylon_executeOption(obj, option, param){
    if(option == 'pickSpace'){
        _pylon_pickSpace();
    }
    if(option == 'openSpace'){
        _pylon_openSpace(obj);
    }
    if(option == 'edit'){
        _vc_optionEdit(obj);
    }
    if(option == 'branch'){
        _pylon_optionBranch(obj, param);
    }
    if(option == 'cancelEdit'){
        _pylon_cancelEdit();
    }
    if(option == 'delete'){
        _pylon_optionDelete(obj);
    }
    if(option == 'hoverNode'){
        _pylon_hoverNode(obj);
    }
    if(option == 'unHoverNode'){
        _pylon_unHoverNode(obj);
    }
    if(option == 'reset'){
        _pylon_reset();
    }
}

function _pylon_pickSpace(){
    _pylon_setStatus('PICK_SPACE');
    Comp.entry.show();  
}

function _pylon_openSpace(i){
    Comp.space.open(i);
    _pylon_setStatus('NORMAL'); 
    Pylon.refreshView('list');
}

function _pylon_optionEdit(node){
    Comp.entry.show({editNode: node});
    _pylon_setStatus('NODE_ON_EDIT');
}

function _pylon_optionDelete(node){
    node.mouseLeave();
    Comp.space.deleteNode(node.uid);
    _pylon_setStatus('NORMAL');
}

function _pylon_optionBranch(position){
    _pylon_setStatus('NODE_ON_BRANCH');
    Pylon.node.mouseLeave();
    Effect.branch({node:Pylon.node, position:position}, 'start');
}

function _pylon_hoverNode(node){
    _pylon_setStatus('NODE_ON_HOVER');
    Pylon.node = node;
}

function _pylon_unHoverNode(){
    if(Pylon.status == 'NODE_ON_HOVER'){
        _pylon_setStatus('NORMAL');
    }
}

function _pylon_reset(){
    _pylon_setStatus('NORMAL');
    Effect.anchor(0, 'end');
    Effect.branch(0, 'end');
    Comp.entry.hide();
    Pylon.node && Pylon.node.mouseLeave();
}

function _pylon_setStatus(status){
    Pylon.status = status;
    Comp.options.refresh();
}

function _pylon_mouseDown(event){
    Comp.entry.hide();
    if(event.target.name != 'mask'){
        // if(!Comp.map.testHitPos(event.point)){
        //     return;
        // } 
        Pylon.anchor = {x:event.point.x, y:event.point.y}
        if(Pylon.status == 'NORMAL'){
            _pylon_setStatus('NODE_ON_CREATE');
            Comp.entry.show();
            Effect.anchor(Pylon.anchor, 'start');
        }else if(Pylon.status == 'NODE_ON_BRANCH'){
            _pylon_setStatus('NODE_ON_CREATE_BRANCH');
            Comp.entry.show();
            Effect.anchor(Pylon.anchor, 'start');
            Effect.branch(0, 'end');
        }
    }
}

function _pylon_mouseMove(event){
    if(event.srcElement.id == 'canvas' && Pylon.status == 'NODE_ON_BRANCH'){
        Effect.branch({x:event.offsetX, y:event.offsetY}, 'update');
    }
}

function _pylon_refreshView(partial){
    if(partial.indexOf('space') >= 0 || partial == 'all'){
        Comp.space && Comp.space.refresh();
    }
    if(partial.indexOf('list') >= 0 || partial == 'all'){
        Comp.list && Comp.list.refresh();
    }
    if(partial.indexOf('options') >= 0 || partial == 'all'){
        Comp.options && Comp.options.refresh();
    }
}


