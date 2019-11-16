require('babel-register')({
  'presets': [
    ['env', {
      'targets': {
        'browsers': ['last 2 Chrome versions']
      }
    }]
  ]
})
// Import the rest of our application.
module.exports = require('./app.js')
