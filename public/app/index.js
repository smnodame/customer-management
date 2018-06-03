var app = angular.module("app", ["ngRoute"])
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "static/html/home.html",
        controller: 'homeCtrl'
    })
    .when("/customer", {
        templateUrl : "static/html/customers.html",
        controller: 'customersCtrl'
    })
    .when("/customer/:id", {
        templateUrl : "static/html/customerInfo.html",
        controller: 'customerInfoCtrl'
    })
    .when("/user", {
        templateUrl : 'static/html/user.html',
        controller: 'userCtrl'
    })
    .otherwise({redirectTo : '/'})
})

app.run(function($rootScope) { 
})

app.controller('userCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $('#datatable-responsive').DataTable({
            iDisplayLength: 100
        })
    }
])

app.controller('customerInfoCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $scope.tab_index = 1
        $scope.change_tab = (tab_index) => {
            $scope.tab_index = tab_index
            $(document).ready(function() {
                $('#datatable-responsive').DataTable()
            })
        }
    }
])

app.controller('customersCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $(document).ready(function() {
            $('#datatable-responsive').DataTable()
        })
    }
])

app.controller('homeCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $scope.step = 1
        $scope.done = 1
        $scope.click_next = () => {
            if($scope.step < 5) {
                $scope.step = $scope.step + 1
                window.scrollTo(0, 0)

                if($scope.step > $scope.done) {
                    $scope.done = $scope.step
                }
            }
        }

        $scope.click_previous = () => {
            if($scope.step > 1) {
                $scope.step = $scope.step - 1   
                window.scrollTo(0, 0)             
            }
        }

        $scope.go_to_step = (step) => {
            if(step <= $scope.done) {
                $scope.step = step
                window.scrollTo(0, 0)                
            }
        }
    }
])
