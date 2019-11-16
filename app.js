'use strict'

import http from 'http'
import path from 'path'
import morgan from 'morgan'
import methodOverride from 'method-override'
import errorHandler from 'errorhandler'
import compression from 'compression'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import routes from './routes/index'
import mongoose from 'mongoose'

mongoose.connect(dbURI, options)

mongoose.set('useCreateIndex', true)
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to ' + dbURI)
})

mongoose.connection.on('error', function (err) {
  console.log('Mongoose default connection error: ' + err)
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected')
})

// mongoose.set('debug', true)

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})


app.use(compression())

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', process.env.PORT || 3019)

app.use(morgan('dev'))
app.use(methodOverride())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// error handling middleware should be loaded after the loading the routes
if (app.get('env') === 'development') {
  app.use(errorHandler())
}

app.use('/', routes)

// catch 404 and forward to error handler

app.use(function (req, res, next) {
  var err = new Error('Not Found', req, res, next)
  err.status = 404
  res.render('404')
})

// var server = https.createServer(certOptions, app)
var server = http.createServer(app)
server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports.app = app
