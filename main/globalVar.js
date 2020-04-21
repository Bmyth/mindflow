//rotate & move
//current left rotate degree
var rotatingDegree = 0;
//rotate speed : degree/frame
var rotateSpeed = 2;
//rotate degree per action
var rotateD = 10;
//move length to go
var movingLen = 0;
//move length per action
var moveD = 50;
//move speed : px/frame
var moveSpeed = 20;

//max link length
var maxPopLinkLength = 200;
//min link length
var minPopLinkLength = 50;
//link margin to pop text
var linkOffset = 10;
//new pop distance limit
var minPopDistance = 50;

//input text length limit
var textLengthLimit = 25;

//theme
var theme = {
	fontColor: '#fff',
	popTextOpacity: 0.85,
	popFontSizeDefine: [20, 18, 16],
	skyColor: '#5db0ca',
	groundColor: '#333'
}



var skyHeight = 0;
var halfWidth = 0;
var angleD2R = Math.PI/180;