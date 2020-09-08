Comp.space = {
    idx: Model.S_baseSpaceIdx,
    data: null,
    map: null,
    container: null,
    group: null,
    init: _space_init,
	refresh: _space_refresh,
	getNodeByUid: _space_getNodeByUid,
    addNode: _space_addNode,
    deleteNode: _space_deleteNode,
    deleteSpace: _space_deleteSpace
}

function _space_init(){
    this.map = $('#space-map');
    this.container = $('#space');
    this.group = new Group();
    this.refresh();
}

function _space_loadData(){
    if(Comp.space.idx == Model.S_baseSpaceIdx){
        if(!Model.getNodeInList(Model.S_baseSpaceIdx)){
            Model.addNodeInList({i:Model.S_baseSpaceIdx, t: 'root'})
        }   
    }
    var data = localStorage.getItem(Model.S_nodePrefix + Comp.space.idx);
    if(data){
        Comp.space.data = JSON.parse(data);
    }else{
        Comp.space.data = [{i:Comp.space.idx}];
    }
}

function _space_refresh(){ 
    _space_loadData();
    Comp.space.map.empty();
    Comp.space.group.children.forEach(function(n){
        n.keep = false;
    })
    Comp.space.data.forEach(function(n){
        _space_paintUiNode(n, null);
    })
    
    Comp.space.group.children.forEach(function(n){
        if(!n.keep){
            n.clearNode();
        }
    })
}

function _space_paintUiNode(spaceNode, parentUiNode){
    var uiNode = Comp.space.group.children.find(function(n){
        return n.i == spaceNode.i && !n.keep;
    })
    if(!uiNode){
        var uiNode = new Group();
        Comp.space.group.addChild(uiNode);
    }
    uiNode.refreshNode(spaceNode, parentUiNode);
    uiNode.keep = true;
    
    if(spaceNode.children){
        spaceNode.children.forEach(function(childSpaceNode){
            _space_paintUiNode(childSpaceNode, uiNode);
        })
    }
}

function _space_getNodeByUid(uid){
    return Comp.space.group.children['n-'+ uid];
}

function _space_getMetaEleByUid(uid){
    return Comp.space.map.find('[uid='+ uid + ']');
}

function _space_addNode(pt, parentUid){
    var node;
    if(!pt.i){
        node = Model.addNodeInList({t:pt.t});
        pt.i = node.i;
    }else{
        node = Model.getNodeInList(pt.i);
    }

    var parentUiNode = parentUid ? _space_getNodeByUid(parentUid) : null;
    _space_paintUiNode(pt, parentUiNode);
    _space_updateData();
    //update node ref
    node.ref = node.ref || [];
    node.ref.push(Comp.space.data.i);
    node.nRef = node.nRef + 1;
    Model.saveNodeList();
    Pylon.refreshView('list');
}

function _space_deleteNode(uid){
    var ele = Comp.space.map.find('.node[uid="' + uid + '"]');
    ele.children('.node').each(function(){
        _space_deleteNode($(this).attr('uid'));
    })
    var i = ele.attr('i');
    var node = Model.getNodeInList(i);

    //update space node
    Comp.space.getNodeByUid(uid).clearNode();
    ele.remove();
    _space_updateData();
    //update node ref
    node.nRef -= 1;
    if(Comp.space.map.find('.node[i="' + i + '"]').length == 0){
        node.ref = _.filter(node.ref, function(r){
            return r != Comp.space.data.i;
        })
        if(node.ref.length == 0){
            Model.deleteNodeInList(node);
        }else{
            Model.saveNodeList();
        }
    }

    Pylon.refreshView('list');
}

function _space_deleteSpace(i){
    //remove ref in to-delete node space
    var spaceNode = JSON.parse(localStorage.getItem(Model.S_nodePrefix + i));
    if(spaceNode){
        __deleteNodeRefInSpace(spaceNode, i);
        localStorage.removeItem(Model.S_nodePrefix + i);
    }

    function __deleteNodeRefInSpace(spaceNode, deletingNodeIdx){
        if(!spaceNode.children){
            return;
        }
        spaceNode.children.forEach(function(n){
            var listNode = Model.getNodeInList(n.i);
            if(listNode){
                listNode.nRef -= 1;
                listNode.ref = _.filter(listNode.ref, function(r){
                    return r != deletingNodeIdx;
                })
                Model.saveNodeList();
            }
            __deleteNodeRefInSpace(n, deletingNodeIdx);
            if(listNode.ref.length == 0){
                Model.deleteNodeInList(listNode);
            }
        })
    }
}

function _space_updateData(){
    __updateSpaceData();
    function __updateSpaceData(parentNode, parentEle){

        var root = parentNode == null;
        parentNode = parentNode || [];
        parentEle = parentEle || Comp.space.map;
        if(!root){
            parentNode.children = [];
        }
        parentEle.children('.node').each(function(){
            var n = {
                i: $(this).attr('i'),
                x: $(this).attr('x'),
                y: $(this).attr('y')
            }
            if(root){
                parentNode.push(n);
            }else{
                parentNode.children.push(n);
            }
            __updateSpaceData(n, $(this))
        })
        if(root){
            var listNode = Model.getNodeInList(Comp.space.idx);
            listNode.empty = parentNode.length == 0;
            if(!listNode.empty){
                localStorage.setItem(Model.S_nodePrefix + Comp.space.idx, JSON.stringify(parentNode));
            }else{
                localStorage.removeItem(Model.S_nodePrefix + Comp.space.idx);
            }   
            Model.saveNodeList();
        }
    }
}