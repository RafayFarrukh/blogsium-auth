import express from "express";

const router = express.Router();

import {
  registerUser,
  loginUser,
  getalluser,
} from "../controllers/authController.js";

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/getallusers").get(getalluser);

export default router;
