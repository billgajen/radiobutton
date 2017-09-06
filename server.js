var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;

//Database connection
mongoose.connect('mongodb://billgajen:Bmangal238#@cluster0-shard-00-00-00kih.mongodb.net:27017,cluster0-shard-00-01-00kih.mongodb.net:27017,cluster0-shard-00-02-00kih.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

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
    Tags: String,
    questionAndAnswers: [
        {
            question: String,
            answerOne: String,
            answerTwo: String,
            answerThree: String,
            answerFour: String
        }
    ],
});

var Campaign = mongoose.model('Campaign', campaignSchema);

//Routes
app.get('/startCampaign', function(req, res){
        res.sendfile('./public/views/start-campaign.html');
});

app.post('/api/postCamoaign', function(req, res) {

    Campaign.create({
        goalAmount : req.body.goalAmount,
        campaignTitle: req.body.campaignTitle,
        done : false

    });
});


app.listen(port);
console.log('App listening on port' + port);

