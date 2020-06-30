var Physic ={
	init: _phy_init,
	Engine: null,
	engine: null,
	World: null,
	world: null,
	Bodies: null,
	addLiquidChain: _phy_addLiquidChain,
	addRect: _phy_addRect,
	getObjectByIdx: _phy_getObjectByIdx,
	deleteObject: _phy_deleteObject,
	applyForce: _phy_applyForce,
	clear: _phy_clear,
	objects: []
}

function _phy_init(){
	this.Engine = Matter.Engine;
    this.World = Matter.World;
    this.engine = this.Engine.create();
    this.world = this.engine.world;
    this.Bodies = Matter.Bodies;

	this.Engine.run(this.engine);

	var leftWall = this.Bodies.rectangle(0, halfHeight, 1, windowHeight, { isStatic: true });
	leftWall.idx = 'leftWall';
	leftWall.keep = true;
	this.objects.push(leftWall);
	var rightWall = this.Bodies.rectangle(windowWidth, halfHeight, 1, windowHeight, { isStatic: true });
	rightWall.idx = 'rightWall';
	rightWall.keep = true;
	this.objects.push(rightWall);
	var bottomWall = this.Bodies.rectangle(halfWidth, windowHeight, windowWidth, 1, { isStatic: true });
	bottomWall.idx = 'bottomWall';
	bottomWall.keep = true;
	this.objects.push(bottomWall);
	this.World.add(this.world, [leftWall, rightWall, bottomWall]);
}

function _phy_addLiquidChain(liquid){
	var liquidTop = liquid.top;
	var liquidWidth = liquid.width;

	var liquidNodeNum = liquid.amount;
	var liquidNodeWidth = 4;
	var gap = (liquidWidth - liquidNodeNum * liquidNodeWidth * 2) / (liquidNodeNum - 1);
    var liquidNodes = Matter.Composites.stack(liquidNodeWidth * 0.5, liquidTop, 10, 1, gap, 0, function(x, y) {
        var n = Matter.Bodies.circle(x,y,liquidNodeWidth);
        n.mass = 0.5;
        return n;
    });
    liquidNodes.idx = 'liquidNodes';
	liquidNodes.keep = true;
	this.objects.push(liquidNodes);
    
    Matter.Composites.chain(liquidNodes, 0.5, 0, -0.5, 0, { stiffness: 0.5, length: 5});

    var c1 = Matter.Constraint.create({
       // bodyA:Physic.getObjectByIdx('leftWall'),
       pointA:{x:0,y:liquidTop},
       bodyB:liquidNodes.bodies[0],
       pointB:{x:-5,y:0},
       stiffness: 0.8
    });
    var c2 = Matter.Constraint.create({
       pointA:{x:liquidWidth,y:liquidTop},
       bodyB:liquidNodes.bodies[liquidNodeNum-1],
       pointB:{x:5,y:0},
       stiffness: 0.8
    });
    this.World.add(this.world, [liquidNodes, c1, c2]);
}

function _phy_addRect(params){
	var rect = this.Bodies.rectangle(params.x, params.y, params.w, params.h, params);
	rect.idx = params.idx;
	// rect.keep = params.keep;
	this.objects.push(rect);
	this.World.add(this.engine.world, [rect]);
}

function _phy_getObjectByIdx(idx){
	return this.objects.find(function(i){
		return i.idx == idx;
	})
}

function _phy_deleteObject(params){

}

function _phy_applyForce(obj, force){
	Matter.Body.applyForce(obj, obj.position, force);
}

function _phy_clear(){
	this.objects.forEach(function(o){
		if(!o.keep){
			Physic.World.remove(Physic.world, o);
		}
	})
}