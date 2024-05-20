module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define('Rating', {
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 1.00,
                max: 5.00
            }
        }
    })
    Rating.associate = function(models) {
        Rating.belongsTo(models.Activities, { foreignKey: 'activityId', as: 'activities' })
        Rating.belongsTo(models.User, { foreignKey: 'userId', as: 'user' })
    }
    return Rating
}
