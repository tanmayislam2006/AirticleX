import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../enum/postStatus";
import paginationHelper from "../../helpers/paginationHelper";
import { UserRole } from "../../enum/userRole";

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
    const { page, limit, skip, sortBy, sortOrder } = paginationHelper(
      req.query
    );
    const result = await postServices.getAllPosts({
      search: searchStr,
      tags,
      status,
      authorID,
      isFeatures,
      page,
      limit,
      skip,
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
const getMyPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { page, limit, skip } = paginationHelper(req.query);
    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const result = await postServices.getMyPost(
      user.id as string,
      page,
      limit,
      skip
    );
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
const updatePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post ID is required");
    }
    const user = req.user;
    if (!user) {
      throw new Error("You are Unauthorized");
    }
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postServices.updatePost(
      id as string,
      user?.id,
      isAdmin,
      req.body
    );
    res.status(200).json({
      success: true,
      messages: "Update Post Data Successfully",
      data: result,
    });
  } catch (e: any) {
    const errorMessage =
      e instanceof Error ? e.message : "Can not Update Post Data";
    res.status(400).json({
      success: false,
      error: errorMessage,
      data: e,
    });
  }
};
const deletePost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Post ID is required");
    }
    const user = req.user;
    if (!user) {
      throw new Error("You are Unauthorized");
    }
    const isAdmin = user?.role === UserRole.ADMIN;
    const result = await postServices.deletePost(
      id as string,
      user?.id,
      isAdmin
    );
    res.status(200).json({
      success: true,
      messages: "Delete Post Data Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Can not delete Post Data",
      data: e,
    });
  }
};
export const postController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
};
