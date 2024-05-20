const { Cart, Watch } = require('../models')
const { sequelize } = require('../models')

module.exports = {

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { watchId, quantity } = req.body;

      const watch = await Watch.findByPk(watchId);
      if (!watch) {
        return res.status(404).send({ error: 'Watch not found' });
      }

      if (quantity > watch.quantity) {
        return res.status(400).send({ error: 'Not enough stock available' });
      }

      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          watchId: watchId
        }
      });

      if (cartItem) {
        cartItem.quantity += quantity;
        await cartItem.save();
      } else {
        await Cart.create({ userId, watchId, quantity });
      }

      res.status(201).send({ message: 'Item added to cart successfully.' });
    } catch (err) {
      res.status(500).send({ error: 'An error occurred while adding item to cart.' });
    }
  },
  
  async removeFromCart(req, res) {
    try {
      const userId = req.user.id;
      const watchId = req.params.watchId;
  
      console.log(`Attempting to remove item with watchId: ${watchId} for user: ${userId}`);
  
      const numRowsDeleted = await Cart.destroy({
        where: {
          userId: userId,
          watchId: watchId
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
          model: Watch,
          as: 'watch'
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
    const watchId = req.params.watchId;

    try {
      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          watchId: watchId
        }
      });

      if (!cartItem) {
        return res.status(404).send({ error: 'Cart item not found.' });
      }

      const watch = await Watch.findByPk(watchId);
      if (cartItem.quantity + 1 > watch.quantity) {
        return res.status(400).send({ error: 'Not enough stock available.' });
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
    const watchId = req.params.watchId;

    try {
      const cartItem = await Cart.findOne({
        where: {
          userId: userId,
          watchId: watchId
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
        include: [{ model: Watch, as: 'watch' }],
      }, { transaction });
  
      let outOfStockWatches = [];
  
      for (const item of cartItems) {
        const watch = await Watch.findByPk(item.watchId, { transaction });
        if (watch.quantity >= item.quantity) {
          watch.quantity -= item.quantity;
          if (watch.quantity === 0) {
            outOfStockWatches.push(watch.name); // Keep track of out of stock watches
          }
          await watch.save({ transaction });
        } else {
          await transaction.rollback();
          return res.status(400).send({ error: `Not enough stock for watch ${watch.name}.` });
        }
      }
  
      await Cart.destroy({
        where: { userId: userId }
      }, { transaction });
  
      await transaction.commit();
  
      // If any watches went out of stock during the checkout, include that information in the response.
      if (outOfStockWatches.length > 0) {
        return res.send({ message: 'Checkout successful, but some items are out of stock.', outOfStockWatches: outOfStockWatches });
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
