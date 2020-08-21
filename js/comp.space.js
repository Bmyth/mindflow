Comp.space = {
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
    var i = Model.path[Model.path.length - 1];
    var data = localStorage.getItem(Model.S_nodePrefix + i);
    if(data){
        Comp.space.data = JSON.parse(data);
    }else{
        Comp.space.data = {
            i: i,
            children: []
        };
    }
}

function _space_refresh(){ 
    _space_loadData();
    Comp.space.map.empty();
    Comp.space.group.children.forEach(function(n){
        n.keep = false;
    })

    _space_paintUiNode(Comp.space.data, null);

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

    parentUid = parentUid || _space_topUid();

    var parentUiNode = _space_getNodeByUid(parentUid);
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
    if(uid != _space_topUid()){
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
    }else{
        //back
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
        parentNode = parentNode || Comp.space.data;
        parentEle = parentEle || Comp.space.map.children('.node');
        parentNode.children = [];
        if(parentEle.children('.node').length > 0){
            parentEle.children('.node').each(function(){
                var n = {
                    i: $(this).attr('i'),
                    x: $(this).attr('x'),
                    y: $(this).attr('y')
                }
                parentNode.children.push(n);
                __updateSpaceData(n, $(this))
            })
        }
        if(root){
            if(Comp.space.data.children.length > 0){
                localStorage.setItem(Model.S_nodePrefix + Comp.space.data.i, JSON.stringify(Comp.space.data));
            }else{
                localStorage.removeItem(Model.S_nodePrefix + Comp.space.data.i);
            }   
        }
    }
}

function _space_topUid(){
    return Comp.space.map.children('.node').attr('uid');
}