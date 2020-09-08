Effect.lightScatter = _effect_lightScatter;
function _effect_lightScatter(node){
	if(!node.onFire){
		node.onFire = true;
	}else{
		return;
	}

	var fireGroup = new Group();
	var vecs = Comp.map.get4VecPos(node.pos);
	var directionSet = ['LU', 'RU', 'RD', 'LD'];
	vecs.forEach(function(vec, index){
		var directions = directionSet[index];
		_fire_line(vec, directions, 1);
	})

	function _fire_line(vec, directions, energy){
		var line = new Path.Line({
		    from: [vec.x, vec.y],
		    to: [vec.x, vec.y],
		    strokeColor: Theme.themeColor1,
		    strokeWidth: 1
		});
		line.opacity = energy * 0.6 + 0.25;

		line.direction = Math.random() > 0.5 ? directions[0]: directions[1];
		line.directions = directions;
		line.energy = energy;
		line.onFrame = _line_move;
		line.status = 'grow';
		line.nodeUid = node.uid;
		this.clockNum = 0;
	}

	function _line_move(){
		var speed = 8;
		var keepNum = 10;
		var bs = Comp.map.blockSize;
		if(this.status == 'grow'){
			if(this.direction == 'L'){
				this.segments[1].point.x -= speed;
			}
			if(this.direction == 'R'){
				this.segments[1].point.x += speed;
			}
			if(this.direction == 'U'){
				this.segments[1].point.y -= speed;
			}
			if(this.direction == 'D'){
				this.segments[1].point.y += speed;
			}
			if(this.length >= Comp.map.blockSize){
				if(this.direction == 'L'){
					this.segments[1].point.x = this.segments[0].point.x - bs;
				}
				if(this.direction == 'R'){
					this.segments[1].point.x = this.segments[0].point.x + bs;
				}
				if(this.direction == 'U'){
					this.segments[1].point.y = this.segments[0].point.y - bs;
				}
				if(this.direction == 'D'){
					this.segments[1].point.y = this.segments[0].point.y + bs;
				}
				this.status = 'keep';
				this.clockNum = 0;
				var p = this.segments[1].point;
				if(this.energy >= 0.05 && p.x >= 0 && p.x <= (windowWidth) && p.y >= 0 && p.y <= (windowHeight)){
					_fire_line(p, this.directions, this.energy - 0.2);
				}else{
					var node = Comp.space.getNodeByUid(this.nodeUid);
					if(node.onFire){
						node.onFire = false;
					}
				}
			}
		}
		if(this.status == 'keep'){
			this.clockNum += 1;
			// this.opacity -= 0.05;
			if(this.clockNum >= keepNum){
				this.status = 'fade';
			}
		}
		if(this.status == 'fade'){
			if(this.direction == 'L'){
				this.segments[0].point.x -= speed;
			}
			if(this.direction == 'R'){
				this.segments[0].point.x += speed;
			}
			if(this.direction == 'U'){
				this.segments[0].point.y -= speed;
			}
			if(this.direction == 'D'){
				this.segments[0].point.y += speed;
			}
			if(this.length < speed){
				// this.segments[0].point.x = this.segments[1].point.x;
				// this.segments[0].point.y = this.segments[1].point.y;
				this.onFrame = null;
				this.remove();
			}
		}
	}
}