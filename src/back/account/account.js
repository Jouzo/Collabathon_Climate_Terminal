export function logout (req, res) {
  if (req.isAuthenticated() && req.session) {
    req.session.destroy()
    res.status(200).send({ message: 'bye bye' })
  }
}

export async function connected (req, res) {
  if (!req.session) {
    res.send({ error: 'Error with sessions' })
  } else if (req.session && req.session.user) {
    res.status(200).send(req.session.user)
  } else {
    res.send({ message: 'no user connected' })
  }
}
