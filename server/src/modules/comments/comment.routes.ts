import { Router } from "express";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "../../enum/userRole";
import { commentController } from "./comment.controller";
const router = Router();
router.get("/:commentID", commentController.getCommentById);
router.get("/author/:authorID", commentController.getCommentsByAuthor);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);
router.delete(
  "/:commentID",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment
);
export const commentRouter: Router = router;
