const { Rating } = require('../models')
const { Sequelize } = require('sequelize')

const RatingController = {
    async addRating(req, res) {
        try {
            const userId = req.user.id
            const { activityId, rating } = req.body
            const existingRating = await Rating.findOne({
                where: { activityId, userId }
            })
            if (existingRating) {
                await Rating.update({ rating }, {
                    where: { id: existingRating.id }
                })
                res.status(200).send('Rating updated successfully.');
            } else {
                const newRating = await Rating.create({ activityId, userId, rating })
                res.status(201).send(newRating)
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    async getRatingsForActivity(req, res) {
        try {
            const { activityId } = req.params;
            const ratings = await Rating.findAll({
                where: { activityId }
            });
            res.status(200).send(ratings);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    async getAverageRatingForActivity(req, res) {
        try {
            const { activityId } = req.params;
            const result = await Rating.findAll({
                where: { activityId },
                attributes: [
                    [Sequelize.fn('AVG', Sequelize.col('rating')), 'averageRating']
                ],
                raw: true,
            });

            const averageRating = result[0].averageRating ? parseFloat(result[0].averageRating).toFixed(2) : "0.00";
            res.status(200).send({ averageRating });
        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    async getRatingsBreakdownForActivity(req, res) {
        try {
            const { activityId } = req.params
            const ratingsBreakdown = await Rating.findAll({
                where: { activityId },
                attributes: ['rating', [Sequelize.fn('COUNT', Sequelize.col('rating')), 'count']],
                group: ['rating'],
                order: [['rating', 'DESC']],
                raw: true
            })
            const totalRatings = ratingsBreakdown.reduce((total, current) => total + current.count, 0)
            res.status(200).send({ totalRatings, ratingsBreakdown })
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    async getUserRatingForActivity(req, res) {
        try {
            const userId = req.user.id
            const activityId = req.params.activityId
            const userRating = await Rating.findOne({
                where: { activityId, userId }
            })
            if (userRating) {
                res.status(200).send(userRating);
            } else {
                res.status(200).send({ rating: 0 })
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}
module.exports = RatingController;
