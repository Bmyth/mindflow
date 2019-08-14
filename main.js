$(function(){
	var screenRatio = parseFloat(24) / 13;
	var winW = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    var winH = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var canvasW =  canvasH = 0;
    var marginTop = 0;
    if(parseFloat(winW) / winH >= screenRatio){
    	canvasH = winH;
    	canvasW = parseInt(canvasH * screenRatio);
    }else{
    	canvasW = winW;
    	canvasH = parseInt(canvasW / screenRatio);
    	marginTop = (winH - canvasH) / 2;
    }
    $('#board').attr('height', canvasH).attr('width', canvasW).css('marginTop', marginTop + 'px');

 //    $('.btn').click(function(){
	// 	hold =! hold;
	// })
	// var hold = false;

	var stage = new createjs.Stage("board");
	createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", stage);

	 var loadQueue = new createjs.LoadQueue(false);

	var gTween = createjs.Tween.get(this);

	var rainLineHeight = 50;
	var rainLineNum = 100;
	var rainDistance = 0.5;
	var rainSpeed = 400;

	var backRec = new createjs.Graphics().f("#D9D9D9").dr(0, 0, canvasW, canvasH);
	var backShape = new createjs.Shape(backRec);
	stage.addChild(backShape);

	var rec = new createjs.Graphics().f("#fff").dr(0, 0, 1, rainLineHeight);

	for(var i =0 ; i < rainLineNum; i++){
		var r = new createjs.Shape(rec);
		r.x = canvasW * Math.random();
		r.y = canvasH * 1.1 * Math.random() - 100;
		r.rotation =  2 * (1 - 2 * Math.random());
		r.scaleY = 1.5 * Math.random();
		stage.addChild(r);
		var time = rainSpeed *  0.7 + rainSpeed * 0.3 * Math.random();
		createjs.Tween.get(r, { loop: true }).to({ y: r.y + canvasH * rainDistance }, time);
	}

	gTween.wait(1000).call(function(){
		loadQueue.loadManifest([
			{id: "town", src:"./asset/town.png"},
			{id: "townBack", src:"./asset/townback.png"}]);
		loadQueue.on("complete", imgTownLoaded, this);
	})

	// tween.wait(2000).call(function(){
	// 	stage.removeAllChildren();
	// })

	function imgTownLoaded(){
		var town = new createjs.Bitmap(loadQueue.getResult("town"));
		var bounds = town.getBounds();
		var scale = canvasW / bounds.width;
		town.x = 0;
		town.y = canvasH;
		town.scaleX = scale;
		town.scaleY = scale;
		stage.addChildAt(town, 1);
		var h = canvasH - bounds.height * scale + 8;
		createjs.Tween.get(town, { loop: false }).to({ y: h }, 4000);

		var townBack = new createjs.Bitmap(loadQueue.getResult("townBack"));
		bounds = townBack.getBounds();
		scale = canvasW / bounds.width;
		townBack.x = 0;
		townBack.y = canvasH;
		townBack.scaleX = scale;
		townBack.scaleY = scale;
		stage.addChildAt(townBack, 1);
		h = canvasH - bounds.height * scale + 8;
		createjs.Tween.get(townBack, { loop: false }).to({ y: h }, 4100);
	}
})