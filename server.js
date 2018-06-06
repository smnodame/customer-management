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

var connection = mysql.createConnection({
  host     : '127.0.0.1',
  port     : '3306',
  user     : 'root',
  password : '',
  database : 'customer_management_db'
})

connection.connect()

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) {
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Start server at port ' + PORT)
})
