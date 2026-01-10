import { CommentStatus } from "../../enum/commentStatus";
import { PostStatus } from "../../enum/postStatus";
import { Post, UserStatus } from "../../generated/prisma/client";
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
  page,
  limit,
  skip,
}: {
  search: string | undefined;
  tags: string[] | [];
  status?: PostStatus | undefined;
  authorID: string | undefined;
  isFeatures: boolean | undefined;
  page: number;
  limit: number;
  skip: number;
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
    take: limit,
    skip: skip,
    where: {
      AND: searchCondition,
    },
  });
  const total = await prisma.post.count({
    where: {
      AND: searchCondition,
    },
  });
  return {
    result,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (id: string) => {
  return await prisma.$transaction(async (tx) => {
    const post = await tx.post.findUnique({
      where: { id },
      include: {
        comments: {
          where: {
            parentID: null,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { createdAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
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
const getMyPost = async (
  id: string,
  page: number,
  limit: number,
  skip: number
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
      status: UserStatus.ACTIVE,
    },
  });
  const result = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      authorID: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return result;
};
const updatePost = async (
  id: string,
  authorID: string,
  isAdmin: boolean,
  data: Partial<Post>
) => {
  const postDataDB = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      authorID: true,
    },
  });
  if (!isAdmin && postDataDB.authorID !== authorID) {
    throw new Error("You are not the owner/creator of the post!");
  }
  if (!isAdmin) {
    delete data.isFeatures;
  }
  return await prisma.post.update({
    where: { id },
    data,
  });
};
const deletePost = async (id: string, authorID: string, isAdmin: boolean) => {
  const postDataDB = await prisma.post.findUniqueOrThrow({
    where: {
      id,
    },
    select: {
      id: true,
      authorID: true,
    },
  });
  if (!isAdmin && postDataDB.authorID !== authorID) {
    throw new Error("You are not the owner/creator of the post!");
  }
  return await prisma.post.delete({
    where: { id },
  });
};
export const postServices = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPost,
  updatePost,
  deletePost,
};
