import bcrypt from 'bcryptjs'
import { User } from '../schema/user'

const LocalStrategy = require('passport-local').Strategy

const strategy = {
  usernameField: 'username',
  passwordField: 'password'
}

export function authenticate (passport) {
  passport.use('local-login',
    new LocalStrategy(strategy, async (req, username, password, done) => {
      const user = await User.findOne({ username: username }).select('username password')
      if (user) {
        if (bcrypt.compareSync(password, user.password)) {
          req.session.user.username = username
          return done(null, req.session.user)
        } else {
          return done(null, false, { message: 'email and password do not match', code: 409 })
        }
      } else {
        return done(null, false, { message: 'this username does not exist', code: 409 })
      }
    })
  )

  passport.use('local-signup',
    new LocalStrategy(strategy, async (req, username, password, done) => {
      let hash = bcrypt.hashSync(password, 10)
      try {
        const doc = await User.findOne({ username: username })
        if (doc) {
          return done(null, false, { message: 'username already used', code: 409 })
        }
        await new User({
          username: username,
          password: hash
        }).save()
      } catch (e) {
        return done(null, false, { message: e.message || e, code: 400 })
      }
    })
  )

  passport.serializeUser(function (user, done) {
    done(null, user)
  })

  passport.deserializeUser(function (user, done) {
    done(null, user)
  })
}
