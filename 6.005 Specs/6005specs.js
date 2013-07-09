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
    this.x = 0;
    this.y = 0;
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
    getX: function() {
        return this.x;
    },
    getY: function() {
        return this.y;
    },
    contains: function(name) {
        return this.specsContained.indexOf(name) >= 0;
    },
    intersects: function(name) {
        return this.specsIntersected.indexOf(name) >= 0;
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
    setPosition: function(x, y) {
        this.x = x;
        this.y = y;
    },
    doesContain: function(name) {
        this.specsContained.push(name);
    },
    doesIntersect: function(name) {
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
        var specObjects = {};
        var implementation;
        var relationships;
        
        function loadQuestion(specs, imple, rels) {
            for(s in specs)
                specObjects[specs[s].getName()] = specs[s];
            implementation = imple;
            relationships = rels;
            //store the relationships
            handler.trigger('loaded', [specs, imple]);
        }
        
        function updateSpec(name, radius, x, y) {
            //update info for the appropriate spec
            specObjects[name].setRadius(radius);
            specObjects[name].setPosition(x, y);
        }
   
/***************************************************************/
        function checkAnswer() {
            var correct = true;
            var alreadyChecked= [];
            var numRels = 0;
            for(i in specObjects) {
                alreadyChecked.push(i+i);
                for(j in specObjects) {
                    if(alreadyChecked.indexOf(i+j) < 0 & alreadyChecked.indexOf(j+i) < 0) {
                        alreadyChecked.push(i+j);
                        var newRel = checkOverlap(specObjects[i], specObjects[j]);
                        if(newRel !== '') {
                            var newRelRev = checkOverlap(specObjects[j], specObjects[i]);
                            if(relationships.indexOf(newRel) < 0 & relationships.indexOf(newRelRev) < 0)
                                correct = false;
                            numRels++;
                        }
                    }
                }
                var newRel = checkOverlap(specObjects[i], implementation);
                if(newRel !== '') {
                    var newRelRev = checkOverlap(implementation, specObjects[i]);
                    if(relationships.indexOf(newRel) < 0 & relationships.indexOf(newRelRev) < 0)
                        correct = false;
                    numRels++;
                }
            }
            if(numRels !== relationships.length)
                correct = false;
            handler.trigger('checked', correct);
        }
/***************************************************************/
        
        function updateImple(x, y) {
            implementation.setPosition(x, y);
        }
        
        return {loadQuestion: loadQuestion, updateSpec: updateSpec, updateImple: updateImple, checkAnswer: checkAnswer, on: handler.on};
    }
    
    function Controller(model) {
        function loadQuestion(jsonThing) {
            var specs = [], imple, relationships = [];
/***************************************************************/
            imple = new Imple(jsonThing['imple']['name'], jsonThing['imple']['text']);
            for(s in jsonThing['specs']) {
                var currentSpec = jsonThing['specs'][s];
                specs.push(new Spec(s, currentSpec['text']));
                for(o in currentSpec['contains']) {
                    var relString = s+' contains '+currentSpec['contains'][o];
                    if(relationships.indexOf(relString) < 0)
                        relationships.push(relString);
                }
                for(o in currentSpec['intersects']) {
                    var relString = s+' intersects '+currentSpec['intersects'][o];
                    var relStringRev = currentSpec['intersects'][o]+' intersects '+s;
                    if(relationships.indexOf(relString) < 0 & relationships.indexOf(relStringRev) < 0)
                        relationships.push(relString);
                }
            }
/***************************************************************/
            model.loadQuestion(specs, imple, relationships);
        }
        function updateSpec(name, radius, x, y) {
            model.updateSpec(name, radius, x, y);
        }
        
        function updateImple(x, y) {
            model.updateImple(x, y);
        }
        
        function checkAnswer() {
            model.checkAnswer();
        }
        
        return {loadQuestion: loadQuestion, updateSpec: updateSpec, updateImple: updateImple, checkAnswer: checkAnswer};
    }
    
    function View(div, model, controller) {
        var vennDiagrams = $('<div class="vennDiagrams wide tall"><canvas id="c1" height="448" width="448"></canvas></div>');
        var specsDisplay = $('<div class="specsDisplay narrow tall"></div>');
        var impleDisplay = $('<div class="impleDisplay narrow short"></div>');
        var checkDisplay = $('<div class="checkDisplay wide short"></div>');
        
        var checkButton = $('<button class="btn btn-primary">Check</button>');
        checkDisplay.append(checkButton);
        checkButton.on('click', controller.checkAnswer);
        var correctDisplay = $('<div class="alert alert-success">Correct!</div>');
        var wrongDisplay = $('<div class="alert alert-error">Wrong.</div>');
        checkDisplay.append(correctDisplay, wrongDisplay);
        correctDisplay.hide();
        wrongDisplay.hide();
        
        div.append(vennDiagrams, specsDisplay, checkDisplay, impleDisplay);
        
        var canvas = new fabric.Canvas('c1');
        
        function loadSpecs(data) {
            var specs = data[0];
            var imple = data[1];
            
            canvas.clear();
            specsDisplay.html('');
            
            for(s in specs) {
                var circle1 = new fabric.Circle({radius:50,fill: randomColor(0.3),name: specs[s].getName()})
                var text1 = new fabric.Text(specs[s].getName(), {fontSize: 20, top:-40});
                var group1 = new fabric.Group([circle1, text1], {top:randomInteger(350)+48, left:randomInteger(350)+48});
                
                canvas.add(group1);
                
                specsDisplay.append('<pre class="prettyprint specSpan" data-id="'+specs[s].getName()+'">'+specs[s].getSpec()+'</pre>');
            }
            
            var impleCircle = new fabric.Circle({radius:10,fill: randomColor(1),name: imple.getName(),top:randomInteger(428)+10, left:randomInteger(428)+10});
            impleCircle.hasControls = false;
            canvas.add(impleCircle);
            
            impleDisplay.html('<pre class="prettyprint impleSpan">'+imple.getSpec()+'</pre>');
            
            canvas.forEachObject(function (obj) {
                obj.on('selected', function () {
                    if(obj.name === undefined) {
                        $('.impleSpan').css('background-color', 'white');
                        $('.specSpan').each(function () {
                            if($(this).attr('data-id') === obj.item(1).text)
                                $(this).css('background-color',obj.item(0).fill);
                            else
                                $(this).css('background-color','white');
                        });
                    }
                    else {
                        $('.specSpan').each(function () {
                            $(this).css('background-color', 'white');
                        });
                        $('.impleSpan').css('background-color', impleCircle.fill.replace(',1)',',0.3)'));
                    }
                });
                obj.lockUniScaling = true;
                obj.selectionLineWidth = 5;
                obj.hasRotatingPoint = false;
                
                var point = obj.getCenterPoint();
                if(obj.name === undefined)
                    controller.updateSpec(obj.item(0).name, obj.getBoundingRectWidth()/2, point.x, point.y);
                else
                    controller.updateImple(point.x, point.y);
                
                obj.on('modified', function () {
                    var point = obj.getCenterPoint();
                    if(point.x > 448 | point.x < 0 | point.y > 448 | point.y < 0) {
                        point.x = randomInteger(350)+48;
                        point.y = randomInteger(350)+48;
                        obj.animate('left', point.x, {onChange: canvas.renderAll.bind(canvas), duration: 100});
                        obj.animate('top', point.y, {onChange: canvas.renderAll.bind(canvas), duration: 100});
                    }
                    if(obj.name === undefined)
                        controller.updateSpec(obj.item(0).name, obj.getBoundingRectWidth()/2, point.x, point.y);
                    else
                        controller.updateImple(point.x, point.y);
                });
            });
        }
        
        function displayAnswer(correct) {
            if(correct) {
                correctDisplay.show();
                wrongDisplay.hide();
            }
            else {
                wrongDisplay.show();
                correctDisplay.hide();
            }
        }
        
        model.on('loaded', loadSpecs);
        model.on('checked', displayAnswer);
        
        var testJSON = {
            'specs': {
                'f1': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': [],
                    'intersects': ['f2']
                },
                'f2': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': [],
                    'intersects': []
                },
                'f3': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': ['f7'],
                    'intersects': []
                },
                'f4': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': ['f5','f6'],
                    'intersects': []
                },
                'f5': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': ['f6'],
                    'intersects': []
                },
                'f6': {
                    'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
                    'contains': [],
                    'intersects': []
                }
            },
            'imple': {
                'name': 'f7',
                'text': 'boolean f1(int a, int b) {...}<br>@requires a, b are integers<br>@effects true if equal, false otherwise',
            }
        };
        
        controller.loadQuestion(testJSON);
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
        
        /***************/
        //CHANGES
        
        //reads the file
