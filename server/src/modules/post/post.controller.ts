import { Request, Response } from "express";
import { postServices } from "./post.service";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(req.body, "jhj");
    res.status(201).json({
      success: false,
      messages: "Post Created Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Post Created Failed",
      data: e,
    });
  }
};
const getAllPosts = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getAllPosts();
    res.status(200).json({
      success: true,
      messages: "Posts Retrieved Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Failed to Retrieve Posts",
      data: e,
    });
  }
};
export const postController = {
  createPost,
  getAllPosts,
};
