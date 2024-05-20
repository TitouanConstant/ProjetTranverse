module.exports = function(req, res, next) {
    if (req.user && req.user.isAdmin) {
      return next();
    } else {
      res.status(401).send({
        error: 'You do not have access to this resource'
      });
    }
  };
  