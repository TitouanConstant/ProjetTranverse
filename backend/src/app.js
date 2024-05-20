console.log('hello')

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const { sequelize} = require('./models')

const config = require('./config/config')

require('dotenv').config();

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

const passport = require('passport');
require('./passport');
app.use(passport.initialize());

require('./routes')(app)

app.get('/status', (req, res) => {
    res.send({
        message: 'hello world'
    })
})


sequelize.sync()
  .then(() => {
    app.listen(config.port)
    console.log(`Server started on port ${config.port}`)
  })

