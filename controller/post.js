const Post = require('../models/post');

const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const post = new Post({
      title,
      description,
      author: req.user._id,
    });
    await post.save();
    res.send({
      id: post._id,
      title: post.title,
      desc: post.description,
      created_at: post.created_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const deletePost = async (req, res) => {
  try {
    const postToDelete = await Post.findById(req.params.id);
    if (!postToDelete) {
      return res.status(404).send({ message: 'Post not found' });
    }

    if (!postToDelete.author.equals(req.user._id)) {
      return res.status(401).send({ message: 'Unauthorized' });
    }

    await Post.deleteOne({ _id: req.params.id });
    res.send({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username');
    if (!post) {
      return res.status(404).send({ message: 'Post not found' });
    }
    const { _id, title, description, created_at, likes, comments } = post;
    res.send({ _id, title, desc: description, created_at, likes: likes.length, comments });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate('author', 'username')
      .populate('likes', 'username')
      .populate('comments.author', 'username')
      .sort({ created_at: -1 });

    const result = posts.map(post => {
      const { _id, title, description, created_at, likes, comments } = post;
      return { id: _id, title, desc: description, created_at, likes: likes.length, comments };
    });

    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = { createPost, deletePost, getPostById, getAllPosts };