var graphcalc = (function () {
    var exports = {};  // functions,vars accessible from outside
   
    function graph(canvas,expression,x1,x2) {
        // setup canvas
        var JQcanvas = canvas;
        var DOMcanvas = JQcanvas[0];
        var ctx = DOMcanvas.getContext('2d');
        
        DOMcanvas.width = 360;
        DOMcanvas.height = 200;
        // resets the graph when entering in a new function
        ctx.fillStyle = "#f0fff0";
        ctx.fillRect(0,0,DOMcanvas.width,DOMcanvas.height);;
        
        
        // horizontal grid lines
        ctx.lineWidth = 0.2;
        ctx.strokeStyle = "gray";
        for(var i = 0; i <= DOMcanvas.height; i = i + 20) { 
            if (i == 9*20) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
            }
            else {
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = "gray";
            }
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(DOMcanvas.width, i);
            ctx.closePath();
            ctx.stroke();
        }
        
        // vertical grid lines
        for(var j = 0; j <= DOMcanvas.width; j = j + 20) {
            if (j == 9*20) {
                ctx.lineWidth = 2;
                ctx.strokeStyle = "black";
            }
            else {
                ctx.lineWidth = 0.2;
                ctx.strokeStyle = "gray";
            }
            ctx.beginPath();
            ctx.moveTo(j, 0);
            ctx.lineTo(j, DOMcanvas.height);
            ctx.closePath();
            ctx.stroke();
        }
        
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
        
        
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.moveTo(x[0]*xscale - parseFloat(x1)*xscale,ymax*yscale-y[0]*yscale /*+10*/);
        for (var c=1; c < x.length; c++) {
            ctx.lineTo(x[c]*xscale- parseFloat(x1)*xscale,ymax*yscale-y[c]*yscale/*+10*/ );
        }
        ctx.stroke();
        
        return [value, value2, ymin, ymax];      
        
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
            $("#xCoord").html("X Coord: ");
            $("#yCoord").html("Y Coord: ");
            
            var ans = graph(canvas, expression, x1, x2);
            
            if (ans != null) {
                var JQcanvas = canvas;
                var DOMcanvas = JQcanvas[0];
                ctx2 = DOMcanvas.getContext('2d');
                //The mouse over function
                var img = ctx2.getImageData(0,0,JQcanvas.width(),JQcanvas.height());
                ctx2.putImageData(img,0,0);
                
                JQcanvas.on("mousemove", function(e) {
                    var mx = e.pageX;
                    var my = e.pageY;
                    
                    var offset = JQcanvas.offset();
                    mx = mx-offset.left;
                    my = my-offset.top;
                    ctx2.putImageData(img,0,0);
                    ctx2.beginPath();
                    ctx2.moveTo(mx,JQcanvas.width());
                    ctx2.lineTo(mx,0);
                    ctx2.strokeStyle = "gray";
                    ctx2.lineWidth = 1;
                    ctx2.stroke();
                    
                    var xCoord = ans[0] + (mx*(ans[1]-ans[0])/JQcanvas.width());
                    var yCoord = ans[2] + (my*(ans[3]-ans[2])/JQcanvas.height());
                    
                    $("#xCoord").html("X Coord: " + xCoord.toFixed(2));
                    $("#yCoord").html("Y Coord: " + yCoord.toFixed(2));
                    console.log("X Coord: " + xCoord + "\n" + "Y Coord: " + yCoord);
                });
            }
          
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