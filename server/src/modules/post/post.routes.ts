import { Router } from "express";
import { postController } from "./post.controller";
import auth from "../../middleware/authMiddleware";
import { UserRole } from "../../enum/userRole";

const router = Router();
router.get("/", postController.getAllPosts);
router.get(
  "/my-posts",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.getMyPost
);
router.get("/states", auth(UserRole.ADMIN), postController.getAdminStates);
router.get("/:id", postController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);
router.patch(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.updatePost
);
router.delete(
  "/:id",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.deletePost
);

export const postRouter: Router = router;
