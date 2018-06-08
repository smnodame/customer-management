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
    .when("/user/create", {
        templateUrl : 'static/html/userCreate.html',
        controller: 'userCreateCtrl'
    })
    .otherwise({redirectTo : '/'})
})

app.run(function($rootScope) { 
})


app.controller('userCreateCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams',
    function($scope, $location, $route, $rootScope, $routeParams) {
        
    }
])

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
            if($scope.step == 1) {
                if($scope.check_form_valid()) {
                    $scope.error = ''
                } else {
                    $scope.error = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
                    return
                }
            }
            if($scope.step < 5) {
                $scope.step = $scope.step + 1
                window.scrollTo(0, 0)

                if($scope.step > $scope.done) {
                    $scope.done = $scope.step
                }
            }
            console.log('========')
            console.log($scope.detail)
        }

        $scope.check_form_valid = () => {
            return $scope.detail.business_id && $scope.detail.business_name && $scope.detail.business_address && $scope.detail.business_telephone
        }

        $scope.can_save = () => {
            return $scope.check_form_valid() && $scope.done == 5
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

        $scope.on_create = () => {
            $scope.detail.goal_id = $scope.detail.business_detail_id = $scope.detail.executive_profile_id = $scope.detail.financial_information_id = $scope.detail.business_id
        }

        $scope.detail = {
            goal_id: '',
            goal_detail: '',
            goal_file_name: '',

            business_detail_id: '',
            business_detail_pet_quantity: '',
            business_detail_meat_exchange_rate: '',
            business_detail_sixness_rate: '',
            business_detail_cpf_product_usage_rate: '',
            business_detail_other_product_usage_rate: '',
            business_detail_sales_chanels_for_cpf: '',
            business_detail_sales_chanels_for_other: '',
            business_detail_number_of_workers: '',
            business_detail_competitor: '',
            business_detail_market_condition_and_solutions: '',
            business_detail_mortality_rate: '',
            business_detail_file: '',
            
            executive_profile_id: '',
            executive_profile_name: '',
            executive_profile_age: '',
            executive_profile_sex: 'male',
            executive_profile_education: '',
            executive_profile_status: 'single',
            executive_profile_career: '',
            executive_profile_experience: '',

            child_profile_name: '',
            child_profile_age: '',
            child_profile_sex: 'male',
            child_profile_career: '',
            child_profile_experience: '',
            child_profile_education: '',

            spouse_profile_name: '',
            spouse_profile_age: '',
            spouse_profile_education: '',
            spouse_profile_career: '',
            spouse_profile_experience: '',

            
            financial_information_id: '',
            financial_information_payment_history: '',
            financial_information_credit_from_cpf: '',
            financial_information_credit_from_competitor: '',
            financial_information_private_capital_rate: '',
            financial_information_other_capital_rate: '',
            financial_information_asset_land: '',
            financial_information_asset_car: '',
            financial_information_asset_other: '',
            financial_information_debt: '',
            financial_information_main_revenue: '',
            financial_information_other_income: '',
            financial_information_cpf_feed_purchase: '',
            financial_information_other_feed_purchase: '',
            financial_information_breeding_grounds: '',
            financial_information_price_of_animals: '',
            financial_information_quantity_of_animals_purchase: '',

            business_id: '',
            business_name: '',
            business_grade: 'bronze',
            business_address: '',
            business_type: 'นิติบุคคล',
            business_telephone: ''
        }
    }
])
