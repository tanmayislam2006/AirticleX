import { PostStatus } from "../../enum/postStatus";
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
const getAllPosts = async ({
  search,
  tags,
  status,
  authorID,
  isFeatures,
}: {
  search: string | undefined;
  tags: string[] | [];
  status?: PostStatus | undefined;
  authorID: string | undefined;
  isFeatures: boolean | undefined;
}) => {
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

  if (tags.length > 0) {
    searchCondition.push({
      tags: {
        hasEvery: tags,
      },
    });
  }

  if (status) {
    searchCondition.push({
      status,
    });
  }

  if (authorID) {
    searchCondition.push({
      authorID,
    });
  }

  if (typeof isFeatures === "boolean") {
    searchCondition.push({
      isFeatures,
    });
  }
  const result = await prisma.post.findMany({
    where: {
      AND: searchCondition,
    },
  });
  return result;
};

const getPostById = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
    });
    if (post) {
      await tx.post.update({
        where: { id },
        data: { views: { increment: 1 } },
      });
    }
    return post;
  });
};

export const postServices = {
  createPost,
  getAllPosts,
  getPostById,
};
