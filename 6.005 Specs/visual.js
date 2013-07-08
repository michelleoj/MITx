function setup(div) {
    var vennDiagrams = $('<div class="vennDiagrams wide tall"><canvas id="c1" height="448" width="448"></canvas></div>');
    var specsDisplay = $('<div class="specsDisplay narrow tall"></div>');
    var impleDisplay = $('<div class="impleDisplay narrow short"></div>');
    var checkDisplay = $('<div class="checkDisplay wide short"></div>');
    
    div.append(vennDiagrams, specsDisplay, checkDisplay, impleDisplay);
    
    setupCanvas();
    
    
}

function setupCanvas() {
    var canvas = new fabric.Canvas('c1');
    
    var circle1 = new fabric.Circle({radius:50,fill:'rgba(255,120,120,0.5)',name:'circle1'})
    var text1 = new fabric.Text('circle1', {fontSize: 20, top:-40});
    var group1 = new fabric.Group([circle1, text1], {top:100, left:100});
    
    canvas.add(group1);
    
    for(i in canvas.getObjects()) {
        var currentObject = canvas.item(i);
        currentObject.lockUniScaling = true;
        currentObject.selectionLineWidth = 5;
        currentObject.hasRotatingPoint = false;
    }
    
    
    group1.on('modified', function () {
        var point = group1.getCenterPoint();
        if(point.x > 448 | point.x < 0 | point.y > 448 | point.y < 0) {
            group1.animate('left', 224, {onChange: canvas.renderAll.bind(canvas), duration: 100});
            group1.animate('top', 224, {onChange: canvas.renderAll.bind(canvas), duration: 100});
        }
    });
}

$(document).ready(function () {
    $('.specs').each(function () {
        setup($(this));
    });
});