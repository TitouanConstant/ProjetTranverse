const { Rating } = require('../models')
const { Sequelize } = require('sequelize')

const RatingController = {
    async addRating(req, res) {
        try {
            const userId = req.user.id
            const { watchId, rating } = req.body
            const existingRating = await Rating.findOne({
                where: { watchId, userId }
            })
            if (existingRating) {
                await Rating.update({ rating }, {
                    where: { id: existingRating.id }
                })
                res.status(200).send('Rating updated successfully.');
            } else {
                const newRating = await Rating.create({ watchId, userId, rating })
                res.status(201).send(newRating)
            }
        } catch (error) {
            res.status(400).send(error.message)
        }
    },
    async getRatingsForWatch (req, res) {
        try {
            const { watchId } = req.params;
            const ratings = await Rating.findAll({
                where: { watchId }
            });
            res.status(200).send(ratings);
        } catch (error) {
            res.status(400).send(error.message);
        }
    },
    async getAverageRatingForWatch (req, res) {
        try {
            const { watchId } = req.params;
            const result = await Rating.findAll({
                where: { watchId },
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
    async getRatingsBreakdownForWatch (req, res) {
        try {
            const { watchId } = req.params
            const ratingsBreakdown = await Rating.findAll({
                where: { watchId },
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
    async getUserRatingForWatch (req, res) {
        try {
            const userId = req.user.id
            const watchId = req.params.watchId
            const userRating = await Rating.findOne({
                where: { watchId, userId }
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
