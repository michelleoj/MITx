var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvas,expression,x1,x2) {
        // … your code to plot the value of expression as x varies from x1 to x2 …
        var JQcanvas = canvas;
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.font = "15px Georgia";
        ctx.textAlign = "center"; // left, right
        ctx.textBaseline = "middle"; // top, bottom, alphabetic
        // text, x, y
        
        
        try {
            var tree = calculator.parse(x1);
            var value = calculator.evaluate(tree, {e: Math.E, pi: Math.PI});
            var tree2 = calculator.parse(x2);
            var value2 = calculator.evaluate(tree2, {e: Math.E, pi: Math.PI});
            
            var parsedExp = calculator.parse(expression);
            var x = [];
            var y = [];
            for (var v=value; v < value2; v += (value2 - value)/100) {
                x.push(v);
                y.push(parseFloat(calculator.evaluate(parsedExp, {e: Math.E, pi: Math.PI, x: v})));
            }
        }
        catch(e) {
             ctx.fillText(e,170, 100);
        }
        
        
        ctx.moveTo(x[0],y[0]);
        for (var c=1; c < x.length; c++) {
            for(var d=1; d < y.length; d++) {
                ctx.lineTo(x[c], y[d]);
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
        
    }
   
    function setup(div) {
        
        var canvas = $('#graphWindow');
        $('#plotbutton').bind('click', function () {
            
            var expression = String($('#fxnInput').val());
            var x1 = String($('#minX').val());
            var x2 = String($('#maxX').val());
            
            graph(canvas, expression, x1, x2);
        });
    }
    exports.setup = setup;
   
    return exports;
}());
// setup all the graphcalc divs in the document
$(document).ready(function() {
    $('.graphcalc').each(function() {
        graphcalc.setup(this);  
    });
});