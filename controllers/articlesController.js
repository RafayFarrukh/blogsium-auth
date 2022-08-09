import Article from "../models/Article.js";

import ValidateArticle from "../validation/validation_article.js";

const createArticle = async (req, res) => {
  // const newPost = new Article(req.body);

  const { title, body, pic, username } = req.body;

  const newPost = new Article({
    title,
    body,
    image: pic,
    username,
  });
  newPost.save((err, createdPost) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    return res.status(200).json({
      post: createdPost,
    });
  });
};

const getAllArticle = async (req, res) => {
  const username = req.query.user;

  if (username) {
    Article.find({ username })
      .then((post, err) => {
        if (err) {
          return res.status(400).json({
            errorInFind: err,
          });
        }
        return res.status(200).json(post);
      })
      .catch((err) => {
        return res.status(400).json({
          error: "Post not found",
        });
      });
  } else {
    Article.find()
      .then((post, err) => {
        if (err) {
          return res.status(400).json({
            errorInAllPost: err,
          });
        }
        return res.status(200).json(post);
      })
      .catch((err) => {
        return res.status(400).json(err);
      });
  }
};

const getById = async (req, res) => {
  Article.findById(req.params.id)
    .then((foundPost, err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      return res.status(200).json(foundPost);
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Post not found",
      });
    });
};

const deleteArticle = async (req, res) => {
  Article.findById(req.params.id)
    .then((foundPost, err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      if (req.body.username === foundPost.username) {
        foundPost
          .delete()
          .then((deletedPost, err) => {
            if (err) {
              return res.status(400).json({
                errorInDeleteing: err,
              });
            }
            return res.status(200).json({
              deleted: deletedPost,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              unableToDelete: err,
            });
          });
      } else {
        return res.status(400).json({
          error: "you can delete only your posts",
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        error: "post not found",
      });
    });
};

const updateArticle = (req, res) => {
  Article.findById(req.params.id)
    .then((foundPost, err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      if (req.body.username === foundPost.username) {
        Article.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        )
          .then((updatedPost, err) => {
            if (err) {
              return res.status(400).json({
                error: err,
              });
            }

            return res.status(200).json({
              update: updatedPost,
            });
          })
          .catch((err) => {
            return res.status(400).json({
              unableToUpdate: err,
            });
          });
      } else {
        return res.status(400).json({
          error: "You can only update your posts",
        });
      }
    })
    .catch((err) => {
      return res.status(404).json({
        error: "post not found",
      });
    });
};
const likeArticle = async (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    { $push: { likes: req.params.id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};
const unlikeArticle = async (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.params.id } },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(422).json({ error: err });
    } else {
      res.json(result);
    }
  });
};
const commentArticle = async (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.params.id,
  };
  Article.findByIdAndUpdate(
    req.params.id,
    { $push: { comments: comment } },
    { new: true }
  )
    .populate("comments.postedBy", "_id name")
    .populate("postedBy", "_id name")
    .exec((err, result) => {
      if (err) {
        return res.status(422).json({ error: err });
      } else {
        res.json(result);
      }
    });
};
export {
  createArticle,
  getAllArticle,
  getById,
  deleteArticle,
  updateArticle,
  likeArticle,
  unlikeArticle,
  commentArticle,
};
