if(window.location.search.indexOf('clear=true')>=0){
	Model.clear();
	location.href = location.href.substr(0, location.href.indexOf('?'))
	// window.location.href=window.location.href;
}
	
$(function() {
	Model.init(function(){
		ViewController.init();
	});
});