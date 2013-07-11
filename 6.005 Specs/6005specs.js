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
function Spec(name, text, color) {
    this.name = name;
    this.text = text;
    this.radius = 0;
    this.specsContained = [];
    this.specsIntersected = [];
    this.color = color;
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
    getColor: function() {
        return this.color;
    },
    contains: function(name) {
        return this.specsContained.indexOf(name) >= 0;
    },
    intersects: function(name) {
        return this.specsIntersected.indexOf(name) >= 0;
    },
    setColor: function(c) {
        this.color = c;
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

function Imple(name, text, color) {
    Spec.call(this, name, text, color);
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
        var impleObjects = [];
        var relationships = [];
        
        function loadQuestion(specs, imples, rels) {
            specObjects.push({});
            impleObjects.push({});
            var index = specObjects.length - 1;
            for(s in specs)
                specObjects[index][specs[s].getName()] = specs[s];
            for(i in imples)
                impleObjects[index][imples[i].getName()] = imples[i];
            relationships.push(rels);
            //store the relationships
            console.log(specs, imples);
            handler.trigger('loaded', [index, specs, imples]);
        }
        
        function updateSpec(questionNumber, name, radius, x, y) {
            //update info for the appropriate spec
            specObjects[questionNumber][name].setRadius(radius);
            specObjects[questionNumber][name].setPosition(x, y);
        }
   
        function checkAnswer(questionNumber) {
            var currentSpecs = specObjects[questionNumber];
            var currentImples = impleObjects[questionNumber];
            var currentRels = relationships[questionNumber];
            var correct = true;
            var alreadyChecked= [];
            var numRels = 0;
            var hint;
            var correctRels = [];
            for(i in currentSpecs) {
                alreadyChecked.push(i+i);
                for(j in currentSpecs) {
                    if(alreadyChecked.indexOf(i+j) < 0 & alreadyChecked.indexOf(j+i) < 0) {
                        alreadyChecked.push(i+j);
                        var newRel = checkOverlap(currentSpecs[i], currentSpecs[j]);
                        if(newRel !== '') {
                            var newRelRev = checkOverlap(currentSpecs[j], currentSpecs[i]);
                            if(currentRels.indexOf(newRel) < 0 & currentRels.indexOf(newRelRev) < 0) {
                                hint = newRel;
                                correct = false;
                            }
                            else
                                correctRels.push([newRel, newRelRev]);
                            numRels++;
                        }
                    }
                }
                for(k in currentImples) {
                    var newRel = checkOverlap(currentSpecs[i], currentImples[k]);
                    if(newRel !== '') {
                        var newRelRev = checkOverlap(currentImples[k], currentSpecs[i]);
                        if(currentRels.indexOf(newRel) < 0 & currentRels.indexOf(newRelRev) < 0) {
                            hint = newRel;
                            correct = false;
                        }
                        else
                            correctRels.push([newRel, newRelRev]);
                        numRels++;
                    }
                }
            }
            if(numRels !== currentRels.length) {
                for(c in correctRels) {
                    if(currentRels.indexOf(correctRels[c][0]) < 0 & currentRels.indexOf(correctRels[c][0]) < 0)
                        hint = correctRels[c][0];
                }
                correct = false;
                if(hint === undefined)
                    hint = 'your implementation is incorrectly placed';
                else
                    hint += ' is an incorrect relationship';
            }
            handler.trigger('checked', [questionNumber, correct, hint]);
        }
        
        function updateImple(questionNumber, name, x, y) {
            impleObjects[questionNumber][name].setPosition(x, y);
        }
        
        return {loadQuestion: loadQuestion, updateSpec: updateSpec, updateImple: updateImple, checkAnswer: checkAnswer, on: handler.on};
    }
    
    function Controller(model) {


        function loadQuestions(bigJSON) {
            for(j in bigJSON) {
                var jsonThing = bigJSON[j];
                var specs = [], imples = [], relationships = [];
                for(i in jsonThing['imples']) {
                    var currentImple = jsonThing['imples'][i];
                    imples.push(new Imple(i, currentImple['text'], currentImple['color']));
                }
                for(s in jsonThing['specs']) {
                    var currentSpec = jsonThing['specs'][s];
                    specs.push(new Spec(s, currentSpec['text'], currentSpec['color']));
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
    
                model.loadQuestion(specs, imples, relationships);
            }
        }
        function updateSpec(questionNumber, name, radius, x, y) {
            model.updateSpec(questionNumber, name, radius, x, y);
        }
        
        function updateImple(questionNumber, name, x, y) {
            model.updateImple(questionNumber, name, x, y);
        }
        
        function checkAnswer(questionNumber) {
            model.checkAnswer(questionNumber);
        }
        
        return {loadQuestions: loadQuestions, updateSpec: updateSpec, updateImple: updateImple, checkAnswer: checkAnswer};
    }
    
    function View(questionNumber, div, model, controller) {
        var vennDiagrams = $('<div class="vennDiagrams wide tall"><canvas id="c'+questionNumber+'"height="448" width="448"></canvas></div>');
        var specsDisplay = $('<div class="specsDisplay narrow tall"></div>');
        var impleDisplay = $('<div class="impleDisplay narrow short"></div>');
        var checkDisplay = $('<div class="checkDisplay wide short"></div>');
        
        var checkButton = $('<button class="btn btn-primary">Check</button>');
        checkDisplay.append(checkButton);
        checkButton.on('click', function () {
            controller.checkAnswer(questionNumber)
        });
        var correctDisplay = $('<div class="alert alert-success">Correct!</div>');
        var wrongDisplay = $('<div class="alert alert-error">Wrong.</div>');
        checkDisplay.append(correctDisplay, wrongDisplay);
        
        function displayAnswer(data) {
            var correct = data[0];
            var hint = data[1];
            if(correct) {
                correctDisplay.show();
                wrongDisplay.hide();
            }
            else {
                wrongDisplay.html(hint);
                wrongDisplay.show();
                correctDisplay.hide();
            }
        }
        
        model.on('loaded', function (data) {
            if(data[0] === parseInt(questionNumber))
                loadSpecs([data[1], data[2]]);
        });
        model.on('checked', function (data) {
            if(data[0] === questionNumber)
                displayAnswer([data[1], data[2]]);
        });
        
        div.append(vennDiagrams, specsDisplay, checkDisplay, impleDisplay);
        
        function loadSpecs(data) {
            var canvas = new fabric.Canvas('c'+questionNumber);
            
            canvas.on('after:render', function() {
                canvas.calcOffset();
            });

            
            correctDisplay.hide();
            wrongDisplay.hide();
            
            var specs = data[0];
            var imples = data[1];
            
            for(s in specs) {
                var text1 = new fabric.Text(specs[s].getName(), {fontSize: 20, top:-10});
                var circleWidth = Math.round(Math.max(50,text1.width));
                var circle1 = new fabric.Circle({radius:circleWidth,fill: specs[s].getColor(),name: specs[s].getName()});
                var group1 = new fabric.Group([circle1, text1], {top:randomInteger(350)+48, left:randomInteger(350)+48});
                
                canvas.add(group1);
                
                var newPre = $('<pre class="prettyprint specSpan" data-id="'+specs[s].getName()+'">'+specs[s].getSpec()+'</pre>');
                specsDisplay.append(newPre);
                newPre.css('background-color', circle1.fill);
            }
            
            for(i in imples) {
                var impleCircle = new fabric.Circle({radius:10,fill: imples[i].getColor(),name: imples[i].getName(),
                                                     top:randomInteger(428)+10, left:randomInteger(428)+10});
                impleCircle.hasControls = false;
                canvas.add(impleCircle);
                
                var newPre = $('<pre class="prettyprint impleSpan" data-id="'+imples[i].getName()+'">'+imples[i].getSpec()+'</pre>');
                impleDisplay.append(newPre);
                newPre.css('background-color', impleCircle.fill.replace(',1)',',0.3)'));
            }
            
            canvas.forEachObject(function (obj) {
                obj.on('selected', function () {
                    canvas.bringToFront(obj);
                });
                obj.lockUniScaling = true;
                obj.selectionLineWidth = 5;
                obj.hasRotatingPoint = false;
                
                var point = obj.getCenterPoint();
                if(obj.name === undefined)
                    controller.updateSpec(questionNumber, obj.item(0).name, obj.getBoundingRectWidth()/2, point.x, point.y);
                else
                    controller.updateImple(questionNumber, obj.name, point.x, point.y);
                
                obj.on('modified', function () {
                    var point = obj.getCenterPoint();
                    if(point.x > 448 | point.x < 0 | point.y > 448 | point.y < 0) {
                        point.x = randomInteger(350)+48;
                        point.y = randomInteger(350)+48;
                        obj.animate('left', point.x, {onChange: canvas.renderAll.bind(canvas), duration: 100});
                        obj.animate('top', point.y, {onChange: canvas.renderAll.bind(canvas), duration: 100});
                    }
                    if(obj.name === undefined)
                        controller.updateSpec(questionNumber, obj.item(0).name, obj.getBoundingRectWidth()/2, point.x, point.y);
                    else
                        controller.updateImple(questionNumber, obj.name, point.x, point.y);
                });
            });
        }
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var testJSON = [
            {"specs":{"f1":{"contains":[],"intersects":["f2"],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(0,0,139,0.5)"},"f2":{"contains":[],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(0,100,0,0.5)"},"f3":{"contains":["f4"],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(169,169,169,0.5)"}},"imples":{"f4":{"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(255,255,0,1)"}}},
            {"specs":{"f1":{"contains":["f7"],"intersects":["f2","f3"],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(0,0,139,0.5)"},"f2":{"contains":[],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(255,255,0,0.5)"},"f3":{"contains":[],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(0,139,139,0.5)"},"f4":{"contains":["f5","f6"],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(128,0,0,0.5)"},"f5":{"contains":["f6"],"intersects":[],"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(0,0,255,0.5)"}},"imples":{"f6":{"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(255,0,255,1)"},"f7":{"text":"boolean f1(int a, int b) {...}\n@requires a, b are integers\n@effects true if equal, false otherwise","color":"rgba(255,0,0,1)"}}}
        ];
        
        var navTabs = $('<ul class="nav nav-tabs"></ul>');
        var tabContent = $('<div id="my-tab-content" class="tab-content"></div>');
        var views = [];
        for(j in testJSON) {
            var qNum = parseInt(j)+1;
            var newTab = $('<li><a id="showQuestion'+j+'" data-toggle="tab" href="#question'+j+'tab">Question '+qNum+'</a></li>');
            navTabs.append(newTab);
            var newDiv = $('<div class="tab-pane" id="question'+j+'tab"></div>');
            if(j === '0') {
                newTab.addClass('active');
                newDiv.addClass('active');
            }
            tabContent.append(newDiv);
            var newView = View(j, newDiv, model, controller);
            views.push(newView);
        }
        div.append(navTabs, tabContent);
        controller.loadQuestions(testJSON);
    }
    
    return {setup: setup};
})();

function randomInteger(bound) {
    return Math.round(Math.random()*bound);
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

$(document).ready(function () {
    $('.specs').each(function () {
        specsExercise.setup($(this));
    });
});

