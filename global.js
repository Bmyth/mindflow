//move
var rotateSpeed = 0.007;
var rotateDegree = 0;
var nFallingSlow = 2;

var scaleMin = 0.25;
var scaleMax = 0.8;
var textLast = 2000;
var textHeight = 30;
var textReflectOffset = -10;
var fallingDegree = 30;
var fallingSpeed = 2;

//environment
var groundPostion = 150;
var groundRPostionAdjust = 35;
var skyHeight = 0;
var starRaduisInter = 1.2;
var starRaduisOuter = 8;
var starReflectRaduis = 1;
var cloudNum = 0;
var cloudHeight = 40;
var cloudSize = 10;
var cloudRange = 10;
var cloudSpeed = 0.2;
var cloudReflectOffset = 20;

var halfWidth = 0;
var angleD2R = Math.PI/180;

//console edit
var popFontSizeDefine = [36, 18, 12, 10];

var maxLinkL = 60;
var minLinkL = 30;
var linkOffset = 10;

//console edit
var consoleInfo = {
    'PopHover' : '[enter]:edit, [s]:sub_branch, [del]:delete',
    'onEdit' : '[enter]:ok, [esc]:cancel',
    'associate': '[click]:add here,[esc]:cancel'
};