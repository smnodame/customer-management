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

const apiRoutes = express.Router()

apiRoutes.get('/customers', function(req, res) {
  connection.query('SELECT * FROM `goal`, business_detail, executive_profile, financial_information, main_business where main_business.business_id = financial_information.financial_information_id and main_business.business_id = executive_profile.executive_profile_id and main_business.business_id = business_detail.business_detail_id and main_business.business_id = business_detail.business_detail_id', function (err, rows, fields) {
    if (err) throw err
    res.json(rows)
  })
})


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 5000

app.use('/api', apiRoutes)

app.listen(PORT, () => {
  console.log('Start server at port ' + PORT)
})
