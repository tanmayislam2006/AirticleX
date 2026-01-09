import { Router } from "express";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "../../enum/userRole";
import { commentController } from "./comment.controller";
const router = Router();
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
export const commentRouter: Router = router;
