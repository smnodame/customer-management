var app = angular.module("app", ["ngRoute"])
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "static/html/home.html",
        controller: 'homeCtrl'
    })
    .otherwise({redirectTo : '/'})
})

app.run(function($rootScope) { 
});

app.controller('homeCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $scope.step = 1

        $scope.click_next = () => {
            $scope.step = $scope.step + 1
        }

        $scope.click_previous = () => {
            $scope.step = $scope.step - 1
        }
    }
])
