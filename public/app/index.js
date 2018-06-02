var app = angular.module("app", ["ngRoute"])
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "static/html/home.html",
        controller: 'homeCtrl'
    })
    .when("/customers", {
        templateUrl : "static/html/customers.html",
        controller: 'customersCtrl'
    })
    .otherwise({redirectTo : '/'})
})

app.run(function($rootScope) { 
});

app.controller('customersCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        $(document).ready(function() {
            $('#datatable').dataTable()
            $('#datatable-keytable').DataTable({
                keys: true
            })
            $('#datatable-responsive').DataTable()
            $('#datatable-scroller').DataTable({
            ajax: "js/datatables/json/scroller-demo.json",
                deferRender: true,
                scrollY: 380,
                scrollCollapse: true,
                scroller: true
            })
            var table = $('#datatable-fixed-header').DataTable({
                fixedHeader: true
            })
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
