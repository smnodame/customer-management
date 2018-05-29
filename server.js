const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')


/* middleware
  - serveing static files
  - parse body that send with content-type is json
  - parse body that send with content-type is x-form
*/
app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log('Start server at port ' + PORT)
})
