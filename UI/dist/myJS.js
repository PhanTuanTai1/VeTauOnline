
function changeHref(id, costID){
    var obj = document.getElementById('bookLink' + id);
    var href = obj.getAttribute('data-href') + "&costID=" + costID;
    obj.href = href;
}