function setup(div) {
    var vennDiagrams = $('<div class="vennDiagrams"></div>');
    var specsDisplay = $('<div class="specsDisplay"></div>');
    var impleDisplay = $('<div class="impleDisplay"></div>');
    var checkDisplay = $('<div class="checkDisplay"></div>');
    
    div.append(vennDiagrams, specsDisplay, checkDisplay, impleDisplay);
}

$(document).ready(function () {
    $('.6005specs').each(function () {
        setup($(this));
    });
});