// Objects

//so that it can do inheritance

Object.create = function(proto) {
    function F() {
    }
    
    F.prototype = proto;
    
    return new F();
    
}

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
        var handler = new UpdateHandler();
        var specObjects = [];
        var implementation = '';
        
        function loadQuestion(specs, imple, relationships) {
            //parsing stuff
            handler.trigger('loaded', specs);
        }
    }
    
    function Controller(model) {
        function loadQuestion(specs, imple, relationships) {
            model.loadQuestion(specs, imple, relationships);
        }
        function updateSpecCircle(radius, x, y) {}
        function checkAnswer() {}
        
        return {loadQuestion: loadQuestion, updateSpecCircle: updateSpecCircle, checkAnswer: checkAnswer};
    }
    
    function View(div, model, controller) {
        function loadSpecs(specs) {
            //display circles
        }
        
        model.on('loaded', loadSpecs);
    }
    
    function setup(div) {
        var model = new Model();
        var controller = new Controller(model);
        var view = new View(div, model, controller);
    }
    
    return {setup: setup};
})();

$(document).ready(function () {
    $('.specs').each(function () {
        specsExercise.setup($(this));
    });
});