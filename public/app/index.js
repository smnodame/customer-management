var app = angular.module("app", ["ngRoute", "angular-file-input"])
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
    .when("/customer/:id/edit", {
        templateUrl: "static/html/customerEdit.html",
        controller: 'editCustomerInfoCtrl'
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

app.controller('editCustomerInfoCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams', '$http',
    function($scope, $location, $route, $rootScope, $routeParams, $http) {
        $scope.step = 1
        $scope.done = 5
        let default_business_id

        $http.get(`/api/customers/${$routeParams.id}`).then((res) => {
            $scope.detail = res.data[0]
            default_business_id = res.data[0].business_id

            $scope.detail.business_detail_pet_quantity = parseInt(res.data[0].business_detail_pet_quantity)
            $scope.detail.business_detail_meat_exchange_rate =  parseInt(res.data[0].business_detail_meat_exchange_rate)
            $scope.detail.business_detail_sixness_rate =  parseInt(res.data[0].business_detail_sixness_rate)
            $scope.detail.business_detail_mortality_rate =  parseInt(res.data[0].business_detail_mortality_rate)
            $scope.detail.business_detail_cpf_product_usage_rate =  parseInt(res.data[0].business_detail_cpf_product_usage_rate)
            $scope.detail.business_detail_other_product_usage_rate =  parseInt(res.data[0].business_detail_other_product_usage_rate)
            $scope.detail.business_detail_number_of_workers =  parseInt(res.data[0].business_detail_number_of_workers)

            $scope.detail.financial_information_private_capital_rate =  parseInt(res.data[0].financial_information_private_capital_rate)
            $scope.detail.financial_information_other_capital_rate =  parseInt(res.data[0].financial_information_other_capital_rate)
        }) 

        const next_step = () => {
            $scope.step = $scope.step + 1
            window.scrollTo(0, 0)

            if($scope.step > $scope.done) {
                $scope.done = $scope.step
            }
        }

        $scope.click_next = () => {
            if($scope.step == 1) {
                if($scope.check_form_valid()) {
                    if(default_business_id == $scope.detail.business_id) {
                        $scope.error = ''
                        next_step()
                    } else {
                        $http.get('/api/check-customer-id?business_id=' + $scope.detail.business_id, $scope.detail).then((res) => {
                            $scope.error = res.data.is_used? 'รหัสลูกค้าถูกใช้เเล้ว': ''
                            if(!$scope.error) next_step()
                        })
                    }
                } else {
                    $scope.error = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
                    return
                }
            } else if ($scope.step < 5) {
                next_step()
            }
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

        const get_type_file = (filename) => {
            const arr = filename.split('.')
            return arr[arr.length - 1]
        }

        $scope.on_create = () => {
            $scope.detail.goal_id = $scope.detail.business_detail_id = $scope.detail.executive_profile_id = $scope.detail.financial_information_id = $scope.detail.business_id
            
            $http.put(`/api/customers/${$routeParams.id}`, $scope.detail).then(() => {
                window.location.href = '/#!/customer/' + $scope.detail.business_id
            })
        }
    }
])

app.controller('customerInfoCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams', '$http',
    function($scope, $location, $route, $rootScope, $routeParams, $http) {
        $scope.tab_index = 1
        $scope.change_tab = (tab_index) => {
            $scope.tab_index = tab_index
            $(document).ready(function() {
                $('#datatable-responsive').DataTable()
            })
        }

        $scope.redirect_to_edit = () => {
            window.location.href = '/#!/customer/' + $scope.detail.business_id + '/edit'
        }

        $http.get(`/api/customers/${$routeParams.id}`).then((res) => {
            $scope.detail = res.data[0]
        })

        $scope.sex_matched = {
            male: 'ชาย',
            female: 'หญิง'
        }

        $scope.status_matched = {
            single: 'โสด',
            engaged: 'หมั่น',
            maried: 'แต่งงาน',
            divorce: 'อย่า'
        }

        $scope.message_with_percent = (message) => {
            return message? `${message} %` : ``
        }
    }
])

app.controller('customersCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams', '$http', '$compile',
    function($scope, $location, $route, $rootScope, $routeParams, $http, $compile) {
        const tables = $('#datatable-responsive').DataTable()

        $scope.on_delete_customer = (business_id) => {
            $http.delete(`/api/customers/${business_id}`).then(() => {
                get_customers()
            })
        }

        const get_customers = () => {
            tables.clear()
            .draw()

            return $http.get(`/api/customers?query=${$scope.query}&business_type=${$scope.business_type}&business_grade=${$scope.business_grade}&amount_of_pets_min=${$scope.amount_of_pets_min}&amount_of_pets_max=${$scope.amount_of_pets_max}`).then((res) => {
                res.data.forEach((customer) => {
                    tables.row.add( [
                        customer.business_id,
                        customer.business_name,
                        customer.business_grade,
                        customer.business_type,
                        customer.business_telephone,
                        customer.executive_profile_name,
                        customer.business_detail_pet_quantity,
                        '<a href="/#!/customer/'+customer.business_id+'" class="btn btn-primary btn-xs"><i class="fa fa-folder"></i> View </a>'+
                        '<a href="/#!/customer/'+customer.business_id+'/edit" class="btn btn-info btn-xs"><i class="fa fa-pencil"></i> Edit </a>'+
                        `<a ng-click="on_delete_customer('${customer.business_id}')" class="btn btn-danger btn-xs"><i class="fa fa-trash-o"></i> Delete </a>`
                    ]).draw( true )
                })

                var compileFn = $compile(angular.element(document.getElementById("datatable-responsive")))
                compileFn($scope)
            })
        }  

        $scope.init_query = () => {
            $scope.query = ''
            $scope.business_type = ''
            $scope.business_grade = ''
            $scope.amount_of_pets_min = ''
            $scope.amount_of_pets_max = ''

            get_customers()
        }

        $scope.init_query()

        $scope.on_search = () => {
            get_customers()
        }
    }
])

