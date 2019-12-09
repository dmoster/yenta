const { pool } = require('./db')


const getMatches = (req, res, callback) => {
  console.log('Getting matches...')

  const sql = "SELECT matches.game_id, users.match_id, users.username, users.discord_username FROM users INNER JOIN matches ON users.match_id = matches.match_id WHERE matches.user_id = $1 OR matches.match_id = $1"

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


const updateMatches = (req) => {
  console.log('Updating matches...')

  
}


exports.getMatches = getMatches
exports.updateMatches = updateMatches