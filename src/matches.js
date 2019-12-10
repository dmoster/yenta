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

  const user_id = req.session.user_id
  const metrics = {
    game_id: req.body.game_id,
    casual_competitive: req.body.casual_competitive,
    short_long: req.body.short_long,
    partner_team: req.body.partner_team,
    strategic_gunblazer: req.body.strategic_gunblazer,
    learn_lead: req.body.learn_lead,
  }

  const sql = "SELECT user_id, game_id, casual_competitive, short_long, partner_team, strategic_gunblazer, learn_lead FROM user_metrics WHERE game_id = $1"

  const params = [metrics.game_id]

  pool.query(sql, params, (err, result) => {
    if (err || result.length < 1) {
      console.log('No one appears to be looking for matches for this game')
      console.log(err)
    }
    else {
      console.log('Matches found!')

      result.rows.forEach(potentialMatch => {
        if (potentialMatch.user_id !== user_id) {
          let matchRating = 0

          if (potentialMatch.casual_competitive >= metrics.casual_competitive - 1 &&
              potentialMatch.casual_competitive <= metrics.casual_competitive + 1) {
            ++matchRating
          }
          if (potentialMatch.short_long >= metrics.short_long - 1 &&
              potentialMatch.short_long <= metrics.short_long + 1) {
            ++matchRating
          }
          if (potentialMatch.partner_team >= metrics.partner_team - 1 &&
              potentialMatch.partner_team <= metrics.partner_team + 1) {
            ++matchRating
          }
          if (potentialMatch.strategic_gunblazer >= metrics.strategic_gunblazer - 1 &&
              potentialMatch.strategic_gunblazer <= metrics.strategic_gunblazer + 1) {
            ++matchRating
          }
          if (potentialMatch.learn_lead >= metrics.learn_lead - 1 &&
              potentialMatch.learn_lead <= metrics.learn_lead + 1) {
            ++matchRating
          }

          if (matchRating >= 4) {
            console.log('Adding match...')

            const sql = "INSERT INTO matches (user_id, match_id, game_id) VALUES ($1, $2, $3)"

            const newParams = [user_id, potentialMatch.user_id, metrics.game_id]

            pool.query(sql, newParams, (err, res) => {
              if (err || res.length < 1) {
                console.log('Could not add match')
                console.log(err)
              }
              else {
                console.log('Match added!')
              }
            })
          }
        }
      })
    }
  })
}


exports.getMatches = getMatches
exports.updateMatches = updateMatches