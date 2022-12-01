import { Router } from "express";
import userController from "../Controllers/user.controllers.js"

const router = Router();

router.route("/login")
  .post(userController.loginUser)

router.route("/signup")
  .post(userController.signupUser)

export default router;