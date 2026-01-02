import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../libs/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorID">,
  userID: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorID: userID,
    },
  });
  return result;
};
const getAllPosts = async () => {
  const result = await prisma.post.findMany();
  return result;
}
export const postServices = {
  createPost,
  getAllPosts
};
