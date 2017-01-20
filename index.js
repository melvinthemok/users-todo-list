const express = require('express')
const app = express()
const path = require('path')
const ejsLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const user = require('./routes/user_router')
const todo = require('./routes/todo_router')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('./config/ppConfig')
const isLoggedIn = require('./middleware/isLoggedIn')
require('dotenv').config({ silent: true })

mongoose.connect('mongodb://localhost/myapp')
mongoose.Promise = global.Promise

app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use(morgan('dev'))

app.use(methodOverride('_method'))

app.use(bodyParser.urlencoded({ extended: false }))

app.use(ejsLayouts)

app.use(function (req, res, next) {
  // EJS in every view rendered has access to these references
  res.locals.alerts = req.flash()
  res.locals.currentUser = req.user
  next()
})

// app.use('/', (req, res) => {
//   res.send('Welcome to your to-dos')
// })
// app.use('/'... will mean that the code below will never be read!

app.get('/', function (req, res) {
  res.render('index')
})

app.use('/auth', user)

app.use('/todo', todo)

// app.get('/profile', isLoggedIn, function (req, res) {
//   res.render('profile')
// })
//
app.listen(process.env.PORT || 3000, function () {
  console.log('Server listening on port 3000')
})
