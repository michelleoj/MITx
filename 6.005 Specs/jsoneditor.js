$(document).ready(function() {
    
    function submit() {
        var jsonThing = {};
        jsonThing['specs'] = {}
        $('.specs div').each(function () {
            var name = $(this).find('.name').val();
            jsonThing['specs'][name] = {};
            
            if ($(this).find('.contains').val() !== "") {
                jsonThing['specs'][name]['contains'] = $(this).find('.contains').val().split(/[\s,]+/);
            }
            else {
                jsonThing['specs'][name]['contains'] = [];
            }
            
            if ($(this).find('.intersects').val() !== "") {
                jsonThing['specs'][name]['intersects'] = $(this).find('.intersects').val().split(/[\s,]+/);
            }
            else {
                jsonThing['specs'][name]['intersects'] = [];
            }
            
            jsonThing['specs'][name]['text'] = $(this).find('textarea').val();
            
        });
        
        jsonThing['imple'] = {};
        jsonThing['imple']['name'] = $('.imple').find('input').val();
        jsonThing['imple']['text'] = $('.imple').find('textarea').val();
        
        $("#result").text(JSON.stringify(jsonThing));
    
    }
    
    var counter = 1; 

    function addSpec() {
        console.log("here");
        counter += 1; 
        var spec = $("<div style='margin-right: 5px;' class='spec" + counter +  "'><span><input class='name' style='width:78px; margin-right: 4px;' type='text' placeholder='Spec name...'><input class='intersects' style='width:78px; margin-right: 4px;' type='text' placeholder='Intersections'><input class='contains' style='width:78px' type='text' placeholder='Contains'></span><br><textarea class='input-xlarge' rows='4' placeholder='Enter spec...'></textarea><br><br></div>");
        $(".specs").append(spec);
        console.log(counter);
    }
    
        
    function decSpec() {
        var str = ".spec" + counter;
        var elem = $(".spec" + counter).remove();
        counter -= 1;
        
        
    }
    
    $(".add").on('click', addSpec);
    $(".dec").on('click', decSpec);
    $("button[type='submit']").on('click', submit);
});