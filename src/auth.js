const bcrypt = require('bcrypt')
const saltRounds = 10

const { pool } = require('./db')


const logIn = (req, res) => {
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


function verifyUser(username, password, callback) {
  console.log('Checking for user: ' + username)

  const sql = "SELECT id, username, password, bio, role FROM users WHERE username = $1"

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


function setSession(err, result, req, res) {
  if (err || result == null || result.length != 1) {
    res.status(500).send('There was an error with your login.')
  }
  else {
    user = result[0]

    req.session.user_id = user.id
    req.session.username = user.username
    req.session.bio = user.bio || 'Please <strong>click</strong> or <strong>double-tap</strong> here to enter a bio'
    req.session.user_role = user.role

    res.redirect('/profile')
  }
}


const logOut = (req, res) => {
  console.log('Logging out user', req.session.username)
  req.session.destroy()
  res.redirect('/')
}


exports.logIn = logIn
exports.logOut = logOut