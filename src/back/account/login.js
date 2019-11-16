import passport from 'passport'
import Joi from 'joi'
import { Settings } from '../schema/settings'
import { login as schema } from '../joi/joi'

export async function setUserSettings (user) {
  // console.log('setUserSettings', req.session.user._id)
  var doc = await Settings.findOne({ user_id: user._id })
  if (doc) user.settings = doc
  return user
}

export function loginInput (req) {
  const value = {
    username: req.body.username,
    password: req.body.password
  }
  return value
}

export async function login (req, res, next) {
  req.body.username = req.body.email// for now, waiting for email field to be called username
  const value = loginInput(req)
  Joi.validate(value, schema, err => {
    if (err) {
      res.status(409).send({ message: err.details[0].message })
    } else {
      passport.authenticate('local-login', (err, user, info) => {
        if (err) {
          res.status(500).send({ message: info.message })
        }
        if (user) {
          req.login(user, err => {
            if (err) res.status(500).send({ message: 'passport error' })
            else {
              res.status(200).send({ user: user })
            }
          })
        } else {
          res.status(info.code).send({ message: info.message })
        }
      })(req, res, next)
    }
  })
}
