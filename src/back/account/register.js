import passport from 'passport'
import Joi from 'joi'
import * as schema from '../joi/schema'
import { register as JoiRegister } from '../joi/register'
import { User } from '../schema/user'
import { Profile } from '../schema/profile'
import { Contact } from '../schema/contact'
import uuidv4 from 'uuid/v4'
import * as mailSender from '../module/sendmail'
import jwt from 'jsonwebtoken'
import config from '../../../config/config'
// import geoip from 'geo-from-ip'

export async function insertUser (done, user, req) {
  user.profile.user_id = user.user._id
  user.contact.user_id = user.user._id
  try {
    await Promise.all([user.user.save(),
      user.profile.save(),
      user.contact.save()])
  } catch (e) { return done(null, false, { message: e, code: 400 }) }
  jwt.sign({id: user.user._id}, config.jwtSecret,
    {expiresIn: '1h'},
    (err, token) => {
      if (err) return done(null, false, { message: err, code: 400 })
      console.log('token :', token)
      mailSender.registrationMail(token, user.contact.email, req.headers.host, done, user)
    })
}

export function getUser (req, hash) {
  // try {
  //   var location = geoip.allData(req.ip).country
  // } catch (e) { console.log('invalide ip') }
  var user = new User({
    username: req.body.email,
    role: 'registered',
    password: hash,
    enabled: 0,
    created: new Date()
  })
  var contact = new Contact({
    // ip: {
    //   location: location,
    //   address: req.ip
    // },
    email: req.body.email,
    country: req.body.country
  })
  var profile = new Profile({
    pseudonym: req.body.pseudonym,
    info: req.body.info,
    country: req.body.country,
    created: new Date(),
    ranking: 0,
    uuid: uuidv4(),
    image: false
  })
  var newUser = {
    user: user,
    contact: contact,
    profile: profile
  }
  return newUser
}

export function register (req, res, next) {
  Joi.validate(res.locals.fields, JoiRegister, err => {
    if (err) {
      res.status(409).send({ message: err.details[0].message })
    } else {
      Object.assign(req.body, res.locals.fields)
      req.body.files = res.locals.files
      req.body.username = req.body.email
      passport.authenticate('local-signup', (err, user, info) => {
        if (err) {
          console.log('err :', err)
          res.status(400).send({ message: err.message })
        }
        if (user) {
          res.status(200).send({ user: user })
        } else {
          res.status(200).send({
            message: info.message.message
            ? info.message.message : info.message
          })
        }
      })(req, res, next)
    }
  })
}
