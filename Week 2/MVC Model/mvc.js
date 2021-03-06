var counter = (function () {
    
    // on(eventString, callback) -- register a handler for an event
    // trigger(eventString, data) -- call all callbacks for eventString
    function EventHandler() {
        var handlers = {};
        // {"update": [...View.update...]}
        function on(eventString, callback) {
            var cblist = handlers[eventString];
            
            if (cblist === undefined) {
               cblist = [];
                handlers[eventString] = cblist;
            }
            
            cblist.push(callback);
        }
        
        function trigger(eventString, data) {
            var cblist = handlers[eventString];
            
            if (cblist !== undefined) {
                for (var i = 0; i < cblist.length; i++) {
                    cblist[i](data);   
                }
            }
        }
        
         return { 
             on: on,
             trigger: trigger
         }
    }
    
    // addOneToCounter() -- increment counter
    // reset() -- set count to 0
    // v = getValue() -- return current counter value
    // on(eventString, callback)
    //      -- "update", the data will show new value of counter
    function Model() {
        var eventHandlers = EventHandler();
        var count = 0; //current val of counter
        
        
        function addOneToCounter() {
            count++;
            eventHandlers.trigger("update", count);
        }
        
        function reset() {
            count = 0;
        }
        
        function getValue() {
            return count;
            eventHandlers.trigger("update", count);
        }
        
        return { 
            addOneToCounter: addOneToCounter, 
            reset: reset,
            getValue: getValue,
            on: eventHandlers.on,            
        };   
    }
    
    // increment() -- cause the value of the counter to increment
    function Controller(model) {
        function increment() {
            model.addOneToCounter();
        }
        
        return { increment: increment };
    }
    
    function View(div, model, controller) {
        var display = $("<div class='view'>The current value of the counter is <span>0</span>.</div>");
        var counterValue = display.find("span");
        div.append(display);
        
        function update(cval) {
            counterValue.text(cval);
        }
        
        model.on("update", update);
    }
    
    function setup(div) {
        var model = Model();
        var controller = Controller(model);
        var view = View(div, model, controller);
        var view2 = View(div, model, controller);
        
        var button = $("<button>Increment</button>");
        button.on("click", controller.increment)
        
        div.append(button);
    }
    
    // items accessible to outsiders
    return { setup: setup };
    
}());

$(document).ready(function() {
    $(".counter").each(function() {
        counter.setup($(this));
    });
});