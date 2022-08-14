import express from "express";
const router = express.Router();

import {
  createArticle,
  deleteArticle,
  updateArticle,
  getAllArticle,
  getById,
  likeArticle,
  unlikeArticle,
  commentArticle,
} from "../controllers/articlesController.js";
import requireLogin from "../middleware/requireLogin.js";
// import requireLogin from "../middleware/requireLogin.js";

router.route("/create").post(createArticle);
router.route("/all", requireLogin).get(getAllArticle);
router.route("/:id").get(getById);
router.route("/delete/:id").delete(deleteArticle);

router.route("/update/:id").put(updateArticle);
router.route("/like").put(likeArticle);
router.route("/unlike").put(unlikeArticle);
router.route("/comment").put(commentArticle);
export default router;
