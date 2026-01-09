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
export const commentService = {
  createComment,
};
