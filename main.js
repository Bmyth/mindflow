localStorage.removeItem(storageName);
$(function() {
    Model.init();
    Stage.init();
});

function deletePop(pop){
    var idx = pop.idx;
    pops.splice(idx, 1);
    pops.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    popRs.splice(idx, 1);
    popAs.splice(idx, 1);
    popAs.forEach(function(p){
        if(p.idx > idx){
            p.idx -= 1;
        }
    })
    orbits.splice(idx, 1);
    var popstore = JSON.parse(localStorage.getItem(storageName));
    popstore.splice(idx, 1);
    localStorage.setItem(storageName,JSON.stringify(popstore))
}