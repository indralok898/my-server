const Post = require('../models/post');

const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }

    const comment = { author: req.user._id, text };
    post.comments.push(comment);
    await post.save();
    res.send({ comment_id: comment._id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = { addComment };