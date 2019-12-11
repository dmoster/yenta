const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')

const auth = require('./src/auth')
const user = require('./src/user')
const games = require('./src/games')
const matches = require('./src/matches')
const admin = require('./src/admin')

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use('/profile', verifyLogin)
app.use('/games', verifyLogin)
app.use('/addGame', verifyLogin)
app.use('/removeGame', verifyLogin)
app.use('/matches', verifyLogin)
app.use('/getMetrics', verifyLogin)
app.use('/admin', verifyLogin)
app.use('/admin', verifyAdmin)
app.use('/logout', verifyLogin)

app.get('/', (req, res) => res.render('pages/home'))
app.get('/about', (req, res) => res.render('pages/about'))
app.get('/profile', user.getProfile)
app.post('/updateBio', user.updateBio)
app.get('/games', games.displayGames)
app.get('/matches', matches.showAll)
app.get('/admin', admin.getAdminDashboard)
app.post('/addGame', user.addGame)
app.post('/removeGame', user.removeGame)
app.post('/getMetrics', matches.getMetrics)
app.post('/login', auth.logIn)
app.post('/logout', auth.logOut)

app.listen(app.get('port'), () => {
  console.log('App running on port', app.get('port'))
})


function verifyLogin(req, res, next) {
  if (req.session.user_id) {
    next()
  }
  else {
    console.log('User not logged in!')
    res.redirect('/')
  }
}

function verifyAdmin(req, res, next) {
  if (req.session.user_role === 'admin') {
    next()
  }
  else {
    console.log('Access denied!')
    res.redirect('/profile')
  }
}