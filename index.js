const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// Models
const User = require("./models/user");

// Controllers
const userController = require("./controller/user");
const postController = require("./controller/post");
const followController = require("./controller/follow");
const likeController = require("./controller/like");
const commentController = require("./controller/comment");

const app = express();

// Set up middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set up MongoDB connection
mongoose.connect(
  "mongodb+srv://myserver:myserver@cluster0.nofqsix.mongodb.net/test",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define authentication middleware
const authenticateUser = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const token = authorizationHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, "jwtPrivateKey");
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ message: "Unauthorized" });
  }
};

// Define routes
app.get("/api/user", authenticateUser, userController.getUserProfile);
app.post("/api/follow/:id", function (req, res) {
  followController.followUser;
});
app.post("/api/unfollow/:id", function (req, res) {
  followController.unfollowUser;
});
app.post("/api/posts", function (req, res) {
  postController.createPost;
});
app.delete("/api/posts/:id", authenticateUser, postController.deletePost);
app.post("/api/like/:id", function (req, res) {
  likeController.likePost;
});
app.post("/api/unlike/:id", function (req, res) {
  likeController.unlikePost;
});
app.post("/api/comment/:id", function (req, res) {
  commentController.createComment;
});
app.get("/api/posts/:id", postController.getPostById);
app.get("/api/all_posts", authenticateUser, postController.getAllPosts);
app.get("/app/health", function (req, res) {
  res.send({ status: "OK" });
});
const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
