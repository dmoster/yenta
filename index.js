const express = require('express')
const app = express()
const session = require('express-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10

const { Pool } = require('pg')
// BEFORE COMMIT: Remove alternate
const connectionString = process.env.DATABASE_URL || 'postgres://qezuaezksgohlm:a966bad868a94a25c5b4c986001f6dc5415fe236f0cb3a816e295229c11a0b9c@ec2-107-21-98-89.compute-1.amazonaws.com:5432/dqmg3u7e4g6l8?ssl=true'
const pool = new Pool({ connectionString: connectionString })

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: 'b7jms-7jtb7ctc-a7jb&s-7fb', //process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))
app.use('/profile', verifyLogin)
app.use('/games', verifyLogin)
app.use('/addGame', verifyLogin)
app.use('/logout', verifyLogin)

app.get('/', (req, res) => res.render('pages/index'))
app.get('/about', (req, res) => res.render('pages/about'))
app.get('/profile', getProfile)
app.get('/games', displayGames)
app.post('/addgame', addGame)
app.post('/login', logIn)
app.post('/logout', logOut)
app.post('/updateBio', updateBio)

app.listen(app.get('port'), () => {
  console.log('App running on port', app.get('port'))
})


function getProfile(req, res) {
  getUserGames(req, res, (err, result) => {
    if (err || result == null || result.length < 1) {
      result = []
    }
    res.status(200).render('pages/profile', {
      username: req.session.username,
      bio: req.session.bio,
      games: result
    })
  })
  
}

function getUserGames(req, res, callback) {
  console.log('Getting user game list...')

  const sql = "SELECT games.id, games.title FROM games INNER JOIN user_metrics ON games.id = user_metrics.game_id WHERE user_metrics.user_id = $1"

  const params = [req.session.user_id]

  pool.query(sql, params, (err, res) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)
      callback(err, null)
    }

    console.log('Sending list to profile...')
    
    getMatches(req, res, (err, result) => {
      if (err || result == null || result.length < 1) {
        result = []
      }
      callback(null, res.rows)
    })
  })
}

function getMatches(req, res, callback) {
  console.log('Getting matches...')
  
  const sql = "SELECT matches.game_id, users.match_id, users.username, users.discord_username FROM users INNER JOIN matches ON users.match_id = matches.match_id WHERE matches.user_id = $1"
  
  const params = [req.session.user_id]
  
  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('No matches found')
      console.log(err)
      callback(null, res.rows)
    }
    else {
      console.log('Matches found!')
      
      res.rows.forEach(game => {
        result.rows.forEach(match => {
          if (game.id === match.game_id) {
            if (game.matches === undefined) {
              game.matches = []
            }
            game.matches.push(match)
          }
        })
      })
      callback(null, res.rows)
    }
  })
}

function displayGames(req, res) {
  getPopular((err, result) => {
    if (err || result == null || result.length < 1) {
      res.status(500).send('Something went wrong retrieving the games. Please try again later.')
    }
    else {
      res.status(200).render('pages/games', {
        games: result
      })
    }
  })
}

function setSession(err, result, req, res) {
  if (err || result == null || result.length != 1) {
    res.status(500).send('There was an error with your login.')
  }
  else {
    user = result[0]

    req.session.user_id = user.id
    req.session.username = user.username
    req.session.bio = user.bio || 'Please <strong>click</strong> or <strong>double-tap</strong> here to enter a bio'

    res.redirect('/profile')
  }
}

function getPopular(callback) {
  console.log('Getting popular games...')

  const sql = "SELECT * FROM games"

  pool.query(sql, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)
      callback(err, null)
    }

    console.log('Targets acquired')
    callback(null, result.rows)
  })
}

function logIn(req, res) {
  const loginType = req.body.loginType
  const username = req.body.username
  const password = req.body.password
  let user

  if (loginType === 'login') {
    verifyUser(username, password, (err, result) => {
      setSession(err, result, req, res)
    })
  }
  else if (loginType === 'signup') {
    const email = req.body.email

    addUser(username, password, email, (err, result) => {
      setSession(err, result, req, res)
    })
  }
}

function verifyUser(username, password, callback) {
  console.log('Checking for user: ' + username)

  const sql = "SELECT username, password, bio, id FROM users WHERE username = $1"

  const params = [username]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)
      callback(err, null)
    }

    console.log('Found result!')
    const hash = result.rows[0].password

    if (bcrypt.compareSync(password, hash)) {
      callback(null, result.rows)
    }
  })
}

function addUser(username, password, email, callback) {

  console.log('Adding to database...')

  const sql = "INSERT INTO users (username, password, email) VALUES ($1, $2, $3)"

  const hash = bcrypt.hashSync(password, saltRounds)
  const params = [username, hash, email]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Could not add user to database')
      console.log(err)
      callback(err, null)
    }

    console.log('Added successfully!')

    verifyUser(username, password, callback)
  })
}

function updateBio(req, res) {
  console.log('Updating bio...')

  const sql = "UPDATE users SET bio = $2 WHERE id = $1"

  const params = [req.session.user_id, req.body.newBio]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)

      res.send({ success: false })
    }
    else {
      console.log('Bio updated!')

      res.send(req.body.newBio)
    }

  })
}

function addGame(req, res) {
  console.log('Adding game...')
  console.log(req.body.game_id)

  const sql = "INSERT INTO user_metrics (user_id, game_id, casual_competitive, short_long, partner_team, strategic_gunblazer, learn_lead, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)"

  const params = [
    req.session.user_id,
    req.body.game_id,
    req.body.casual_competitive,
    req.body.short_long,
    req.body.partner_team,
    req.body.strategic_gunblazer,
    req.body.learn_lead,
    req.body.comment
  ]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)

      res.send({ success: false })
    }
    else {
      console.log('Game added!')

      res.send({ success: true })
    }
  })
}

function logOut(req, res) {
  console.log('Logging out user', req.session.username)
  req.session.destroy()
  res.redirect('/')
}

function verifyLogin(req, res, next) {
  if (req.session.user_id) {
    next()
  }
  else {
    console.log('User not logged in!')
    res.redirect('/')
  }
}