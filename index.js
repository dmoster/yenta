// const express = require('express')
// const path = require('path')
// const PORT = process.env.PORT || 5000

// express()
//   .use(express.static(path.join(__dirname, 'public')))
//   .set('views', path.join(__dirname, 'views'))
//   .set('view engine', 'ejs')
//   .get('/', (req, res) => res.render('pages/index'))
//   .post('/profile', (req, res) => {
//     const loginType = req.query.loginType
//     console.log(loginType)
//     if (loginType == 'login') {
//       res.render('pages/profile')
//     }
//     else if (loginType === 'signup') {
//       res.render('pages/profile')
//     }
//   })
//   .listen(PORT, () => console.log(`Listening on ${ PORT }`))


const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10

const { Pool } = require('pg')
const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString: connectionString })

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.render('pages/index'))
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

    res.status(200).render('pages/profile', {
      username: username,
      email: email,
      password: password
    })
  }
}

function verifyUser(username, password, callback) {
  console.log('Checking for user: ' + username)

  const sql = "SELECT username, password FROM users WHERE username = $1 AND password = $2"

  const params = [username, password]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)
      callback(err, null)
    }

    console.log('Found result!')

    callback(null, result.rows)
  })
}