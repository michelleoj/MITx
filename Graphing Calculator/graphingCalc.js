var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvas,expression,x1,x2) {
        // … your code to plot the value of expression as x varies from x1 to x2 …
        var JQcanvas = canvas;
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        DOMcanvas.width = 350;
        DOMcanvas.height = 200;
        // resets the graph when entering in a new function
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0,0,DOMcanvas.width,DOMcanvas.height);;
        
        // calculates the points for the graph 
        try {
            var tree = calculator.parse(x1);
            var value = calculator.evaluate(tree, {e: Math.E, pi: Math.PI});
            var tree2 = calculator.parse(x2);
            var value2 = calculator.evaluate(tree2, {e: Math.E, pi: Math.PI});
            
            var parsedExp = calculator.parse(expression);
            var x = [];
            var y = [];
            var xscale; var yscale; 
            xscale = DOMcanvas.width/(parseFloat(x2) - parseFloat(x1));
            var ymin = 0;
            var ymax = 0;
            var v = value;
            while(v < value2) { 
                var yvalue = parseFloat(calculator.evaluate(parsedExp, {e: Math.E, pi: Math.PI, x: v}));
                x.push(v);
                if (yvalue < ymin) {
                    ymin = yvalue;
                }
                else if (yvalue > ymax) {
                    ymax = yvalue;
                }
                y.push(yvalue);
                v += (value2 - value)/100;
            }
        } catch(e) {
            throw_error(String(e), ctx);
            return;
        }
        yscale = (DOMcanvas.height-20)/(ymax-ymin);
        
        
        
        ctx.strokeStyle = "red";
        ctx.lineWidth = 5;
        ctx.moveTo(x[0]*xscale - parseFloat(x1)*xscale,ymax*yscale-y[0]*yscale +10);
        for (var c=1; c < x.length; c++) {
            ctx.lineTo(x[c]*xscale- parseFloat(x1)*xscale,ymax*yscale-y[c]*yscale +10);
        }
        ctx.stroke();
        
        
        
    }
    
    function throw_error(e, ctx) {
        ctx.font = "15px Georgia";
        ctx.textAlign = "center"; // left, right
        ctx.textBaseline = "middle"; // top, bottom, alphabetic
        ctx.fillStyle = "black";
        ctx.fillText(e,100,100);
    }
    
    
   
    function setup(div) {
        
        var canvas = $('#graphWindow');
        $('#plotbutton').bind('click', function () {
            
            var expression = String($('#fxnInput').val());
            var x1 = String($('#minX').val());
            var x2 = String($('#maxX').val());
            
            graph(canvas, expression, x1, x2);
            
            var can = $('canvas');
            var DOMcan = can[0];
            
            var ctx = DOMcan.getContext('2d');
            //TODO KEEP WORKING ON THIS
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