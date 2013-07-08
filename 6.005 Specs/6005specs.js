// Objects

//so that it can do inheritance

Object.create = function(proto) {
    function F() {
    }
    
    F.prototype = proto;
    
    return new F();
    
};

function inherit(child, parent) {
    var copyOfParent = Object.create(parent.prototype);
    
    //set the constructor of the copy to child's constructor
    copyOfParent.constructor = child;
    
    //set the child ojbect protype to the copy of the parent; inherits
    //everything from the parent ojbect
    child.prototype = copyOfParent;    
}

//Specs object

function Spec(name, text) {
    this.name = name;
    this.text = text;
    this.radius = 0;
    this.specsContained = [];
    this.specsIntersected = [];
}

Spec.prototype = {
    constructor: Spec,
    getName: function() {
        return this.name;
    },
    getSpec: function() {
        return this.text;
    },
    getRadius: function() {
        return this.radius;
    },
    setName: function(n) {
        this.name = n;
    },
    setText: function(t) {
        this.text = t;
    },
    setRadius: function(r) {
        this.radius = r;
    },
    contains: function(name) {
        this.specsContained.push(name);
    },
    intersects: function(name) {
        this.specsIntersected.push(name)
    }
    
}

// Implementation object

function Imple(name, text) {
    Spec.call(this, name, text);
}

inherit(Imple, Spec);

//------------------------------

/*

AN EVENT HANDLER

*/
function UpdateHandler() {
    var handlers = {};
    
    
    /*
    creates a new listener request
    event = event to listen to 
    callback = function to call in the case of the event
    */
    function on(event, callback) {
        var callbacks = handlers[event];
        if (callbacks === undefined) {
            callbacks = [];
        }
        callbacks.push(callback);
        handlers[event] = callbacks;
    }
    
     /*
    calls all functions that are listeners
    event = event that occured
    data = data to pass to the callback functions.
    */
    function trigger(event, data) {
        var callbacks = handlers[event];
        if (callbacks !== undefined) {
            for (var i = 0; i < callbacks.length; i += 1)
                callbacks[i](data);
        }
    }
    
    return {on: on, trigger: trigger};
}

var specsExercise = (function () {    
    function Model() {
        var handler = UpdateHandler();
        var specObjects = [];
        var implementation = '';
        
        function loadQuestion(specs, imple, relationships) {
            //parsing stuff
            handler.trigger('loaded', [specs, imple]);
        }
        
        function updateSpec(name, radius, x, y) {
            //update info for the appropriate spec
        }
        
        function checkAnswer() {
            var correct = false;
            //check answer
            handler.trigger('checked', correct);
        }
        
        return {loadQuestion: loadQuestion, updateSpec: updateSpec, checkAnswer: checkAnswer, on: handler.on};
    }
    
    function Controller(model) {
        function loadQuestion(hugeBlob) {
            var specs, imple, relationships;
            //do stuff
            model.loadQuestion(specs, imple, relationships);
        }
        function updateSpec(name, radius, x, y) {
            model.updateSpec(name, radius, x, y);
        }
        function checkAnswer() {
            model.checkAnswer();
        }
        
        return {loadQuestion: loadQuestion, updateSpec: updateSpec, checkAnswer: checkAnswer};
    }
    
    function View(div, model, controller) {
        var vennDiagrams = $('<div class="vennDiagrams wide tall"><canvas id="c1" height="448" width="448"></canvas></div>');
        var specsDisplay = $('<div class="specsDisplay narrow tall"></div>');
        var impleDisplay = $('<div class="impleDisplay narrow short"></div>');
        var checkDisplay = $('<div class="checkDisplay wide short"></div>');
        
        div.append(vennDiagrams, specsDisplay, checkDisplay, impleDisplay);
        
        var canvas = new fabric.Canvas('c1');
        
        function loadSpecs(data) {
            console.log(data);
            var specs = data[0];
            var imple = data[1];
            
            canvas.clear();
            
            for(s in specs) {
                var circle1 = new fabric.Circle({radius:50,fill: randomColor(0.5),name: specs[s].getName()})
                var text1 = new fabric.Text(specs[s].getName(), {fontSize: 20, top:-40});
                var group1 = new fabric.Group([circle1, text1], {top:randomInteger(448), left:randomInteger(448)});
                
                canvas.add(group1);
            }
            
            var impleCircle = new fabric.Circle({radius:10,fill: randomColor(1),name: imple.getName(),top:randomInteger(448), left:randomInteger(448)});
            impleCircle.hasControls = false;
            canvas.add(impleCircle);
            
            canvas.forEachObject(function (obj) {
                obj.lockUniScaling = true;
                obj.selectionLineWidth = 5;
                obj.hasRotatingPoint = false;
                
                obj.on('modified', function () {
                    var point = obj.getCenterPoint();
                    if(point.x > 448 | point.x < 0 | point.y > 448 | point.y < 0) {
                        obj.animate('left', randomInteger(448), {onChange: canvas.renderAll.bind(canvas), duration: 100});
                        obj.animate('top', randomInteger(448), {onChange: canvas.renderAll.bind(canvas), duration: 100});
                    }
                });
            });
        }
        
        var testSpecs = [];
        testSpecs.push(new Spec('f1','blah'));
        testSpecs.push(new Spec('f2','blah'));
        testSpecs.push(new Spec('f3','blah'));
        var testImple = new Imple('f4', 'blah');
        
        loadSpecs([testSpecs, testImple]);
        
        function displayAnswer(correct) {
            return false;
        }
        
        model.on('loaded', loadSpecs);
        model.on('checked', displayAnswer);
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
    }
    
    return {setup: setup};
})();

function randomInteger(bound) {
    return Math.round(Math.random()*bound);
}

function randomColor(opacity) {
    return 'rgba('+
        randomInteger(255)+','+
        randomInteger(255)+','+
        randomInteger(255)+','+
        opacity+')';
}

$(document).ready(function () {
    $('.specs').each(function () {
        specsExercise.setup($(this));
    });
});