const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const jwt = require('jsonwebtoken')
const mysql = require('mysql')
const pdf = require('html-pdf')
const multer  = require('multer')
const morgan = require('morgan')

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, './public/files')
	},
	filename: function(req, file, callback) {
        console.log(req.body)
		callback(null, req.body.filename)
	}
})

app.use(morgan('combined'))

const upload  = multer({ storage: storage })
app.set('superSecret', 'supersecret') // secret variable

//nunjucks templating 
const nunjucks = require('nunjucks')

// Nunjucks is a product from Mozilla and we are using it as a template engine.
nunjucks.configure('public', {
    autoescape: true,
    express: app
})

/* middleware
  - serveing static files
  - parse body that send with content-type is json
  - parse body that send with content-type is x-form
*/
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// const db_config = {
//     host     : 'smnodame.com',
//     port     : '3306',
//     user     : 'smnodameco_cpf',
//     password : 'secret',
//     database : 'smnodameco_cpf',
//     multipleStatements : true,
//     charset: "utf8_general_ci"
// }

const db_config = {
    host     : 'localhost',
    port     : '3306',
    user     : 'root',
    password : '',
    database : 'customer_management_db',
    multipleStatements : true,
    charset: "utf8_general_ci"
}

var connection = null

function handleDisconnect() {
    connection = mysql.createConnection(db_config)
    connection.connect(function(err) {
        if (err) {
            console.log('error when connecting to db:', err)
            setTimeout(handleDisconnect, 2000)
        }
        console.log("Connected!")
        connection.query("SET NAMES utf8")

        setInterval(function () {
            console.log('- connect -')
            connection.query('SELECT 1')
        }, 30000)
    })

    connection.on('error', function(err) {
        console.log('db error', err)
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {   // Connection to the MySQL server is usually
            handleDisconnect()                          // lost due to either server restart, or a
        } else {                                        // connnection idle timeout (the wait_timeout
            throw err                                   // server variable configures this)
        }
    })
}

handleDisconnect()

const get_account = (data) => {
    res = {
        account_id: data.account_id,
        account_position: data.account_position,
        account_phone: data.account_phone,
        account_email: data.account_email,
        account_last_name: data.account_last_name,
        account_first_name: data.account_first_name,
        account_photo_path: data.account_photo_path,
        business_customer_type: data.business_customer_type,
        account_updated: new Date()
    }
    if(data.account_password) {
        res.account_password = data.account_password
    } else {
        delete res.account_password
    }
    return res
}

const get_groups = (data) => {
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
        business_region: data.business_region,
        business_type: data.business_type,
        business_telephone: data.business_telephone,
        business_logo_file: data.business_logo_file,
        business_customer_type: data.business_customer_type,
        updated_date: new Date()
    }

    return {
        goal: goal,
        business_detail: business_detail,
        executive_profile: executive_profile,
        financial_information: financial_information,
        main_business: main_business
    }
}

const api_routes = express.Router()

