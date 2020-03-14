//environment
var groundPostion = 120;
var groundRPostionAdjust = 35;
var skyHeight = 0;

//rotate & move
var rotateCenter = null;
//current left to rotate degree
var rotatingDegree = 0;
//current rotate degree offset
var degreeOffset = 0;
//rotate speed : degree/frame
var rotateSpeed = 2;
//rotate degree per action
var rotateD = 10;
//move length to go
var movingLen = 0;
//move length per action
var moveD = 160;
//move speed : px/frame
var moveSpeed = 20;

//default text opacity
var popTextOpacity = 0.7;

var halfWidth = 0;
var angleD2R = Math.PI/180;

//console edit
var popFontSizeDefine = [36, 18, 12, 10];

//max link length
var maxLinkL = 160;
//min link length
var minLinkL = 30;
//link margin to pop text
var linkOffset = 10;

//input text length limit
var textLengthLimit = 20;

//pop only stay in this range
var galaxyRadius = 2000;

//console edit
var consoleInfo = {
    'PopHover' : '[e]:edit, [s]:sub_branch, [del]:delete',
    'onEdit' : '[enter]:ok, [esc]:cancel',
    'associate': '[click]:add here,[esc]:cancel',
    'textLenLimit': 'text max length 20'
};