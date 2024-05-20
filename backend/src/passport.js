const passport = require('passport');
const { User } = require('./models');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config/config');

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.authentication.jwtSecret,
};
passport.use(new JwtStrategy(options, async (jwtPayload, done) => {
  try {
    const user = await User.findOne({ where: { id: jwtPayload.id } });
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}))
