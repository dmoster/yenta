const { pool } = require('./db')


const displayGames = (req, res) => {
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


exports.displayGames = displayGames