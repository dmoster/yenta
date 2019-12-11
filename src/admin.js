


const getAdminDashboard = (req, res) => {
  res.status(200).render('pages/admin', {
    username: req.session.username,
  })
}


const getRole = (req, res) => {
  const username = req.session.username
  console.log(`Checking role for ${username}`)

  const sql = "SELECT role FROM users WHERE id = $1"

  const params = [req.session.user_id]

  pool.query(sql, (err, result) => {
    if (err) {
      console.log('Error in query: ')
      console.log(err)

      res.send({ success: false })
    }
    else {
      if (res.body.role === 'admin') {
        res.status(200).render('pages/admin', {
          username: req.session.username
        })
      }
      else {

      }

    }

  })
}


exports.getAdminDashboard = getAdminDashboard