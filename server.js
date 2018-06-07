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
    database : 'customer_management_db'
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
    // next()
    // return
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
    connection.query(query_service.customer.insert(), function (err, rows, fields) {
        if (err) throw err
        res.status(200)
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
