const Post = require('../models/post');

const likePost = async (req, res) => {
  try {
    const postToLike = await Post.findById(req.params.id);
    if (!postToLike) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (postToLike.likes.includes(req.user._id)) {
      return res.status(400).send({ message: 'You already liked this post' });
    }

    await postToLike.updateOne({ $push: { likes: req.user._id } });
    res.send({ message: 'Post liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const unlikePost = async (req, res) => {
  try {
    const postToUnlike = await Post.findById(req.params.id);
    if (!postToUnlike) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (!postToUnlike.likes.includes(req.user._id)) {
      return res.status(400).send({ message: 'You have not liked this post' });
    }

    await postToUnlike.updateOne({ $pull: { likes: req.user._id } });
    res.send({ message: 'Post unliked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = { likePost, unlikePost };