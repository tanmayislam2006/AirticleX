import { Post } from "../../generated/prisma/client";
import { PostWhereInput } from "../../generated/prisma/models";
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
const getAllPosts = async ({ search }: { search: string | undefined }) => {
  const searchCondition: PostWhereInput[] = [];
  if (search) {
    searchCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }
  const result = await prisma.post.findMany({
    where: {
      AND: searchCondition,
    },
  });
  return result;
};
export const postServices = {
  createPost,
  getAllPosts,
};
