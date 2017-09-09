var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

//Database connection
mongoose.connect('mongodb://billgajen:Bmangal238#@ds127864.mlab.com:27864/radioquiz');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));

//Database Schema / Model
var Schema = mongoose.Schema;

// Create a Schema
var campaignSchema = new Schema({
    goalAmount: String,
    campaignTitle: String
});

// Create a Schema
var quizSchema = new Schema({
    title: String,
    category: String,
    questionAndAnswers: [
        {
            questionName: String,
            answerOne: String,
            answerTwo: String,
            answerThree: String,
            answerFour: String
        }
    ]
});

//Routes
app.get('/startCampaign', function(req, res){
        res.sendFile(__dirname + '/public/views/start-campaign.html');
});
var quizId = null;
app.get('/viewQuiz', function(req, res){
    res.sendFile(__dirname + '/public/views/campaign.html');
    var quizId = req.query.gpQ;
});
console.log(quizId);
//Post data
var Quiz = mongoose.model('Quiz', quizSchema);

app.post('/api/postQuiz', function(req, res) {
    Quiz.create({
        title: req.body.title,
        category : req.body.category,
        questionAndAnswers : req.body.questionAndAnswers,
        done : false
    });
});

//Get data
var ObjectId = require('mongodb').ObjectID;

app.get('/api/getQuizData', function(req, res){
	Quiz.find({_id:ObjectId("59b2ac3cfc2283480879025c")}, function(err, quiz) {
	  if (err) throw err;

	  // object of the user
	  res.json(quiz[0]);
	});
});


app.listen(port);
console.log('App listening on port' + port);

