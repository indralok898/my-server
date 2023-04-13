const User = require('../models/user');

const getUserProfile = async (req, res) => {
  try {
    const { username, followers, following } = req.user;
    res.send({ username, followers: followers.length, following: following.length });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = { getUserProfile };