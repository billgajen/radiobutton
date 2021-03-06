appTitan.controller('MainController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    'use strict';
    
    // Signup form
    $scope.form = 'signup';
    
    $scope.switchForm = function(newForm){
        $scope.form = newForm;

    };
    
    // Start camapaign
    $scope.startCampaignData = {};
    $scope.createCampaign = function(){
        $http.post('/api/postCampaign', $scope.startCampaignData)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
    
    // Create Quiz
	$scope.questions = [
		{
			questionName: 'Type question 1 here',
            answerOne: {
				value: '',
                isCorrect: '25092017735',
            },
            answerTwo: {
				value: '',
                isCorrect: '25092017400',
            },
            answerThree: {
				value: '',
                isCorrect: '25092017401',
            },
            answerFour: {
				value: '',
                isCorrect: '25092017403',
            }
 		}
	];
    $scope.startQuizData = {
		'title':'',
		'intro':'',
		'category':'',
		'questionAndAnswers': $scope.questions
	};

	$scope.addNewQuestion = function() {
		var newItemNo = $scope.questions.length+1;
		$scope.questions.push(
			{
				'questionName':'Type question '+newItemNo+ ' here',
				'answerOne': {
					'value': '',
					'isCorrect': '25092017735',
				},
				'answerTwo': {
					'value': '',
					'isCorrect': '25092017402',
				},
				'answerThree': {
					'value': '',
					'isCorrect': '25092017405',
				},
				'answerFour': {
					'value': '',
					'isCorrect': '25092017406',
				}
			}
		);
	};
	$scope.removeLastQuestion = function() {
		var lastItem = $scope.questions.length-1;
		$scope.questions.splice(lastItem);
	};

	$scope.createQuiz = function(){
         $http.post('/api/postQuiz', $scope.startQuizData)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
    //Get Quiz data
	$scope.userName = '';
    $scope.quizData = '';
	$scope.relatedQuizData = '';
	$scope.getQueryParams = function(name, url){
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	};
    $scope.qStringGPQ = $scope.getQueryParams('gpQ');
	
    $http.get('/api/getQuizData/'+$scope.qStringGPQ+'')
    .success(function(data) {
    	$scope.quizData = data;
    }).then(function(){
		$http.get('/api/getRelatedData/'+$scope.quizData.category+'')
		.success(function(data) {
			$scope.relatedQuizData = data;
		});
	});
	
	//Related Quiz Data
	
	//Generate scores
	$scope.chosenAnswersArr = [];
	$scope.totalCorrectAnswers = 0;
	$scope.shareImageLoc = '';
	
	//Get score
	$scope.showAnswers = function() {
		var total = 0;
		for(var i = 0; i < $scope.chosenAnswersArr.length; i++) {
			if ($scope.chosenAnswersArr[i].answerId == '25092017735') {
				total++;
			}
		}
		$scope.totalCorrectAnswers = total;
		html2canvas($('.score-card'), {
			onrendered: function(canvas) {
				var myImage = canvas.toDataURL("image/png");
				$scope.imageURI.uri = myImage;
				$scope.postCanvasImage($scope.imageURI);
			}
		
		});
		$scope.shareImageLoc = '/images/uploads/'+$scope.uniqueNum+'.png';
	};
	
	//Post image 
	$scope.date = new Date();
    $scope.uniqueNum = $scope.date.valueOf();
	$scope.url = $location.absUrl();
	$scope.standardUrl = $scope.url.split("&")[0];
	$scope.imageURI = {
		uri: '',
		fileName: $scope.uniqueNum
	};

	$scope.postCanvasImage = function(imageUri){
        $http.post('/api/postCanvasImage', imageUri)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	$scope.postSocialData = function(){
        $http.post('/api/socialRich', $scope.imageURI)
            .success(function(data) {
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };
	
}]);

appTitan.directive('questionsAnswers', function($timeout) {
	return {
		restrict: 'E',
		templateUrl: '/js/directives/questionsAnswers.html',
		replace: true,
		scope: {
			questions: '=',
			chosenAnswersArr: '=',
            index: '=',
            height: '='
		},
		link: function(scope, element, attrs) {
			scope.chosenAnswers = function(selection, index) {
                var found = false;
                for(var i=0; !!(element=scope.chosenAnswersArr[i]); i++) {
                    if(element.questionId == scope.index) {
                        found = true;
                        scope.chosenAnswersArr[i]= {questionId: scope.index, answerId: selection};
                    }
                }
                if(found === false) {
                    scope.chosenAnswersArr.push({questionId: scope.index, answerId: selection});
                }
 			};            
		}
	};
});