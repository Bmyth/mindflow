if(window.location.search.indexOf('clear=true')>=0){
	Model.clear();
	location.href = location.href.substr(0, location.href.indexOf('?'))
}

//input text length limit
var textLengthLimit = 25;

var windowWidth, windowHeight, halfWidth, halfHeight;
var angleD2R = Math.PI/180;

var _fontColor = 'orange';
	
$(function() {
	windowWidth = $(window).width();
    windowHeight = $(window).height();
    halfWidth = windowWidth * 0.5;
    halfHeight = windowHeight * 0.5;

	Model.init();
	Pylon.init();
});

