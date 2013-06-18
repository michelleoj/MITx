var sys = require("sys"),  
my_http = require("http");  
var question;
var answer;
var curIndex;

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

my_http.createServer(function(request,response){  
    sys.puts("I got kicked");  
    response.writeHeader(200, {"Content-Type": "text/plain",
                               'Access-Control-Allow-Origin': '*'});   
    var url = require('url');
    var queryString = url.parse(request.url, true).query;
    question = queryString.ques;
    answer = queryString.ans;
    curIndex = queryString.index;
    var results = checkAnswer(answer);
    response.write(String(results));
    response.end();  
}).listen(8080);  
sys.puts("Server Running on 8080");   

//input: takes in a question index and a student's answers
//output: true if answer is correct
function checkAnswer(answer) {
    question = questions[curIndex];
    console.log("my ans: ", answer);
    console.log("correct ans: ", question.options[question.solutionIndex]); 
    return question.options[question.solutionIndex] == answer;

}
