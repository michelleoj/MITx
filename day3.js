function test_clear() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    // x, y, w, h
    ctx.clearRect(0, 0, JQcanvas.width(), JQcanvas.height());
}

function test_line() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(50, 150);
    ctx.lineTo(150, 150);
    ctx.lineTo(150, 50);
    ctx.lineTo(50, 50);
    
    ctx.lineWidth = 10;
    ctx.strokeStyle = "red";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    
    ctx.fillStyle = "black";
    ctx.fill();
}

function test_rect() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    ctx.beginPath();
    
    ctx.fillStyle = "red";
    ctx.fillRect(25, 25, 100, 100);
    ctx.fillStyle = "blue";
    ctx.fillRect(75, 75, 100, 100);
}

function test_smiley() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    ctx.beginPath();
    // cx, cy, radius, sangle, eangle
    ctx.arc(100, 100, 75, 0, 2*Math.PI);
    ctx.lineWidth = 5;
    ctx.lineStyle = "black";
    ctx.stroke();
    ctx.fillStyle = "yellow";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(75, 75, 5, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(125, 75, 5, 0, 2*Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(100, 100, 40, (1/6)*Math.PI, (5/6)*Math.PI);
    ctx.lineStyle = "black";
    ctx.stroke();
    
}

function test_text() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.font = "20px Georgia";
    ctx.textAlign = "center"; // left, right
    ctx.textBaseline = "middle"; // top, bottom, alphabetic
    // text, x, y
    ctx.fillText("Hi!", 100, 100);
    
}

function test_mouse() {
    var JQcanvas = $('#test:first');
    var DOMcanvas = JQcanvas[0];
    
    var ctx = DOMcanvas.getContext('2d');

}