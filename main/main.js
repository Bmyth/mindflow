if(window.location.search.indexOf('clear=true')>=0){
	Model.clear();
	location.href = location.href.substr(0, location.href.indexOf('?'))
}

//global value
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
	popFontSizeDefine: [18, 14, 14]
}

var windowWidth = 0;
var windowHeight = 0;
var halfWidth = 0;
var halfHeight = 0;
var angleD2R = Math.PI/180;
// this.colorPicker && this.colorPicker.bringToFront(); 
// this.orbits && this.orbits.sendToBack();
// BackPaper.activate();
// FrontPaper.activate();
	
$(function() {
	windowWidth = $(window).width();
    windowHeight = $(window).height();
    halfWidth = windowWidth * 0.5;
    halfHeight = windowHeight * 0.5;

	Physic.init();
	Model.init(function(){
		Pylon.init();
		ViewController.init();
	});
});

