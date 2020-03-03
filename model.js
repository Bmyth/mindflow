var storageName = 'popstore';

var Model = {
	pops : []
};

Model.init = function() {
	var popstore = JSON.parse(localStorage.getItem(storageName));
    this.pops = popstore || [];
}

Model.savePop = function(pt) {
    var popstore = JSON.parse(localStorage.getItem(storageName));
    popstore = popstore || [];
    popstore.push(pt);
    localStorage.setItem(storageName,JSON.stringify(popstore))
}