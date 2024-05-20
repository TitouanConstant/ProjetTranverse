const { Cart, Activities } = require('../models')
const { sequelize } = require('../models')

module.exports = {

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { activityId, quantity } = req.body;

      const activity = await Activities.findByPk(activityId);
      if (!activity) {
        return res.status(404).send({ error: 'Activity not found' });
      }

      if (quantity > activity.spotsAvailable) {
        return res.status(400).send({ error: 'Not enough spots available' });
      }

      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          activityId: activityId
        }
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await Cart.create({ userId, activityId, quantity });
      }

      res.status(201).send({ message: 'Item added to cart successfully.' });
    } catch (err) {
      res.status(500).send({ error: 'An error occurred while adding item to cart.' });
    }
  },
  
  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const activityId = req.params.activityId;
  
      console.log(`Attempting to remove item with activityId: ${activityId} for user: ${userId}`);
  
      const numRowsDeleted = await Cart.destroy({
        where: {
          userId: userId,
          activityId: activityId
        }
      });
  
      if (numRowsDeleted > 0) {
        res.send({ message: 'Item removed from cart successfully.' });
      } else {
        res.status(404).send({ message: 'Item not found in cart.' });
      }
  
    } catch (err) {
      console.error('Error occurred:', err);
      res.status(500).send({ error: 'An error occurred while removing item from cart.' });
    }
  },
  
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      const items = await Cart.findAll({
        where: { userId: userId },
        include: [{
          model: Activities,
          as: 'activity'
        }]
      });

      res.send(items);
    } catch (err) {
      console.error(err);
      res.status(500).send({ error: 'An error occurred while fetching the cart items.' });
    }
  },

  async increaseCartItemQuantity(req, res) {
    const userId = req.user.id;
    const activityId = req.params.activityId;

    try {
      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          activityId: activityId
        }
      });

      if (!cartItem) {
        return res.status(404).send({ error: 'Cart item not found.' });
      }

      const activity = await Activities.findByPk(activityId);
      if (cartItem.quantity + 1 > activity.spotsAvailable) {
        return res.status(400).send({ error: 'Not enough spots available.' });
      }

      cartItem.quantity += 1;
      await cartItem.save();

      res.send({ message: 'Quantity increased successfully.' });
    } catch (err) {
      res.status(500).send({ error: 'An error occurred while updating cart item.' });
    }
  },

  async decreaseCartItemQuantity(req, res) {
    const userId = req.user.id;
    const activityId = req.params.activityId;

    try {
      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          activityId: activityId
        }
      });

      if (!cartItem) {
        return res.status(404).send({ error: 'Cart item not found.' });
      }

      if (cartItem.quantity - 1 <= 0) {
        await cartItem.destroy();
        res.send({ message: 'Cart item removed.' });
      } else {
        cartItem.quantity -= 1;
        await cartItem.save();
        res.send({ message: 'Quantity decreased successfully.' });
      }
    } catch (err) {
      res.status(500).send({ error: 'An error occurred while updating cart item.' });
    }
  },
  async checkout(req, res) {
    const transaction = await sequelize.transaction();
    try {
      const userId = req.user.id;
      const cartItems = await Cart.findAll({
        where: { userId: userId },
        include: [{ model: Activities, as: 'activity' }],
      }, { transaction });
  
      let outOfStockActivities = [];
  
      for (const item of cartItems) {
        const activity = await Activities.findByPk(item.activityId, { transaction });
        if (activity.spotsAvailable >= item.quantity) {
          activity.spotsAvailable -= item.quantity;
          if (activity.spotsAvailable === 0) {
            outOfStockActivities.push(activity.title); // Keep track of out of stock activities
          }
          await activity.save({ transaction });
        } else {
          await transaction.rollback();
          return res.status(400).send({ error: `Not enough spots for activity ${activity.title}.` });
        }
      }
  
      await Cart.destroy({
        where: { userId: userId }
      }, { transaction });
  
      await transaction.commit();
  
      // If any activities went out of stock during the checkout, include that information in the response.
      if (outOfStockActivities.length > 0) {
        return res.send({ message: 'Checkout successful, but some items are out of stock.', outOfStockActivities: outOfStockActivities });
      } else {
        return res.send({ message: 'Checkout successful, cart cleared.' });
      }
    } catch (err) {
      await transaction.rollback()
      console.error('Error occurred during checkout:', err)
      res.status(500).send({ error: 'An error occurred during checkout.' });
    }
  }
  
};
