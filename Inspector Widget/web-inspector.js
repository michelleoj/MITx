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
    + "      <input class='selector' /><input class='nth' />"
    + "      <button>Search</button>"
    + "    </div>"
    + "    <div class='property-list'>"
    + "      <p class='info'>Hi</p>"
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
      var selection = $(selectorStr);
      var html = selection.html();
      var textEditor = root.find(".text-editor");
      textEditor.val(html);
      console.log("Here first");
      propertyInfo();
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
    
  function propertyInfo() {
        console.log("I made it!");
        var info = "";
        var selectorBox = root.find(".selector");
        var selectorStr = selectorBox.val();
        var selection = $(selectorStr);
        var propertyBox = root.find(".info");
        var selectionSize = "Width: " + selection.css("width") + ", " + "Height: " +                   selection.css("height") + "\n";
        var selectionPos = "Top: " + selection.css("top") + ", Left: " + selection.css("left")+ "\n";
        var selectionSpacing = "Margin: " + selection.css("margin") + ", Padding: " + selection.css("padding")+ "\n";
        var selectionBgFgColor = "Background Color: " + selection.css("background-color") + ", Foreground Color: " + selection.css("foreground-color")+ "\n";
        var selectionTag = "Tag: " + selection.prop("tagName")+ "\n";
        var numOfChildren = "# of Children: " + String(selection.contents().length);
        info.append(selectionSize, selectionPos, selectionSpacing, selectionBgFgColor, selectionTag, numOfChildren);
        var properties = propertyBox.val(info);
        console.log("I finished!");    
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
