var appTitan = angular.module('appTitan', ['ui.router']);

appTitan.config(function($stateProvider, $urlRouterProvider){ 
    $stateProvider
    
    .state('form', {
        url: '/form',
        templateUrl: '../views/sc-form-holder.html',
        controller: 'mainController'
    })
    .state('form.campaignType', {
        url: '/campaign-type',
        templateUrl: '../views/sc-select-campaign-type.html'
    })
    .state('form.stepOne', {
        url: '/step-one',
        templateUrl: '../views/sc-step-one.html'
    })
    .state('form.stepTwo', {
        url: '/step-two',
        templateUrl: '../views/sc-step-two.html'
    });
    
    $urlRouterProvider.otherwise('/form/campaign-type');
});

