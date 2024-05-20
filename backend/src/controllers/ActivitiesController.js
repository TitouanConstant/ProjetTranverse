const { Activities } = require('../models')
const { Op, Sequelize } = require('sequelize')
const validator = require('validator')

module.exports = {
  async getAllActivities(req, res) {
    try {
      const activities = await Activities.findAll()
      res.send(activities)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to fetch the activities'
      })
    }
  },
  async getOrganizations(req, res) {
    try {
      const organizations = await Activities.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('organization')), 'organization']]
      });
      const organizationNames = organizations.map(org => org.organization);
      res.send(organizationNames);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching organizations' });
    }
  },
  async sortActivitiesByLocation(req, res) {
    const order = req.query.order || 'asc';

    try {
      const activities = await Activities.findAll({
        order: [['location', order]]
      });
      res.send(activities);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching sorted activities' });
    }
  },
  async searchActivities(req, res) {
    const searchTerm = req.query.search;
    try {
      const activities = await Activities.findAll({
        where: {
          title: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      });
      res.send(activities);
    } catch (err) {
      res.status(500).send({ error: 'Error searching activities' });
    }
  },
  async getFilteredActivities(req, res) {
    const { location, organizations } = req.query;
    let filterConditions = {};

    if (location) {
      filterConditions.location = { [Op.like]: `%${location}%` };
    }

    if (organizations) {
      filterConditions.organization = { [Op.in]: organizations.split(',') };
    }

    try {
      const activities = await Activities.findAll({
        where: filterConditions
      });
      res.send(activities);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching filtered activities' });
    }
  },
  async addActivity(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can add activities' });
    }

    try {
      const data = {
        title: validator.trim(req.body.title),
        organization: validator.trim(req.body.organization),
        location: validator.trim(req.body.location),
        description: validator.trim(req.body.description),
        imageUrl: validator.trim(req.body.imageUrl),
        spotsAvailable: typeof req.body.spotsAvailable === 'string' ? validator.toInt(req.body.spotsAvailable) : req.body.spotsAvailable
      };

      if (!validator.isURL(data.imageUrl)) {
        return res.status(400).send({ error: 'Invalid image URL' });
      }

      const activity = await Activities.create(data);
      res.send(activity);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while adding the activity'
      });
      console.log(err)
    }
  },
  async updateActivity(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can update activities' });
    }
    try {
      const activity = await Activities.update(req.body, {
        where: {
          id: req.params.activityId
        }
      });
      if (!activity) {
        return res.status(404).send({
          error: 'The activity was not found'
        });
      }
      res.send({ message: 'Activity updated successfully' });
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while updating the activity'
      });
    }
  },
  async deleteActivity(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can delete activities' });
    }
    try {
      const activity = await Activities.destroy({
        where: {
          id: req.params.activityId
        }
      });
      if (!activity) {
        return res.status(404).send({
          error: 'The activity was not found'
        });
      }
      res.send({ message: 'Activity deleted successfully' });
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while deleting the activity'
      })
    }
  }
}
