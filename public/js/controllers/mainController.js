appTitan.controller('mainController', ['$scope', '$http', '$location', function($scope, $http, $location){
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
    $scope.quizData = '';
    $scope.qStringGPQ = $location.search().gpQ;
    $http.get('/api/getQuizData/'+$scope.qStringGPQ+'')
    .success(function(data) {
    	$scope.quizData = data;
    })
    .catch(function(errRes) {
      // Handle errRess
    });
}]);