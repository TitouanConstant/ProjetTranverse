const { Watch } = require('../models')
const { Op, Sequelize } = require('sequelize')
const validator = require('validator')

module.exports = {
  async getAllWatches(req, res) {
    try {
      const watches = await Watch.findAll()
      res.send(watches)
    } catch (err) {
      res.status(500).send({
        error: 'An error has occured trying to fetch the watches'
      })
    }
  },
  async getBrands(req, res) {
    try {
      const brands = await Watch.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('brand')), 'brand']]
      });
      const brandNames = brands.map(brand => brand.brand);
      res.send(brandNames);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching brands' });
    }
  },  
  async sortWatchesByPrice(req, res) {
    const order = req.query.order || 'asc';
  
    try {
      const watches = await Watch.findAll({
        order: [['price', order]]
      });
      res.send(watches);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching sorted watches' });
    }
  },

  async searchWatches(req, res) {
    const searchTerm = req.query.search;
    try {
      const watches = await Watch.findAll({
        where: {
          name: {
            [Op.like]: `%${searchTerm}%`
          }
        }
      });
      res.send(watches);
    } catch (err) {
      // Error handling
    }
  },
  async getFilteredWatches(req, res) {
    const { minPrice, maxPrice, brands } = req.query;
    let filterConditions = {};

    if (minPrice && maxPrice) {
      filterConditions.price = { [Op.between]: [minPrice, maxPrice] };
    }

    if (brands) {
      filterConditions.brand = { [Op.in]: brands.split(',') };
    }

    try {
      const watches = await Watch.findAll({
        where: filterConditions
      });
      res.send(watches);
    } catch (err) {
      res.status(500).send({ error: 'Error fetching filtered watches' });
    }
  },
  
  async addWatch(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can add watches' });
    }

    try {
      const data = {
        name: validator.trim(req.body.name),
        brand: validator.trim(req.body.brand),
        price: typeof req.body.price === 'string' ? validator.toFloat(req.body.price) : req.body.price,
        description: validator.trim(req.body.description),
        imageUrl: validator.trim(req.body.imageUrl),
        quantity: typeof req.body.quantity === 'string' ? validator.toInt(req.body.quantity) : req.body.quantity
      };
      if (isNaN(data.price) || isNaN(data.quantity)) {
        return res.status(400).send({ error: 'Invalid price or quantity' });
      }

      if (!validator.isURL(data.imageUrl)) {
        return res.status(400).send({ error: 'Invalid image URL' });
      }

      const watch = await Watch.create(data);
      res.send(watch);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while adding the watch'
      });
      console.log(err)
    }
  },
  
  async updateWatch(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can update watches' });
    }
    try {
      const watch = await Watch.update(req.body, {
        where: {
          id: req.params.watchId
        }
      });
      if (!watch) {
        return res.status(404).send({
          error: 'The watch was not found'
        });
      }
      res.send({ message: 'Watch updated successfully' });
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while updating the watch'
      });
    }
  },
  async deleteWatch(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admin can delete watches' });
    }
    try {
      const watch = await Watch.destroy({
        where: {
          id: req.params.watchId
        }
      });
      if (!watch) {
        return res.status(404).send({
          error: 'The watch was not found'
        });
      }
      res.send({ message: 'Watch deleted successfully' });
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred while deleting the watch'
      })
    }
  }    
}
