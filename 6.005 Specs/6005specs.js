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
    this.diameter = 2*this.radius;
    
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
    getDiameter: function() {
        return this.diamter;
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
    setDiameter: function(d) {
        this.diameter = d;
    }
    
}

// Implementation object

function Imple(name, text) {
    Spec.call(this, name, text);
}