const query_service = {
    account: {
        insert: function(account) {
            return "INSERT INTO `account` SET ? "
        },
        update: function(account) {
            return "UPDATE `account` SET ? WHERE account_id = '" + account.account_id + "'"
        }
    },
    customer: {
        select: function(query) {
            return "SELECT * FROM financial_information, main_business, `goal`, business_detail, executive_profile where main_business.business_id = financial_information.financial_information_id and `goal`.`goal_id` = main_business.business_id and business_detail.business_detail_id = main_business.business_id and executive_profile.executive_profile_id = main_business.business_id and business_id != ''"+ query
        },
        select_belonger: function(query) {
            return "SELECT * FROM (SELECT account_id, business_id as group_business_id FROM user_group) as user_group, financial_information, main_business, `goal`, business_detail, executive_profile where user_group.group_business_id = main_business.business_id and main_business.business_id = financial_information.financial_information_id and `goal`.`goal_id` = main_business.business_id and business_detail.business_detail_id = main_business.business_id and executive_profile.executive_profile_id = main_business.business_id and business_id != ''"+ query
        },
        insert: function() {
            return "INSERT INTO main_business SET ?; INSERT INTO executive_profile SET ?; INSERT INTO `goal` SET ?; INSERT INTO business_detail SET ?; INSERT INTO financial_information SET ?;"
        },
        delete: function(business_id) {
            var query = ''
            query += "DELETE FROM `main_business` WHERE business_id = '" + business_id + "';"
            query += "DELETE FROM `financial_information` WHERE financial_information_id = '" + business_id + "';"
            query += "DELETE FROM `executive_profile` WHERE executive_profile_id = '" + business_id + "';"
            query += "DELETE FROM `business_detail` WHERE business_detail_id = '" + business_id + "';"
            query += "DELETE FROM `goal` WHERE goal_id = '" + business_id + "';"
            return query
        },
        update: function(business_id) {
            return "UPDATE main_business SET ? WHERE business_id = '" + business_id + "'; UPDATE executive_profile SET ? WHERE executive_profile_id = '" + business_id + "'; UPDATE `goal` SET ? WHERE goal_id = '" + business_id + "'; UPDATE business_detail SET ? WHERE business_detail_id = '" + business_id + "'; UPDATE financial_information SET ? WHERE financial_information_id = '" + business_id + "';"
        }
    },
    group: {
        select: function(account_id) {
            return "SELECT * FROM `user_group` u join `main_business` m on u.business_id = m.business_id WHERE u.account_id = '" + account_id + "'"
        },
        select_permission: function(account_id, business_id) {
            return "SELECT * FROM `user_group`  WHERE account_id = '" + account_id + "' AND business_id = '"+ business_id +"'";
        }
    },
    user_group: {
        select: function(business_id) {
            return "SELECT u.user_group_id, a.`account_id`, a.`account_first_name`, a.`account_last_name`, a.`account_email`, a.`account_phone`, a.`account_photo_path`, a.`account_position`, a.`account_updated` FROM `user_group` u join `account` a on u.account_id = a.account_id WHERE u.business_id = '" + business_id + "'"
        },
        insert: function() {
            return " INSERT INTO user_group (`account_id`, `business_id`) VALUES ? ;"
        },
        delete: function(account_id) {
            return "DELETE FROM `user_group` WHERE account_id = '" + account_id + "';"
        },
        delete_by_lists: function(business_id) {
            return "DELETE FROM `user_group` WHERE business_id = '" + business_id + "' AND account_id IN (?);"
        }
    },
    child: {
        select: function(business_id) {
            return "SELECT * FROM `child` where child_profile_id = '"+ business_id +"'";
        },
        select_all: function() {
            return "SELECT * FROM `child`";
        },
        insert: function() {
            return "INSERT INTO `child` SET ?"
        },
        delete: function(business_id) {
            return "DELETE FROM `child` where child_profile_id = '"+ business_id +"'";
        }
    }
}

