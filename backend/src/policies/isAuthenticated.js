const passport = require('passport')

module.exports = function (req, res, next) {
  passport.authenticate('jwt', function (err, user) {
    if (err) {
      res.status(403).send({
        error: 'Error in authentication'
      })
    } else if (!user) {
      res.status(403).send({
        error: 'You do not have access to this resource'
      })
    } else {
      req.user = user
      if (user.isAdmin) {
        return next();
      }
      next()
    }
  })(req, res, next)
}
