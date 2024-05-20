module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    activityId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    }
  }, {
  });

  Cart.associate = function(models) {
    Cart.belongsTo(models.User, { foreignKey: 'userId' });
    Cart.belongsTo(models.Activities, { foreignKey: 'activityId', as: 'activity' }); 
  }

  return Cart;
}
