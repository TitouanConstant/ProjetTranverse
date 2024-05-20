module.exports = (sequelize, DataTypes) => {
    const Watch = sequelize.define('Watch', {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false 
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
      }
    },{
        timestamps: false
    });
    Watch.associate = function(models) {
      Watch.hasMany(models.Cart, { foreignKey: 'watchId' })
    }
    return Watch
  }
  