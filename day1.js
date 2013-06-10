/*
calculate: evaluate the value of an arithmetic expression
*/
function calculate(text) {
    var pattern = /\d+|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    try {
        var value = evaluate(tokens);
        if (tokens.length !== 0 ) {
            throw "ill-formed expression";
        }
        return value;
        
    }
    catch(e) {
        return e;
    }

}

function setup_calc(div) {
    var input = $('<input></input>', {type: "text", size: 50});
    var output = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind("click", function() {
        output.text(String(calculate(input.val())));
    });
    
    $(div).append(input,button,output);

}

var isClosed = true;

function read_operand(tokens) {
    if (tokens === null) {
        throw "empty list";
    }
    var num = tokens.shift();
    
    if (num === "(") {
        isClosed = false;
        return evaluate(tokens);
    }
    else if (num === ")") {
        tokens.shift();
        isClosed = true;
    }
    if (num === "-") {
        num = tokens.shift();
        if (!isNaN(num)) { // if next value is a number
            //num = tokens.unshift();
            num *= -1;
            console.log("negated number: " + num);
            return num;
        }
        else {
            //TODO: must check if -(3 + 4) case works
            return evaluate(tokens);
        }
    }
    num = parseInt(num, 10);
    if (isNaN(num)) {
        throw "not a number";
    }
    else {
            return num;
    }

}

function evaluate(tokens) {
    if (tokens === null) {
        throw "empty list";
    }
    
    var value = read_operand(tokens);

    while (tokens.length !== 0) {
        var operator = tokens.shift();
        var listOfOperaters = ['*','+','-','/'];
        
        if (operator === ")") {
            isClosed = true;
            return value;
        }
        
        if ($.inArray(operator, listOfOperaters) == -1) { //if not in the array
            throw "unrecognized operator";
        }
        
        var temp = read_operand(tokens);
        console.log("temp var: " + temp);
        if (operator === "+") {
            value = value + temp;
        }
        else if (operator === "-") {
            value = value - temp;
        }
        else if (operator === "*") {
            value = value * temp;
        }
        else {
            value = value / temp;
        }
        //operator = tokens.shift();
    }
    if (!isClosed) {
        throw "expression not balanced";
    }
    return value;
}


$(document).ready(function () {
   $('.calculator').each(function () {
      // this referes to the div with class calculator 
      setup_calc(this);
   }); 
});