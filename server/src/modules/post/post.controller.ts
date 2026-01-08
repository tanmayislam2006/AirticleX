import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../enum/postStatus";

const createPost = async (req: Request, res: Response) => {
  try {
    const result = await postServices.createPost(
      req.body,
      req.user!.id as string
    );
    res.status(201).json({
      success: true,
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
    const { search } = req.query;
    const searchStr = typeof search === "string" ? search : undefined;
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    const status = req.query.status as PostStatus | undefined;
    const authorID = req.query.authorID as string | undefined;
    const isFeatures = req.query.isFeatures
      ? req.query.isFeatures === "true"
        ? true
        : req.query.isFeatures === "false"
        ? false
        : undefined
      : undefined;

    const result = await postServices.getAllPosts({
      search: searchStr,
      tags,
      status,
      authorID,
      isFeatures,
    });
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
const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post ID is required");
    }
    const result = await postServices.getPostById(id as string);
    res.status(200).json({
      success: true,
      messages: "Post Data Get Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Can not Get Post Data",
      data: e,
    });
  }
};
export const postController = {
  createPost,
  getAllPosts,
  getPostById,
};