app.controller('homeCtrl', [
    '$scope', '$location', '$route', '$rootScope', '$routeParams', '$http',
    function($scope, $location, $route, $rootScope, $routeParams, $http) {
        $scope.step = 1
        $scope.done = 1

        const next_step = () => {
            $scope.step = $scope.step + 1
            window.scrollTo(0, 0)

            if($scope.step > $scope.done) {
                $scope.done = $scope.step
            }
        }

        $scope.click_next = () => {
            if($scope.step == 1) {
                if($scope.check_form_valid()) {
                    $http.get('/api/check-customer-id?business_id=' + $scope.detail.business_id, $scope.detail).then((res) => {
                        $scope.error = res.data.is_used? 'รหัสลูกค้าถูกใช้เเล้ว': ''
                        if(!$scope.error) next_step()
                    })
                } else {
                    $scope.error = 'กรุณากรอกข้อมูลให้ครบทุกช่อง'
                    return
                }
            } else if ($scope.step < 5) {
                next_step()
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

        const get_type_file = (filename) => {
            const arr = filename.split('.')
            return arr[arr.length - 1]
        }

        $scope.on_create = () => {
            $scope.detail.goal_id = $scope.detail.business_detail_id = $scope.detail.executive_profile_id = $scope.detail.financial_information_id = $scope.detail.business_id
            
            if($scope.detail.business_detail_file) {
                const file = $scope.detail.business_detail_file
                const file_name = `goal-${$scope.detail.goal_id}.${get_type_file($scope.detail.business_detail_file.name)}`
                $scope.detail.business_detail_file = file_name

                const formData = new FormData()
                formData.append('file', file)
                formData.append('file_name', file_name)
                
                fetch('/api/file', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', response))
            }

            if($scope.detail.goal_file_name) {
                const file = $scope.detail.goal_file_name
                const file_name = `goal-${$scope.detail.goal_id}.${get_type_file($scope.detail.goal_file_name.name)}`
                $scope.detail.goal_file_name = file_name

                const formData = new FormData()
                formData.append('file', file)
                formData.append('file_name', file_name)
                
                fetch('/api/file', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .catch(error => console.error('Error:', error))
                .then(response => console.log('Success:', response))
            }

            $http.post('/api/customers', $scope.detail).then(() => {
                window.location.href = '/#!/customer/' + $scope.detail.business_id
            })
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
