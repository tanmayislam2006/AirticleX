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
};
