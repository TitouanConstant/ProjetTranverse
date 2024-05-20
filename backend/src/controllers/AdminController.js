const { User } = require('../models')

module.exports = {
  async getAllUsers(req, res) {
    if (req.user.isAdmin) {
      try {
        const users = await User.findAll()
        res.send(users)
      } catch (err) {
        res.status(500).send({
          error: 'An error has occured trying to fetch the users'
        })
      }
    } else {
      res.status(403).send({
        error: 'You do not have access to this action'
      })
    }
  },
  async updateUser(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({
        error: 'You do not have access to this action'
      });
    }
  
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        return res.status(404).send({
          error: 'User not found'
        });
      }
      if (user.isAdmin) {
        return res.status(403).send({
          error: 'Admin user cannot be modified'
        })
      }  
      await user.update(req.body);
      res.send(user);
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to update the user'
      });
    }
  },
  async deleteUser(req, res) {
    if (!req.user.isAdmin) {
      return res.status(403).send({
        error: 'You do not have access to this action'
      });
    }
      
    try {
      const user = await User.findByPk(req.params.userId);
      if (!user) {
        return res.status(404).send({
          error: 'User not found'
        });
      }
      if (user.isAdmin) {
        return res.status(403).send({
          error: 'Admin user cannot be deleted'
        })
      }
      await user.destroy();
      res.send({ message: 'User deleted successfully' });
    } catch (err) {
      res.status(500).send({
        error: 'An error has occurred trying to delete the user'
      });
    }
  }  
}
