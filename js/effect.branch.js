Effect.branch = _effect_branch;

_effect_branch_group = null;
function _effect_branch(params, status){
	if(!_effect_branch_group){
		_effect_branch_group  = new Group();
	}
	if(status == 'start'){
		var node = params.node;
		var position = params.position;
		_effect_branch_group.startPos = node.pos;
	    var endPoint = new Path.Circle({
	        center: [0,0],
	        radius: 25,
	        strokeColor: Theme.themeColor1,
	        strokeWidth: 1.5,
	        dashArray: [6,6]
	    });;
		endPoint.position.x = position ? position.x : node.pos.x;
		endPoint.position.y = position ? position.y : node.pos.y;
		endPoint.name = 'endPoint';
		_effect_branch_group.addChild(endPoint);

	    var link = new Path.Line({
		    from: [0, 0],
		    to: [0, 0],
		    strokeColor: Theme.themeColor1,
		    strokeWidth: 1,
		    dashArray: [5,5]
		});
		link.name = 'link';
		link.updateLinkPos(_effect_branch_group.startPos, endPoint.position);
	    _effect_branch_group.addChild(link);
	    Effect.highlightNodeText({node:node, type:'hover'}, 'end');
	    Effect.highlightNodeText({node:node, type:'branch'}, 'start');
	}
	else if(status == 'update'){
		var position = params.position || params;
		var p = new Point(_effect_branch_group.startPos.x, _effect_branch_group.startPos.y);
		var d = p.getDistance(position);

		var v = new Point(position.x - p.x, position.y - p.y);
		v = v.normalize(d);
		p = new Point(_effect_branch_group.startPos.x + v.x, _effect_branch_group.startPos.y + v.y);

	    var endPoint = _effect_branch_group.children['endPoint'];
		endPoint.position.x = p.x;
		endPoint.position.y = p.y;
	    _effect_branch_group.children['link'].updateLinkPos(_effect_branch_group.startPos, p)
	}else if(status == 'end'){
		_effect_branch_group.removeChildren();
		Pylon.node && Effect.highlightNodeText({node:Pylon.node, type:'branch'}, 'end');
	}
}