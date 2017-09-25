var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

//Mongoose Promise
mongoose.Promise = Promise;
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
var quizSchema = new Schema({
    title: String,
    intro: String,
    category: String,
    questionAndAnswers: [
        {
            questionName: String,
            answerOne: {
				value: String,
				isCorrect: String
			},
            answerTwo: {
				value: String,
				isCorrect: String
			},
            answerThree: {
				value: String,
				isCorrect: String
			},
            answerFour: {
				value: String,
				isCorrect: String
			}
        }
    ]
}, {
    timestamps: true
});

//Routes
app.get('/startCampaign', function(req, res){
	res.sendFile(__dirname + '/public/views/start-campaign.html');
});

app.get('/viewQuiz', function(req, res){
    res.sendFile(__dirname + '/public/views/campaign.html');
});

//Post data
var Quiz = mongoose.model('Quiz', quizSchema);

app.post('/api/postQuiz', function(req, res) {
    Quiz.create({
        title: req.body.title,
        intro: req.body.intro,
        category : req.body.category,
        questionAndAnswers : req.body.questionAndAnswers,
        done : false
    });
});

//Get data
var ObjectId = require('mongodb').ObjectID;

app.get('/api/getQuizData/:qId', function(req, res){
	console.log(req);
	Quiz.find({_id:ObjectId(req.params.qId)}, function(err, quiz) {
	  if (err) throw err;

	  // Quiz objects
	  res.json(quiz[0]);
	});
});


app.listen(port);
console.log('App listening on port' + port);

