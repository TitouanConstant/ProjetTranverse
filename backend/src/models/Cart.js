module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      watchId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1
        }
      }
    });
  
    Cart.associate = function(models) {
      Cart.belongsTo(models.User, { foreignKey: 'userId' });
      Cart.belongsTo(models.Watch, { foreignKey: 'watchId', as: 'watch' });
    };
  
    return Cart;
  };
  