var storageName = 'popstore';

var Model = {
	pops : []
};

Model.init = function() {
	var popstore = JSON.parse(localStorage.getItem(storageName));
    this.pops = popstore || [];
}

Model.savePop = function(pt) {
    Model.pops = JSON.parse(localStorage.getItem(storageName));
    Model.pops = Model.pops || [];
    Model.pops.push(pt);
    localStorage.setItem(storageName,JSON.stringify(Model.pops))
}

Model.deletePop = function(pop){
    var idx = pop.idx;
    Model.pops = JSON.parse(localStorage.getItem(storageName));
    Model.pops.splice(idx, 1);
    localStorage.setItem(storageName,JSON.stringify(Model.pops))
}