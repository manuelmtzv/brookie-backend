import Router from "express"; 
import reviewController from "../Controllers/review.controllers.js"
import { userAuth } from "../middleware/userAuth.js";

const router = Router();

// Unprotected routes
router.route("/get/:id")
  .get(reviewController.getById); 

// Middleware to check user auth
router.use(userAuth); 

// Protected routes
router.route("/")
  .get(reviewController.get); 

router.route("/user")
  .get(reviewController.getUserReviews)

router.route("/create")
  .post(reviewController.createReview); 

router.route("/delete/:id")
  .delete(reviewController.deleteById); 

export default router; 