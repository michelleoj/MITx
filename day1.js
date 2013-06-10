/*
calculate: evaluate the value of an arithmetic expression
*/
function calculate(text) {
    var pattern = /\d+|\+|\-|\*|\/|\(|\)/g;
    var tokens = text.match(pattern);
    return tokens;
    //return JSON.stringify(tokens);
}

function setup_calc(div) {
    var input = $('<input></input>', {type: "text", size: 50});
    var output = $('<div></div>');
    var button = $('<button>Calculate</button>');
    button.bind("click", function() {
        var tokens = calculate(input.val());
        output.text(read_operand(tokens));
    });
    
    $(div).append(input,button,output);

}
 

function read_operand(tokens) {
    try {
        if (tokens.length < 1) {
            throw "empty list";
        }
        var num = tokens.shift();
        num = parseInt(num, 10);
        
        if (isNaN(num)) {
            throw "not a number";
        }
        else {
                console.log("the var num as int: " + num);
                return num;
        }

    }
    catch(e) {
        return e;
    }

}

function evalutate(tokens) {
    try {
        if (tokens.length < 1) {
            throw "empty list";
        }
        
        var value = read_operand(tokens);
        while (tokens.length !== 0) {
            
        }
        
    }
    catch(e) {
        return e;
    }
}

$(document).ready(function () {
   $('.calculator').each(function () {
      // this referes to the div with class calculator 
      setup_calc(this);
   }); 
});