api_routes.post('/signin', function(req, res) {
    try {
        const data = {
            account_email: req.body.username
        }
        connection.query('SELECT * FROM account WHERE ? ', data, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            if (!rows.length) {
                res.json({ success: false, message: 'Authentication failed. User not found.' })
            } else {
                // check if password matches
                const account = rows[0]
                
                if (account.account_password != req.body.password) {
                    res.json({ success: false, message: 'Authentication failed. Wrong password.' })
                } else {
                    delete account.account_password

                    // create a token
                    var token = jwt.sign(account, app.get('superSecret'), {
                        expiresIn: 60 * 60 * 24, // expires in 24 hours
                    })
                    
                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token.',
                        token: token,
                        data: account
                    })
                }
            }
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

// route middleware to verify a token
api_routes.use(function(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token']

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

// middleware for doing role-based permissions
function permit_group() {
    // return a middleware
    return (req, res, next) => {
        if(req.decoded.account_position == 'admin') {
            next()
        } else {
            connection.query(query_service.group.select_permission(req.decoded.account_id, req.params.id), function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                if(rows.length == 0) {
                    res.status(403).json({message: "Forbidden"}); // user is forbidden
                } else {
                    next()
                }
            })
        }
    }
    
}

api_routes.get('/customers', function(req, res) {
    var query = []
    if(req.query.query) {
        var quety_text = ' ( '

        quety_text = quety_text + ` business_id LIKE '%${req.query.query}%' OR `
        quety_text = quety_text + ` business_name LIKE '%${req.query.query}%' OR `
        quety_text = quety_text + ` business_address LIKE '%${req.query.query}%' OR `
        quety_text = quety_text + ` business_telephone LIKE '%${req.query.query}%' OR `
        quety_text = quety_text + ` executive_profile_name LIKE '%${req.query.query}%' OR `
        quety_text = quety_text + ` goal_detail LIKE '%${req.query.query}%' `
        quety_text = quety_text + ' ) '

        query.push(quety_text)
    }
    if(req.query.business_type) {
        query.push(` business_type = '${req.query.business_type}' `)
    }
    if(req.query.business_region) {
        query.push(` business_region = '${req.query.business_region}'`)
    }
    if(req.query.business_grade) {
        query.push(` business_grade = '${req.query.business_grade}' `)
    }
    if(req.query.amount_of_pets_min) {
        query.push(` business_detail_pet_quantity >= ${req.query.amount_of_pets_min} `)
    }
    if(req.query.amount_of_pets_max) {
        query.push(` business_detail_pet_quantity <= ${req.query.amount_of_pets_max} `)
    }
    /** is not superuser */
    if(req.decoded.account_position != 'admin') {
        query.push(` account_id = '${req.decoded.account_id}' `)
    }

    if(query.length) {
        query[0] = ' AND ' + query[0]
    }

    if(req.decoded.account_position == 'admin') {
        try {
            connection.query(query_service.customer.select(query.join(' AND ')), function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.json(rows)
            })
        } catch (err) {
            console.log(err)
            if(err) { res.status(500).send({ success: false }); return }
        }
    } else {
        try {
            connection.query(query_service.customer.select_belonger(query.join(' AND ')), function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.json(rows)
            })
        } catch (err) {
            console.log(err)
            if(err) { res.status(500).send({ success: false }); return }
        }
    }
})

api_routes.get('/customers/:id', permit_group(), function(req, res) {
    try {
        connection.query(query_service.customer.select(` AND business_id = '${req.params.id}'`), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.json(rows)
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.delete('/customers/:id', function(req, res) {
    try {
        connection.query(query_service.customer.delete(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.put('/customers/:id', function(req, res) {
    try {
        const data = req.body
        const groups = get_groups(data)
        const insert = req.body.user_ids.insert.map(function(id) {
            return [id, req.body.business_id]
        })
        // initail query
        var query = query_service.customer.update(req.params.id)
        var args = [groups.main_business, groups.executive_profile, groups.goal, groups.business_detail, groups.financial_information]
        
        if(insert.length != 0) {
            query = query + query_service.user_group.insert()
            args.push(insert)
        }
        if(req.body.user_ids.delete.length != 0) {
            query = query + query_service.user_group.delete_by_lists(req.body.business_id)
            args.push(req.body.user_ids.delete)
        }
        connection.query(query, args, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.post('/customers', function(req, res) {
    try {
        const groups = get_groups(req.body)
        const data = req.body.users.map(function(user) {
            return [user.account_id, req.body.business_id]
        })
        if(data.length == 0) {
            connection.query(query_service.customer.insert(), 
            [groups.main_business, groups.executive_profile, groups.goal, groups.business_detail, groups.financial_information],
            function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.status(200).send({
                    success: true
                })
            })
        } else {
            connection.query(query_service.customer.insert() + query_service.user_group.insert(), 
            [groups.main_business, groups.executive_profile, groups.goal, groups.business_detail, groups.financial_information, data],
            function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.status(200).send({
                    success: true
                })
            })
        }
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.post('/file', function(req, res) {
    res.status(200).send({
        success: true
    })
})

api_routes.post('/account', function(req, res) {
    try {
        const data = req.body
        const account = get_account(data)

        connection.query(query_service.account.insert(account), account, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.put('/account/:id', function(req, res) {
    try {
        const data = req.body
        const account = get_account(data)

        connection.query(query_service.account.update(account), account, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/check-customer-id', function(req, res) {
    try {
        const data = {
            business_id: req.query.business_id
        }
        connection.query('SELECT * FROM  main_business where ?', data, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                is_used: !!rows.length
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/check-account-id', function(req, res) {
    try {
        const data = {
            account_email: req.query.account_email
        }
        connection.query('SELECT * FROM  account where ?', data, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                is_used: !!rows.length
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/account', function(req, res) {
    try {
        connection.query('SELECT `account_id`, `account_first_name`, `account_last_name`, `account_email`, `account_phone`, `account_photo_path`, `account_position`, `account_updated` FROM  account', function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                account: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/account/:id', function(req, res) {
    try {
        const data = {
            account_id: req.params.id
        }
        connection.query('SELECT `account_id`, `account_first_name`, `account_last_name`, `account_email`, `account_phone`, `account_photo_path`, `account_position`, `account_updated` FROM  account where ?', data, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                account: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.delete('/account/:id', function(req, res) {
    try {
        const data = {
            account_id: req.params.id
        }
        connection.query('DELETE FROM `account` where ?', data, function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                account: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/group/:id', function(req, res) {
    try {
        connection.query(query_service.group.select(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                groups: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.post('/user_group/:id', function(req, res) {
    try {
        if(req.body.groups.length == 0) {
            res.status(200).send({
                success: true
            })
        } else {
            const data = req.body.groups.map(function(group) {
                return [req.params.id, group.business_id]
            })
            connection.query(query_service.user_group.insert(), [data],  function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.status(200).send({
                    success: true
                })
            })
        }
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.delete('/user_group/:id', function(req, res) {
    try {
        connection.query(query_service.user_group.delete(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/user_group/:id', function(req, res) {
    try {
        connection.query(query_service.user_group.select(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                account: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/child/:id', function(req, res) {
    try {
        connection.query(query_service.child.select(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true,
                childs: rows
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.post('/child', function(req, res) {
    try {
        if(req.body.child.length==0) {
            res.status(200).send({
                success: true
            })
        } else {
            var query = []
            req.body.child.forEach(function() {
                query.push(query_service.child.insert())
            })
            connection.query(query.join(';'), req.body.child, function (err, rows, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                res.status(200).send({
                    success: true
                })
            })
        }
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.delete('/child/:id', function(req, res) {
    try {
        connection.query(query_service.child.delete(req.params.id), function (err, rows, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            res.status(200).send({
                success: true
            })
        })
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/pdf/:id/', permit_group(),function (req, res) {
    try {
        connection.query(query_service.customer.select(` AND business_id = '${req.params.id}';` + query_service.child.select(req.params.id)), function (err, results, fields) {
            if (err) { res.status(500).send({ success: false }); return }
            
            if(results[0].length != 0) {
                var details = results[0]
                details[0].childs = results[1]
                var renderedHtml =  nunjucks.render('nunjucks.tmpl.html', {
                    results: details,
                    sex_matched: {
                        male: 'ชาย',
                        female: 'หญิง'
                    },
                    status_matched: {
                        single: 'โสด',
                        engaged: 'หมั่น',
                        maried: 'แต่งงาน',
                        divorce: 'อย่า'
                    }
                })
                pdf.create(renderedHtml, { "border": "5mm"}).toStream(function(err, stream){
                    stream.pipe(res)
                })
            } else {
                console.log(err)
                if(err) { res.status(404).send({ success: false }); return }
            }
        })
        
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.get('/pdf', function (req, res) {
    try {
        var query = []
        if(req.query.query) {
            var quety_text = ' ( '

            quety_text = quety_text + ` business_id LIKE '%${req.query.query}%' OR `
            quety_text = quety_text + ` business_name LIKE '%${req.query.query}%' OR `
            quety_text = quety_text + ` business_address LIKE '%${req.query.query}%' OR `
            quety_text = quety_text + ` business_telephone LIKE '%${req.query.query}%' OR `
            quety_text = quety_text + ` executive_profile_name LIKE '%${req.query.query}%' OR `
            quety_text = quety_text + ` goal_detail LIKE '%${req.query.query}%' `
            quety_text = quety_text + ' ) '

            query.push(quety_text)
        }
        if(req.query.business_type) {
            query.push(` business_type = '${req.query.business_type}' `)
        }
        if(req.query.business_region) {
            query.push(` business_region = '${req.query.business_region}'`)
        }
        if(req.query.business_grade) {
            query.push(` business_grade = '${req.query.business_grade}' `)
        }
        if(req.query.amount_of_pets_min) {
            query.push(` business_detail_pet_quantity >= ${req.query.amount_of_pets_min} `)
        }
        if(req.query.amount_of_pets_max) {
            query.push(` business_detail_pet_quantity <= ${req.query.amount_of_pets_max} `)
        }
        /** is not superuser */
        if(req.decoded.account_position != 'admin') {
            query.push(` account_id = '${req.decoded.account_id}' `)
        }

        if(query.length) {
            query[0] = ' AND ' + query[0]
        }

        if(req.decoded.account_position == 'admin') {
        
            connection.query(query_service.customer.select(query.join(' AND ')) + ';' + query_service.child.select_all(), function (err, results, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                if(results[0].length != 0) {
                    var renderedHtml =  nunjucks.render('nunjucks.tmpl.html', {
                        results: results[0].map(function (detail) {
                            detail.childs = results[1].filter(function (child) {
                                return child.child_profile_id == detail.business_id
                            })
                            return detail
                        }),
                        sex_matched: {
                            male: 'ชาย',
                            female: 'หญิง'
                        },
                        status_matched: {
                            single: 'โสด',
                            engaged: 'หมั่น',
                            maried: 'แต่งงาน',
                            divorce: 'อย่า'
                        },
                        childs: []
                    })
                    pdf.create(renderedHtml, { "border": "5mm"}).toStream(function(err, stream){
                        stream.pipe(res)
                    })
                } else {
                    console.log(err)
                    if(err) { res.status(404).send({ success: false }); return }
                }
            })
       
        } else {
            connection.query(query_service.customer.select_belonger(query.join(' AND ')) + ';' + query_service.child.select_all(), function (err, results, fields) {
                if (err) { res.status(500).send({ success: false }); return }
                if(results[0].length != 0) {
                    var renderedHtml =  nunjucks.render('nunjucks.tmpl.html', {
                        results: results[0].map(function (detail) {
                            detail.childs = results[1].filter(function (child) {
                                return child.child_profile_id == detail.business_id
                            })
                            return detail
                        }),
                        sex_matched: {
                            male: 'ชาย',
                            female: 'หญิง'
                        },
                        status_matched: {
                            single: 'โสด',
                            engaged: 'หมั่น',
                            maried: 'แต่งงาน',
                            divorce: 'อย่า'
                        }
                    })
                    pdf.create(renderedHtml, { "border": "5mm"}).toStream(function(err, stream){
                        stream.pipe(res)
                    })
                } else {
                    console.log(err)
                    if(err) { res.status(404).send({ success: false }); return }
                }
            })
        }
    } catch (err) {
        console.log(err)
        if(err) { res.status(500).send({ success: false }); return }
    }
})

api_routes.post('/upload', upload.single('fileupload'), (req, res) => {  
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
