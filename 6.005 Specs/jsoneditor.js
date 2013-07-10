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
        
        jsonThing['imples'] = {};
        $('.imple div').each(function() {
            var name = $(this).find('.name').val();
            jsonThing['imples'][name] = {};
            jsonThing['imples'][name]['text'] = $(this).find('textarea').val();
        });
        
        $("#result").text(JSON.stringify(jsonThing));
        
    }
    
    var counterspec = 1; 
    var counterimple = 1;

    function addSpec() {
        console.log("here");
        counterspec += 1; 
        var spec = $("<div style='margin-right: 5px;' class='spec" + counterspec +  "'><span><input class='name' style='width:78px; margin-right: 4px;' type='text' placeholder='Spec name...'><input class='intersects' style='width:78px; margin-right: 4px;' type='text' placeholder='Intersections'><input class='contains' style='width:78px' type='text' placeholder='Contains'></span><br><textarea class='input-xlarge' rows='4' placeholder='Enter spec...'></textarea><br><br></div>");
        $(".specs").append(spec);
    }
    
        
    function decSpec() {
        $(".spec" + counterspec).remove();
        counterspec -= 1;
        
        
    }
    
    function addImple() {
        counterimple += 1;
        var imple = $('<div class="imple' + counterimple + '">' +
                    '<input class="name span6" type="text" placeholder="Implementation name..."><br>' +
                    '<textarea class="span6" style="height: 200px" placeholder="Enter implementation"></textarea>' +
                '</div>');
        $(".imple").append(imple);     
    }
    
    function decImple() {
        $(".imple" + counterimple).remove();
        counterimple -= 1;  
    }
    
    $(".add").on('click', addSpec);
    $(".dec").on('click', decSpec);
    
    $(".addi").on('click', addImple);
    $(".deci").on('click', decImple);
    $("button[type='submit']").on('click', submit);
});