//        $('link[data-src]').each(function () {
//            var self = $(this);
//            src = self.attr('data-src');
//            console.log("sorce: ", src);
//            $.get(src, fileHandler);
//            console.log("finished");
//        });
        //CHANGES
        /***************/
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

function checkOverlap(spec1, spec2) {
    var x1 = spec1.getX();
    var y1 = spec1.getY();
    var r1 = spec1.getRadius();
    var x2 = spec2.getX();
    var y2 = spec2.getY();
    var r2 = spec2.getRadius();
    var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (distance > (r1 + r2)) {
        return '';
    }
    else if (distance <= Math.abs(r1 - r2)) {
        if(r1 > r2)
            return spec1.getName()+" contains "+spec2.getName();
        else
            return spec1.getName()+" inside "+spec2.getName();
    }
    else {  // if (distance <= r1 + r2)
        return spec1.getName()+" intersects "+spec2.getName();
    }   
}


function fileHandler(file) { // returns the array of the specs and the implementation
    var str = file;
    var specImplArray = str.split("\n*/~\n");
    for (var i = 0; i < specImplArray.length; i++) {
        console.log(specImplArray[i]);
    }

    
    
}



$(document).ready(function () {
    $('.specs').each(function () {
        specsExercise.setup($(this));
    });
});

