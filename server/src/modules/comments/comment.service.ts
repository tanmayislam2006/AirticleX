import { CommentStatus } from "../../enum/commentStatus";
import { prisma } from "../../libs/prisma";

const createComment = async (data: {
  content: string;
  authorID: string;
  postID: string;
  parentID?: string;
}) => {
  await prisma.post.findFirstOrThrow({ where: { id: data.postID } });
  if (data.parentID) {
    await prisma.comment.findFirstOrThrow({ where: { id: data.parentID } });
  }
  const result = await prisma.comment.create({
    data,
  });
  return result;
};
const getCommentById = async (id: string) => {
  return await prisma.comment.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      post: {
        select: {
          id: true,
          title: true,
          views: true,
        },
      },
    },
  });
};
const getCommentsByAuthor = async (authorID: string) => {
  return await prisma.comment.findMany({
    where: {
      authorID,
    },
  });
};
const updateComment = async (
  authorID: string,
  commentID: string,
  data: { content?: string; status?: CommentStatus }
) => {
  const isOwner = await prisma.comment.findFirst({
    where: {
      id: commentID,
      authorID,
    },
    select: {
      id: true,
      status: true,
    },
  });
  if (!isOwner) {
    throw new Error("Your provided input is invalid!");
  }
  if (isOwner.status === data.status) {
    throw new Error(`Your provided status ${data.status} is up to date`);
  }
  return await prisma.comment.update({
    where: {
      id: commentID,
      authorID,
    },
    data,
  });
};
const moderateComment = async (
  commentID: string,
  data: { content?: string; status?: CommentStatus }
) => {
  const isOwner = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentID,
    },
    select: {
      id: true,
      status: true,
    },
  });

  if (isOwner.status === data.status) {
    throw new Error(`Your provided status ${data.status} is up to date`);
  }
  return await prisma.comment.update({
    where: {
      id: commentID,
    },
    data,
  });
};
const deleteComment = async (authorID: string, commentID: string) => {
  const isOwner = await prisma.comment.findFirst({
    where: {
      id: commentID,
      authorID,
    },
    select: {
      id: true,
    },
  });
  if (!isOwner) {
    throw new Error("Your provided input is invalid!");
  }
  return await prisma.comment.delete({
    where: {
      id: commentID,
    },
  });
};

export const commentService = {
  createComment,
  getCommentById,
  getCommentsByAuthor,
  deleteComment,
  updateComment,
  moderateComment,
};
