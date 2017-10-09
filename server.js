var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var base64ImageToFile = require('base64image-to-file');
var port = process.env.PORT || 3000;

//Mongoose Promise
mongoose.Promise = Promise;
//Database connection
mongoose.connect(process.env.MONGOLAB_URI);

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/dist'));
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(morgan('dev'));

// Jade Template Engine
app.set('view engine', 'jade');

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

//Post data
var Quiz = mongoose.model('Quiz', quizSchema);

//Creating text index for search - Indexing the Entire Document
Quiz.collection.createIndex({"$**":"text"});

//Routes
app.get('/', function(req, res){
	res.sendFile(__dirname + '/public/views/start-campaign.html');
});

// View Quiz page
app.get('/viewQuiz', function(req, res){
    res.sendFile(__dirname + '/public/views/view-quiz.html');
	
	var imageName = req.query.shareId;
	// Redirect social media(FB & Twitter) crawler
	var userAgent = req.headers['user-agent'];
    if (userAgent.startsWith('facebookexternalhit/1.1') || userAgent.startsWith('Twitterbot')) {
		return res.redirect('/socialRich/'+imageName+'');
    }
});

app.get('/socialRich/:imageName', function(req, res){
    res.render('social-rich',{
		socialImage: 'https://kwikwiz.herokuapp.com/images/uploads/'+req.params.imageName+'.png',
		title: 'Super G Test'
	});
});

// Post Quiz
app.post('/api/postQuiz', function(req, res) {
    Quiz.create({
        title: req.body.title,
        intro: req.body.intro,
        category : req.body.category,
        questionAndAnswers : req.body.questionAndAnswers,
        done : false
    });
});

// Upload image
app.post('/api/postCanvasImage', function(req, res) {
	base64ImageToFile(req.body.uri, './public/images/uploads/', req.body.fileName, function(err) {
		if(err) {
		  return console.error(err);
		}
	});
});

//Get quiz data
var ObjectId = require('mongodb').ObjectID;

app.get('/api/getQuizData/:qId', function(req, res){

	Quiz.find({_id:ObjectId(req.params.qId)}, function(err, quiz) {
		if (err) throw err;

		// Quiz objects
		res.json(quiz[0]);
	});
});

//Get related quiz
app.get('/api/getRelatedData/:category', function(req, res){

	Quiz.find({category:req.params.category}).sort({createdAt: -1}).exec(function(err, quiz) {
		if (err) throw err;

		// All related quiz objects
		res.json(quiz);
	});
});

//Site Search
app.get('/search/:keywords', function(req, res){

	Quiz.find({"$text": {"$search": req.params.keywords}}, {score:{ $meta: "textScore" }}).sort({score:{$meta: "textScore"}}).exec(function(err, results) {
		if (err) throw err;

		// All related quiz objects
		res.json(results);
	});
});

app.listen(port);
console.log('App listening on port' + port);

