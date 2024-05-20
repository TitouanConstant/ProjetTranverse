const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync(SALT_ROUNDS);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue('password', hash);
      }
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  })
  User.prototype.comparePassword = function (enteredPassword) {
    return bcrypt.compareSync(enteredPassword, this.password);
  }
  return User
}
