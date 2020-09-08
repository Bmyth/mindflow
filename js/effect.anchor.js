Effect.anchor = _effect_anchor;

var _effect_anchor_ele = null;
function _effect_anchor(pos, status){
	pos = Comp.map.fitBlockPos(pos);
	if(status == 'start'){
		if(!_effect_anchor_ele){
			_effect_anchor_ele = new PointText(new Point(0, 0));
			_effect_anchor_ele.fillColor = Theme.themeColor1;
			_effect_anchor_ele.content = 'X';
		}
		_effect_anchor_ele.position.x = pos.x;
		_effect_anchor_ele.position.y = pos.y;
		_effect_anchor_ele.visible = true;
	}else if(status == 'end'){
		_effect_anchor_ele.visible = false;
	}
}