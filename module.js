//HOW TO MAKE MODULES SO THAT YOU CAN DISTRIBUTE 
//manages namespace so that you don't take up the user's namespace
//protects us from them and them from us

var calculator = (function() {
    var exports = {};
    
    function bar(a) { // internal function used by everybody inside module, but NOT outside the module
        return a+1;
    }
    
    function foo(a, b) {
        return bar(a) + b;
    }
    
    exports.foo = foo; // make it accessible outside of calculator function
    
    return exports;
    
}());
    
/*
<script src="calculator.js"></script>

... calculator.foo(3,4) ....
*/
