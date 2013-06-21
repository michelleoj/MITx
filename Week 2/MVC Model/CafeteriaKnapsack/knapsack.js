var knapsack = (function () {
    
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
    function Model(items, budget) {
        var eventHandlers = EventHandler();
        var calsConsumed = 0; //amount of calories you consumed
        var amountSpent = 0; //how much money you start with
        
        //run through list and initialize all food items on tray
        function reset() {
            calsConsumed = 0;
            amountSpent = 0;
            for (var itemName in items) {
                items[itemName].location = "tray";
                
                
            }
            eventHandlers.trigger("item moved");
        }
        
        // returns true if item was moved successfully to the stomach
        // false if person spent more than budget permits
        function move(item) {
            if (item.location == "tray") {
                if (amountSpent + item.price > budget) {
                    return false;
                }
                item.location = "stomach";
                amountSpent += item.price;
                calsConsumed += item.calories;
            }
            else {
                item.location = "tray";
                amountSpent -= item.price;
                calsConsumed -= item.calories;
            }
            eventHandlers.trigger("item moved", item);
            return true;
        }
        
        function getItems() { 
            return items;
        }
        
        function getCalsConsumed() {
            return calsConsumed;
        }
        
        function getAmountSpent() {
            return amountSpent;
        }
            
        
        return {
            on: eventHandlers.on,
            move: move, 
            reset: reset,
            getItems: getItems,
            getCalsConsumed: getCalsConsumed,
            getAmountSpent: getAmountSpent            
        };   
    }
    
    // increment() -- cause the value of the counter to increment
    function Controller(model) {
        var eventHandlers = EventHandler();
        
        function itemClicked(item) {
            if (!model.move(item)) {
                //went over budget
                eventHandlers.trigger("budget overflow", item);
            }
        }
        
        function reset() {
            model.reset();
        }
        
        return { 
            on: eventHandlers.on, 
            itemClicked: itemClicked,
            reset: reset
        };
    }
    
    function View(div, model, controller) {
        //add an alert 
        
        //add captions to each item
        
        var items = model.getItems();
        var tray = $("<div id='tray'>");
        
        for (var name in items) {
            var item = items[name];
            var itemInfo = $("<div class='sprite' id='" + name + "' data-cal='" + item.calories + "' data-price='" + item.price + "' data-name='"+ name +"'></div>");
            itemInfo[0].item = item;
            tray.append(itemInfo);
            if (name == "taco") {
                tray.append("<br>");
            }
            
        }
        
        //grab items again and adds the info to them
        var food = tray.find("div").each( function() {
                if ($(this).attr("data-name") == "burger" || 
                    $(this).attr("data-name") == "sushi" || 
                    $(this).attr("data-name") == "taco" ) {
                    
                    $(this).poshytip({
                        content: "Price: $" + $(this).attr("data-price") + "<br>Calories: " + $(this).attr("data-cal"),
                        className: 'tip-twitter',
                        showTimeout: 0,
                        alignTo: 'target',
                        alignX: 'center',
                        alignY: 'top',
                        offsetY: 5,
                        allowTipHover: false,
                        fade: false,
                        slide: false
                    });
                }
                else {
                    $(this).poshytip({
                        content: "Price: $" + $(this).attr("data-price") + "<br>Calories: " + $(this).attr("data-cal"),
                        className: 'tip-twitter',
                        showTimeout: 0,
                        alignTo: 'target',
                        alignX: 'center',
                        alignY: 'bottom',
                        offsetY: 5,
                        allowTipHover: false,
                        fade: false,
                        slide: false
                    });             
                }
                    
        });

    
        
        // attach click handler to top-most div, since moving DOM objects on and off
	// page clears any event bindings
        div.on("click",function(event) {
                console.log(event.target);
                controller.itemClicked(event.target.item);
            });
        
        //set up stomach display
        var stomach = $("<div id='stomach-sprite'></div>");
        
        
        var application = $(".application");
        
        var amountcal = $(".progress").find("#amountcal");
        var moneyleft = $(".progress").find("#moneyleft");
        
        var budget = application.attr("data-budget");
        div.append(stomach, tray);
        
        function position_items() {
	    // clear out both locations
            tray.empty();
            stomach.empty();
    
            // now add items back to their current location
            var items = model.getItems();
            for (var item_name in items) {
                var item = items[item_name];
                if (item.location == "tray") {
                    tray.append(item.image);
                }
                else {
                    stomach.append(item.image);
                }
            }
            amountcal.text(model.getCalsConsumed());
            moneyleft.text(model.getAmountSpent());
        }
        
        model.on("item moved",position_items);

    }
    
    function setup(div) {
	// extract item list from div body
	var items = {};
	div.find('.sprite').each(function () {
		var image = $(this);
		var name = image.attr('data-name');
		var calories = parseFloat(image.attr('data-cal'));
		var price = parseFloat(image.attr('data-price'));
        var initLocation = "tray";
		var item = {image: image, name: name, calories: calories, price: price, location: initLocation};
		items[name] = item;
        image[0].item = item;
        
	    });
	div.empty();  // clear it out!

	var budget = parseFloat(div.attr('data-budget') || 20);
	var model = Model(items,budget);
	var controller = Controller(model);
	var view = View(div,model,controller);

	// initialize starting location for all items
	//model.reset();
    
    }
    
    
    // items accessible to outsiders
    return { setup: setup };
    
}());

$(document).ready(function() {
    $(".application").each(function() {
        knapsack.setup($(this));
    });
});