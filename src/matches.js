const { pool } = require('./db')
const user = require('./user')


const showAll = (req, res) => {
  user.getUserGames(req, res, (err, result) => {
    if (err || result == null || result.length < 1) {
      result = []
    }
    res.status(200).render('pages/matches', {
      games: result
    })
  })
}


const getMatches = (req, res, callback) => {
  console.log('Getting matches...')

  const sql = "SELECT username, discord_username, users.id, game_id, match_level FROM users INNER JOIN matches ON users.match_id = matches.match_id WHERE (matches.user_id = $1 OR matches.match_id = $1) AND NOT users.id = $1 UNION SELECT username, discord_username, users.id, game_id, match_level FROM users INNER JOIN matches ON users.match_id = matches.user_id WHERE (matches.user_id = $1 OR matches.match_id = $1) AND NOT users.id = $1 ORDER BY match_level DESC LIMIT 15"

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
      console.log('Comparing metrics...')

      result.rows.forEach(potentialMatch => {
        if (potentialMatch.user_id !== user_id) {
          let matchLevel = 0

          matchLevel += 20 - (2 * (Math.max(potentialMatch.casual_competitive,metrics.casual_competitive) - Math.min(potentialMatch.casual_competitive,metrics.casual_competitive)))
          matchLevel += 20 - (2 * (Math.max(potentialMatch.short_long, metrics.short_long) - Math.min(potentialMatch.short_long, metrics.short_long)))
          matchLevel += 20 - (2 * (Math.max(potentialMatch.partner_team, metrics.partner_team) - Math.min(potentialMatch.partner_team, metrics.partner_team)))
          matchLevel += 20 - (2 * (Math.max(potentialMatch.strategic_gunblazer, metrics.strategic_gunblazer) - Math.min(potentialMatch.strategic_gunblazer, metrics.strategic_gunblazer)))
          matchLevel += 20 - (2 * (Math.max(potentialMatch.learn_lead, metrics.learn_lead) - Math.min(potentialMatch.learn_lead, metrics.learn_lead)))

          if (matchLevel >= 75) {
            console.log('Adding match...')

            const sql = "INSERT INTO matches (user_id, match_id, game_id, match_level) VALUES ($1, $2, $3, $4)"

            const newParams = [user_id, potentialMatch.user_id, metrics.game_id, matchLevel]

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


const getMetrics = (req, res) => {
  console.log('Obtaining metrics...')

  const sql = "SELECT DISTINCT user_metrics.user_id, casual_competitive, short_long, partner_team, strategic_gunblazer, learn_lead FROM user_metrics INNER JOIN matches ON user_metrics.game_id = matches.game_id WHERE (user_metrics.user_id = $1 OR user_metrics.user_id = $2) AND user_metrics.game_id = $3"

  const params = [req.session.user_id, req.body.match_id, req.body.game_id]

  pool.query(sql, params, (err, result) => {
    if (err) {
      let errMsg = 'Something went wrong grabbing the metrics :('
      console.log(errMsg)
      console.log(err)
      res.send({
        success: false,
        message: errMsg
      })
    }
    else {
      console.log('Metrics acquired!')

      res.send({
        success: true,
        user_metrics: result.rows
      })
    }
  })
}


exports.getMatches = getMatches
exports.updateMatches = updateMatches
exports.showAll = showAll
exports.getMetrics = getMetrics