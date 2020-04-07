// localStorage.removeItem(storageName);
if(window.location.search.indexOf('clear=true')>=0){
	Model.clear();
}
	
$(function() {
	Model.init();
	ViewController.init();
});