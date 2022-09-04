import Article from "../models/Article.js";

const createArticle = async (req, res) => {
  const { title, body, pic } = req.body;
  if (!title || !body || !pic) {
    return res.status(422).json({ error: "Plase add all the fields" });
  }
  // req.user.password = undefined;
  const post = new Article({
    title,
    body,
    image: pic,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.json({ post: result });
    })
    .catch((err) => {
      console.log(err);
    });
};

// const getAllArticle = async (req, res) => {
//   const name = req.query.user;

//   if (name) {
//     Article.find({ name })
//       .then((post, err) => {
//         if (err) {
//           return res.status(400).json({
//             errorInFind: err,
//           });
//         }
//         return res.status(200).json(post);
//       })
//       .catch((err) => {
//         return res.status(400).json({
//           error: "Post not found",
//         });
//       });
//   } else {
//     Article.find()
//       .then((post, err) => {
//         if (err) {
//           return res.status(400).json({
//             errorInAllPost: err,
//           });
//         }
//         return res.status(200).json(post);
//       })
//       .catch((err) => {
//         return res.status(400).json(err);
//       });
//   }
// };

const getAllArticle = async (req, res) => {
  Article.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "_id name")
    // .sort('-createdAt')
    .then((posts) => {
      res.json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
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
    req.body.postId,
    {
      $push: { likes: req.params._id },
    },
    {
      new: true,
    }
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
    req.body.postId,
    {
      $pull: { likes: req.params._id },
    },
    {
      new: true,
    }
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
