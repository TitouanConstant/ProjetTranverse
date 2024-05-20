module.exports = (sequelize, DataTypes) => {
  const Activities = sequelize.define('Activities', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    organization: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    spotsAvailable: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 10
    }
  }, {
    timestamps: false
  });

  Activities.associate = function(models) {
    Activities.hasMany(models.Cart, { foreignKey: 'activityId' });
  }

  return Activities;
}
