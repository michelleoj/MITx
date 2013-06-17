
var quiz = (function () {
    var exports = {};
    
    var questions = [{"questionText": "Sam thinks y=2x is going to ___ as x goes from 1 to 10.",
                      "options": ["increases", "decreases", "goes up then down", "goes down then up"],
                      "solutionIndex": 0},
                     {"questionText": "Jill thinks y=2x-5 is going to ___ as x goes from 1 to 10.",
                     "options": ["increases", "decreases", "goes up then down", "goes down then up"],
                    "solutionIndex": 0 }];
        
    var answers = []; //answers from the students
    
    var score = 0; // score of the student
    
    var currentQuestionIndex = 0; //index of the current question we are on
            
    //input: takes in a question index and a student's answers
    //output: true if answer is correct
    function checkAnswer(ans) {
        question = questions[currentQuestionIndex];
        return question.options[question.solutionIndex] == ans;
    }

    function getAnswers() {
        // currentQuestionIndex
        
        var selectedAns = $('input[name=choice' + currentQuestionIndex + ']:checked').val();
        
        if (checkAnswer(selectedAns)) {
            $('.feedback').text("You got it right!");
            incrementScore();

        }
        else {
            $('.feedback').text("You got it wrong.");
        }
        
    }
    
    // displays current quiz question to the student
    function displayQuestion() {
        
        Parse.initialize("0jRewsUD1w7pYEbS0TSiiiNg7UMcME2xJYWm7ksS", "gCc4btwsNjrb3BDvvFN3ZPqxQxfWibK3GcZmQu9D");
        var TestObject = Parse.Object.extend("TestObject");
        var testObject = new TestObject();
        testObject.save({foo: "bar"}, {
          success: function(object) {
            alert("yay! it worked");
          }
        });
        
        var question = $("<div></div>", {class: 'question'});
        var questionObj = questions[currentQuestionIndex];
        var text = $("<div class='questionText'></div>").append((currentQuestionIndex+1), ". ", questionObj.questionText);
       
        question.append(text);
        

        //display answer options
        var options = $("<div></div>", {class: 'options'});
        for (var i = 0; i < questionObj.options.length; i++) {
            var option = $("<div></div>", {class: 'option'});
            var radio = $("<input>", {type: "radio", 
                                      name: "choice" + currentQuestionIndex, 
                                      value: questionObj.options[i]}); 
            option.append(radio, " ", questionObj.options[i]);
            options.append(option);
        }
        
        var answerFeedback = $("<div></div>", {class: 'feedback'});
        var checkAns = $("<button></button>", {class: 'check',
                                              text: "Check Answer"});
        var spacing = $("<br>");
            checkAns.on("click", getAnswers);
    
            $(".quiz").append(question, options, checkAns, answerFeedback, spacing);
    }

    //Called when a student gets a question right
    function incrementScore() {
        score++;   
    }

    function setup() {
        displayQuestion();
    }

    exports.setup = setup;
    return exports;
    
    
})();

$(document).ready(function() {
    quiz.setup();
});