const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')

/* middleware
  - serveing static files
  - parse body that send with content-type is json
  - parse body that send with content-type is x-form
*/
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const connection = mysql.createConnection({
    host     : '127.0.0.1',
    port     : '3306',
    user     : 'root',
    password : '',
    database : 'customer_management_db',
    multipleStatements : true
})

const api_routes = express.Router()

const query_service = {
    account: {
        insert: function(account_id, account_first_name, account_last_name, account_email, account_phone, account_password, account_photo_path, account_address) {
            return "INSERT INTO `account` (`account_id`, `account_first_name`, `account_last_name`, `account_email`, `account_phone`, `account_password`, `account_photo_path`, `account_address`) VALUES ("+ account_id +", "+ account_first_name +", "+ account_last_name +", "+ account_email +", "+ account_phone +", "+ account_password +", "+ account_photo_path +", "+ account_address +");"
        }
    },
    customer: {
        select: function() {
            return "SELECT * FROM `goal`, business_detail, executive_profile, financial_information, main_business where main_business.business_id = financial_information.financial_information_id and main_business.business_id = executive_profile.executive_profile_id and main_business.business_id = business_detail.business_detail_id and main_business.business_id = business_detail.business_detail_id"
        },
        insert: function() {
            return "INSERT INTO main_business SET ?; INSERT INTO executive_profile SET ?; INSERT INTO `goal` SET ?; INSERT INTO business_detail SET ?; INSERT INTO financial_information SET ?;"
        }
    }
}

api_routes.post('/signin', function(req, res) {
    connection.query('SELECT * FROM account WHERE username = ' + req.body.username, function (err, rows, fields) {
        if (err) throw err
        res.json(rows)

        if (!rows.length) {
            res.json({ success: false, message: 'Authentication failed. User not found.' })
        } else {
            // check if password matches
            const account = rows[0]
            if (account.password != req.body.password) {
                res.json({ success: false, message: 'Authentication failed. Wrong password.' })
            } else {
                // create a token
                var token = jwt.sign(account, app.get('superSecret'), {
                    expiresIn: 1440 // expires in 24 hours
                })

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token.',
                    token: token
                })
            }
        }
    })
})

// route middleware to verify a token
api_routes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token']

    next()
    return

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
            return res.status(403).send({
                success: false,
                    message: 'Failed to authenticate token.'
                })
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded
                next()
            }
        })
    } else {
        // if there is no token
        // return an error
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
})

api_routes.get('/customers', function(req, res) {
    connection.query(query_service.customer.select(), function (err, rows, fields) {
        if (err) throw err
        res.json(rows)
    })
})

api_routes.post('/customers', function(req, res) {
    const data = req.body

    const goal = {
        goal_id: data.goal_id,
        goal_detail: data.goal_detail,
        goal_file_name: data.goal_file_name
    }

    const business_detail = {
        business_detail_id: data.business_detail_id,
        business_detail_pet_quantity: data.business_detail_pet_quantity,
        business_detail_meat_exchange_rate: data.business_detail_meat_exchange_rate,
        business_detail_sixness_rate: data.business_detail_sixness_rate,
        business_detail_cpf_product_usage_rate: data.business_detail_cpf_product_usage_rate,
        business_detail_other_product_usage_rate: data.business_detail_other_product_usage_rate,
        business_detail_sales_chanels_for_cpf: data.business_detail_sales_chanels_for_cpf,
        business_detail_sales_chanels_for_other: data.business_detail_sales_chanels_for_other,
        business_detail_number_of_workers: data.business_detail_number_of_workers,
        business_detail_competitor: data.business_detail_competitor,
        business_detail_market_condition_and_solutions: data.business_detail_market_condition_and_solutions,
        business_detail_mortality_rate: data.business_detail_mortality_rate,
        business_detail_file: data.business_detail_file
    }
    
    const executive_profile = {
        executive_profile_id: data.executive_profile_id,
        executive_profile_name: data.executive_profile_name,
        executive_profile_age: data.executive_profile_age,
        executive_profile_sex: data.executive_profile_sex,
        executive_profile_education: data.executive_profile_education,
        executive_profile_status: data.executive_profile_status,
        executive_profile_career: data.executive_profile_career,
        executive_profile_experience: data.executive_profile_experience,

        child_profile_name: data.child_profile_name,
        child_profile_age: data.child_profile_age,
        child_profile_sex: data.child_profile_sex,
        child_profile_career: data.child_profile_career,
        child_profile_experience: data.child_profile_experience,
        child_profile_education: data.child_profile_education,

        spouse_profile_name: data.spouse_profile_name,
        spouse_profile_age: data.spouse_profile_age,
        spouse_profile_education: data.spouse_profile_education,
        spouse_profile_career: data.spouse_profile_career,
        spouse_profile_experience: data.spouse_profile_experience
    }
    
    const financial_information = {
        financial_information_id: data.financial_information_id,
        financial_information_payment_history: data.financial_information_payment_history,
        financial_information_credit_from_cpf: data.financial_information_credit_from_cpf,
        financial_information_credit_from_competitor: data.financial_information_credit_from_competitor,
        financial_information_private_capital_rate: data.financial_information_private_capital_rate,
        financial_information_other_capital_rate: data.financial_information_other_capital_rate,
        financial_information_asset_land: data.financial_information_asset_land,
        financial_information_asset_car: data.financial_information_asset_car,
        financial_information_asset_other: data.financial_information_asset_other,
        financial_information_debt: data.financial_information_debt,
        financial_information_main_revenue: data.financial_information_main_revenue,
        financial_information_other_income: data.financial_information_other_income,
        financial_information_cpf_feed_purchase: data.financial_information_cpf_feed_purchase,
        financial_information_other_feed_purchase: data.financial_information_other_feed_purchase,
        financial_information_breeding_grounds: data.financial_information_breeding_grounds,
        financial_information_price_of_animals: data.financial_information_price_of_animals,
        financial_information_quantity_of_animals_purchase: data.financial_information_quantity_of_animals_purchase
    }

    const main_business = {
        business_id: data.business_id,
        business_name: data.business_name,
        business_grade: data.business_grade,
        business_address: data.business_address,
        business_type: data.business_type,
        business_telephone: data.business_telephone
    }

    connection.query(query_service.customer.insert(), [main_business, executive_profile, goal, business_detail, financial_information], function (err, rows, fields) {
        if (err) throw err
        res.status(200).send({
            success: true
        })
    })
})

api_routes.post('/file', function(req, res) {
    res.status(200).send({
        success: true
    })
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 5000

app.use('/api', api_routes)

app.listen(PORT, () => {
    console.log('Start server at port ' + PORT)
})
