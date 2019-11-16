import passport from 'passport'

export async function login (req, res, next) {
  passport.authenticate('local-login', (err, user, info) => {
    if (err) {
      res.status(400).send({ message: info.message })
    }
    if (user) {
      req.login(user, err => {
        if (err) res.status(500).send({ message: 'passport error' })
        else {
          res.status(200).send({ user: user })
        }
      })
    }
  })(req, res, next)
}
