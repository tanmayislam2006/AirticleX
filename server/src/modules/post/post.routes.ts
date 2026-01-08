import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "../../enum/userRole";

const router = Router();
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);

export const postRouter: Router = router;
