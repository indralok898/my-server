const User = require('../models/user');

const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    if (!userToFollow) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (userToFollow.followers.includes(req.user._id)) {
      return res.status(400).send({ message: 'You are already following this user' });
    }

    await userToFollow.updateOne({ $push: { followers: req.user._id } });
    await req.user.updateOne({ $push: { following: userToFollow._id } });
    res.send({ message: 'Followed user successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const unfollowUser = async (req, res) => {
    try {
      const userToUnfollow = await User.findById(req.params.id);
      if (!userToUnfollow) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      if (!userToUnfollow.followers.includes(req.user._id)) {
        return res.status(400).send({ message: 'You are not following this user' });
      }
  
      await userToUnfollow.updateOne({ $pull: { followers: req.user._id } });
      await req.user.updateOne({ $pull: { following: userToUnfollow._id } });
      res.send({ message: 'Unfollowed user successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Server error' });
    }
  };

  module.exports = { followUser, unfollowUser };