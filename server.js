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
            question: String,
            answerOne: String,
            answerTwo: String,
            answerThree: String,
            answerFour: String
        }
    ]
});

var Campaign = mongoose.model('Campaign', campaignSchema);

//Routes
app.get('/startCampaign', function(req, res){
        res.sendfile('./public/views/start-campaign.html');
});

app.post('/api/postCampaign', function(req, res) {
     Campaign.create({
        campaignTitle: req.body.campaignTitle,
        goalAmount : req.body.goalAmount,
        done : false
    });
});

var Quiz = mongoose.model('Quiz', quizSchema);

app.post('/api/postQuiz', function(req, res) {
	console.log(req.body.questionAndAnswers.question);
    Quiz.create({
        title: req.body.title,
        category : req.body.category,
        questionAndAnswers : req.body.questionAndAnswers,
        done : false
    });
});


app.listen(port);
console.log('App listening on port' + port);

