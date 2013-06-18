
var quiz = (function () {
    var exports = {};
    
    //initialize Parse
    
    Parse.initialize("0jRewsUD1w7pYEbS0TSiiiNg7UMcME2xJYWm7ksS", "gCc4btwsNjrb3BDvvFN3ZPqxQxfWibK3GcZmQu9D");
    var s = Parse.Object.extend("Student");
    var student = new s();
    //s.save();
    
    var local = false;
    var score = 0;
    var curIndex = 0;
    
    var questions = [{"questionText": "Sam thinks y=2x is going to ___ as x goes from 1 to 10.",
                      "options": ["increases", "decreases", "goes up then down", "goes down then up"],
                      "solutionIndex": 0},
                     
                     {"questionText": "Jill thinks y=2x-5 is going to ___ as x goes from 1 to 10.",
                     "options": ["increases", "decreases", "goes up then down", "goes down then up"],
                    "solutionIndex": 0 },
                     
                     {"questionText": "What year is it?",
                     "options": ["2016", "2009", "2013", "2001"],
                     "solutionIndex": 2 },
                    
                     {"questionText": "How many years are in a score?",
                     "options": ["10", "15", "5", "20"],
                     "solutionIndex": 3},
                    
                     {"questionText": "What is Kanye West's new album name?",
                     "options": ["Jesus", "Yeezus", "Kingdom Come", "Kim"],
                     "solutionIndex": 1}];
    
    
     
    function localOrParse(bool) {
        local = bool;
    }
            
    //input: takes in a question index and a student's answers
    //output: true if answer is correct
    function checkAnswer(ans) {
        var question = questions[curIndex];
        return question.options[question.solutionIndex] == ans;
        
        //will format it so that it just reads what the server says
    }

    function getAnswers() {
        // currentQuestionIndex
        
        var question = questions[curIndex];
        var selectedAns = $('input[name=choice' + curIndex + ']:checked').val();
        
        sendRequest(question.questionText, selectedAns, curIndex);
        
    }
    
    function nextQuestions() {
        var questionDiv = $(".quiz");
            questionDiv.empty();
            incrementIndex();
            if (curIndex < questions.length) {
                displayQuestion();
            }
            else {
                questionDiv.append("Your score is ", score*10, "!");
                questionDiv.append(" You received a ", parseFloat((score*10)/50)*100, "%");
                if (local) {
                    localStorage.clear();
                }
                else {
                    student.destroy({
                        success: function(student) {
                            console.log("finished it");
                      }});  
                }
            }
            
        
    }
    
    // displays current quiz question to the student
    function displayQuestion() {
                    
        var question = $("<div></div>", {class: 'question'});
        var questionObj = questions[curIndex];
        var text = $("<div class='questionText'></div>").append((curIndex+1), ". ", questionObj.questionText);
       
        question.append(text);
        

        //display answer options
        var options = $("<div></div>", {class: 'options'});
        for (var i = 0; i < questionObj.options.length; i++) {
            var option = $("<div></div>", {class: 'option'});
            var radio = $("<input>", {type: "radio", 
                                      name: "choice" + curIndex, 
                                      value: questionObj.options[i]}); 
            option.append(radio, " ", questionObj.options[i]);
            options.append(option);
        }
        
        var answerFeedback = $("<span></span>", {class: 'feedback'});
        var checkAns = $("<button></button>", {class: 'check',
                                              text: "Check Answer"});
        var nextQuestion = $("<div></div>", {class: 'nextQ'});
        var next = $("<button></button>", {class: 'next', text: 'next'});
        
        checkAns.on("click", getAnswers);
        
        next.on("click", nextQuestions);
        nextQuestion.append(next);
    
        $(".quiz").append(question, options, checkAns, answerFeedback, nextQuestion);
    }

    //Called when a student gets a question right
    function incrementScore() {
        if(local) {
            localStorage.score++;
            score = localStorage.score;    
        }
        else {
            student.set("score", score+1);
            student.save();
            score = student.get("score");
        }
            
    }
    
    function sendRequest(ques, ans, index) {
        var boolean;
        var req = $.ajax({
        url: "http://localhost:8080/",
        data: {ques: ques, ans: ans, index: index}
        });
        req.done(function(msg) {
            console.log("i'm here");
            boolean = parseBool(msg);
            processResponse(boolean);
        });
        
    }

    function parseBool(str) {
        if (str == "false") {
            return false;
        }
        else {
            return true;
        }
    }
    
    function processResponse(bool) {
        if (bool) { 
            $('.feedback').html("<text>&nbsp &nbsp &nbsp You got it right!</text>");
            incrementScore();

        }
        else {
            $('.feedback').html("<text>&nbsp &nbsp &nbsp You got it wrong.</text>");
        }
    }
    
    function incrementIndex() {
        if(local) {
            localStorage.currentQuestionIndex++; 
            curIndex = localStorage.currentQuestionIndex; 
        } 
        else {
            student.set("curIndex", curIndex+1); 
            student.save();
            curIndex = student.get("curIndex");
        }
        console.log("current index: ", curIndex);
    }

    function setup() {
        if(local) {
        if(!("score" in localStorage)) {
            localStorage.score = 0;
            score = localStorage.score;
        }// score of the student
        
        if(!("currentQuestion" in localStorage)) {
            localStorage.currentQuestionIndex = 0; 
            curIndex = localStorage.currentQuestionIndex; 
        } //index of the current question we are on
       
    }
    else {
        //get data from parse
        //if data is empty then create a new record on parse
        
        var query = new Parse.Query(s);
        query.find({
            success:function(list) {
                if (list.length === 0) {
                    student.set("score", 0);
                    student.set("curIndex", 0);
                    student.save();
                }
                else {
                    student = list[0];
                }
            
                score = student.get("score");
                curIndex = student.get("curIndex");
            }
            
        });
        
        
    }
        displayQuestion();
    }

    exports.setup = setup;
    exports.localOrParse = localOrParse;
    exports.sendRequest = sendRequest;
    return exports;
    
    
})();

$(document).ready(function() {
    quiz.setup();

    
});