const POSTS_URL = "http://localhost:5000/api/posts";

export type PostStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  isFeatures: boolean;
  status: PostStatus;
  tags: string[];
  views: number;
  authorID: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BlogComment {
  id: string;
  content: string;
  authorID: string;
  postID: string;
  parentID: string | null;
  status: "APPROVED" | "REJECT";
  createdAt: string;
  updatedAt: string;
  replies: BlogComment[];
}

interface PostDetailPayload extends BlogPost {
  comments: BlogComment[];
  _count: {
    comments: number;
  };
}

interface PostsPayload {
  result: BlogPost[];
  pagination: PaginationMeta;
}

interface ApiResponse<T> {
  success: boolean;
  messages?: string;
  data: T;
}

interface GetPostsQuery {
  search?: string;
  tags?: string[];
  status?: PostStatus;
  isFeatures?: boolean;
  authorID?: string;
  page?: number;
  limit?: number;
}

interface ServiceResult<T> {
  data: T | null;
  error: { message: string } | null;
}

const defaultPagination: PaginationMeta = {
  total: 0,
  page: 1,
  limit: 9,
  totalPages: 0,
};

const buildParams = (query: GetPostsQuery) => {
  const params = new URLSearchParams();

  if (query.search) {
    params.set("search", query.search);
  }

  if (query.tags && query.tags.length > 0) {
    params.set("tags", query.tags.join(","));
  }

  if (query.status) {
    params.set("status", query.status);
  }

  if (typeof query.isFeatures === "boolean") {
    params.set("isFeatures", String(query.isFeatures));
  }

  if (query.authorID) {
    params.set("authorID", query.authorID);
  }

  if (query.page) {
    params.set("page", String(query.page));
  }

  if (query.limit) {
    params.set("limit", String(query.limit));
  }

  return params;
};

const getPosts = async (
  query: GetPostsQuery = {}
): Promise<ServiceResult<PostsPayload>> => {
  try {
    const params = buildParams(query);
    const url = params.toString() ? `${POSTS_URL}?${params}` : POSTS_URL;

    const res = await fetch(url, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: null,
        error: { message: "Could not load posts from server." },
      };
    }

    const json = (await res.json()) as ApiResponse<PostsPayload>;
    return {
      data: json.data,
      error: null,
    };
  } catch {
    return {
      data: {
        result: [],
        pagination: defaultPagination,
      },
      error: { message: "Network error while loading posts." },
    };
  }
};

const getPostById = async (id: string): Promise<ServiceResult<PostDetailPayload>> => {
  try {
    const res = await fetch(`${POSTS_URL}/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        data: null,
        error: { message: "Could not load post details from server." },
      };
    }

    const json = (await res.json()) as ApiResponse<PostDetailPayload>;
    return {
      data: json.data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: { message: "Network error while loading post details." },
    };
  }
};

export const blogService = {
  getPosts,
  getPostById,
};
