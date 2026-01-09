import { Request, Response } from "express";
import { commentService } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorID = user?.id;
    const result = await commentService.createComment(req.body);
    res.status(201).json({
      success: true,
      messages: "Comment Created Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Can Not Create Comment",
      data: e,
    });
  }
};
const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentID } = req.params;
    const result = await commentService.getCommentById(commentID as string);
    res.status(200).json({
      success: true,
      messages: "Comment Fetch Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Can Not Fetch Comment",
      data: e,
    });
  }
};
const getCommentsByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorID } = req.params;
    const result = await commentService.getCommentsByAuthor(authorID as string);
    res.status(200).json({
      success: true,
      messages: "Comment Fetch Successfully",
      data: result,
    });
  } catch (e: any) {
    res.status(400).json({
      success: false,
      error: "Can Not Fetch Comment",
      data: e,
    });
  }
};
export const commentController = {
  createComment,
  getCommentById,
  getCommentsByAuthor
};
