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
	$scope.questions = [{questionName: 'Type question 1 here'}];
    $scope.startQuizData = {
		'title':'',
		'intro':'',
		'category':'',
		'questionAndAnswers': $scope.questions
	};

	$scope.addNewQuestion = function() {
		var newItemNo = $scope.questions.length+1;
		$scope.questions.push({'questionName':'Type question '+newItemNo+ ' here'});
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