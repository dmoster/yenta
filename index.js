const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10

const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL || '***REMOVED***'
const pool = new Pool({ connectionString: connectionString })

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.render('pages/index'))
app.get('/about', (req, res) => res.render('pages/about'))
app.post('/profile', logIn)

app.listen(app.get('port'), () => {
  console.log('App running on port', app.get('port'))
})

function logIn(req, res) {
  const loginType = req.body.loginType
  const username = req.body.username
  const password = req.body.password

  if (loginType === 'login') {
    verifyUser(username, password, (err, result) => {
      if (err || result == null || result.length != 1) {
        res.status(500).send('There was an error with your login.')
      }
      else {
        const user = result[0]
        bio = user.bio || 'Please enter a bio'
        res.status(200).render('pages/profile', {
          username: user.username,
          bio: user.bio
        })
      }
    })
  }
  else if (loginType === 'signup') {
    const email = req.body.email

    addUser(username, password, email, (err, result) => {
      if (err || result == null || result.length != 1) {
        err ? console.log('Error: ' + err) : console.log('Result: ')
        res.status(500).send('There was an error with your login.')
      }
      else {
        const user = result[0]
        const bio = user.bio || 'Please enter a bio'
        res.status(200).render('pages/profile', {
          username: user.username,
          bio: bio
        })
      }
    })
  }
}

function verifyUser(username, password, callback) {
  console.log('Checking for user: ' + username)

  const sql = "SELECT username, password, bio FROM users WHERE username = $1"

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