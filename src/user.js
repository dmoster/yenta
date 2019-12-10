const { pool } = require('./db')
const { getMatches, updateMatches } = require('./matches')


const getProfile = (req, res) => {
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


const updateBio = (req, res) => {
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

      req.session.bio = req.body.newBio
      res.send(req.body.newBio)
    }

  })
}


const getUserGames = (req, res, callback) => {
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


const addGame = (req, res) => {
  console.log('Adding game...')

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

      updateMatches(req)
      res.send({ success: true })
    }
  })
}


const removeGame = (req, res) => {
  console.log('Removing game...')

  const sql = "DELETE FROM user_metrics WHERE user_id = $1 AND game_id = $2"

  const params = [req.session.user_id, req.body.game_id]

  pool.query(sql, params, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)

      res.send({ success: false })
    }
    else {
      const newSql = "DELETE FROM matches WHERE (user_id = $1 OR match_id = $1) AND game_id = $2"

      pool.query(newSql, params, (err, result) => {
        if (err) {
          console.log('Error in query: ')
          console.log(err)

          res.send({ success: false })
        }
        else {
          console.log('Game removed!')

          res.send({ success: true })
        }
      })
    }
  })
}


exports.getProfile = getProfile
exports.updateBio = updateBio
exports.addGame = addGame
exports.removeGame = removeGame
exports.getUserGames = getUserGames