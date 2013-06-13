/**
 * A simple web inspector.
 *
 * Intended to be a singleton: this only exists once per page, so it
 * attaches itself to the BODY element.
 */
var Inspector = function($) {
  exports = {};

  // The root element of the inspector.
  var root = null;

  var template = ""
    + "<div class='tray'>"
    + "  <textarea class='text-editor'></textarea>"
    + "  <div class='property-editor'>"
    + "    <div class='node-lookup'>"
    + "      <input class='selector' />"
    + "      <button>Search</button><button class='mousehover'>Mouse</button>"
    + "    </div>"
    + "    <div class='property-list' color='black'>"
    + "    </div>" 
    + "  </div>" 
    + "</div>" 
    + "<div class='handle'></div>";

    
  var toggle = function() {
      if (root.css("top") == "0px") {
            root.animate( { "top": "-300px" }, 500);
      }
      else {
            root.animate( { "top": "0px" }, 500); 
      }

  };   
    
  var searchBySelector = function() {
      var selectorBox = root.find(".selector");
      var selectorStr = selectorBox.val();
      var selection = $(selectorStr).first();
      showElement(selection);
  };
    
    var showElement = function(selection) {
         var html = selection.html();
          var textEditor = root.find(".text-editor");
          textEditor.val(html);
          propertyInfo(selection);
    };
    
  var displayCustomProperty = function(e) {
      if (e.keyCode == 13 && e.shiftKey) {
          e.preventDefault();
          var textEditor = root.find(".text-editor");
          var whatToDisplay = textEditor.val();
          var selectorBox = root.find(".selector");
          var selectorStr = selectorBox.val();
          var selection = $(selectorStr);
          selection.html(whatToDisplay);
      }
  };
    
  function propertyInfo(selection) {

        var info = "";
        var propertyBox = root.find(".property-list");
        var selectionSize = "Width: " + selection.css("width") + ", " + "Height: " +                   selection.css("height") + "\n";
        var selectionPos = "Top: " + selection.css("top") + ", Left: " + selection.css("left")+ "\n";
        var selectionSpacing = "Margin: " + selection.css("margin") + ", Padding: " + selection.css("padding")+ "\n";
        var selectionBgFgColor = "Background Color: " + selection.css("background-color") + ", Foreground Color: " + selection.css("foreground-color")+ "\n";
        var selectionTag = "Tag: " + selection.prop("tagName")+ "\n";
        var numOfChildren = "# of Children: " + String(selection.contents().length);
        info = selectionSize+"<br>"+selectionPos+"<br>"+selectionSpacing+"<br>"+selectionBgFgColor+"<br>"+selectionTag+"<br>"+numOfChildren;

        propertyBox.html(info);
        propertyBox.css("color", "black");
        propertyBox.css("font-size", "12px");
        propertyBox.css("font-family", "Courier New");  
  };

    var elementClicked = function(e) {
        e.stopPropagation();
        e.preventDefault();
        var objClicked = $(e.target);
        objClicked.removeClass("selected");
        showElement(objClicked);
        $("*").off("hover", elementHover);
    };
    
    var elementHover = function() {
        $(".selected").removeClass("selected").off("click", elementClicked);
        $(this).addClass("selected").on("click", elementClicked);
    }
    function selection() {
        var allElements = $("*");
        allElements.on("hover", elementHover);
        
        
   };

  /*
   * Construct the UI
   */
  exports.initialize = function() {
    root = $("<div class='inspector'></div>").appendTo($('body'));
      
    root.append(template);
    root.find(".handle").on("click", toggle);
    root.find(".node-lookup button").on("click", searchBySelector);
    root.find(".text-editor").on("keypress", displayCustomProperty); 
    root.find(".mousehover").on("click", selection);
  };
  
  return exports;
};

/*****************************************************************************
 * Boot up the web inspector!
 *
 * This will enable you to COPY AND PASTE this entire file into any web page
 * to inspect it.
 *
 * XXX TODO!
 *  Change the CSS link below to point to the full URL of your CSS file!
 *
 *  You shouldn't need to touch anything else below.
 *
 *****************************************************************************/
(function() {
    var createInspector = function() {
      window.inspector = Inspector(jQuery);
      window.inspector.initialize();
    }

    // Add the CSS file to the HEAD
    var css = document.createElement('link');
    css.setAttribute('rel', 'stylesheet');
    css.setAttribute('type', 'text/css');
    css.setAttribute('href', 'web-inspector.css'); // XXX TODO CHANGEME!!
    document.head.appendChild(css);

    if ('jQuery' in window) {
      createInspector(window.jQuery);
    } else {
      // Add jQuery to the HEAD and then start polling to see when it is there
      var scr = document.createElement('script');
      scr.setAttribute('src','http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js');
      document.head.appendChild(scr);
      var t = setInterval(function() {
        if ('jQuery' in window) {
          clearInterval(t); // Stop polling 
          createInspector();
        }
      }, 50);
    }
})();
