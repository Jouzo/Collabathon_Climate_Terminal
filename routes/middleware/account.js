export function loggedIn (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    res.redirect('/')
  }
}

export function premium (req, res, next) {
  if (req.session.user &&
    (req.session.user.role === 'premium' || req.session.user.role === 'admin')) {
    next()
  } else {
    res.status(200).send({ error: 'Access restricted to premium users' })
  }
}
