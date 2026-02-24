const COMMENTS_URL = "http://localhost:5000/api/comments";

export type CommentStatus = "APPROVED" | "REJECT";

export interface CommentPayload {
  content: string;
  postID: string;
  parentID?: string;
}

interface ApiResponse<T> {
  success: boolean;
  messages?: string;
  error?: string;
  data: T;
}

interface ServiceResult<T> {
  data: T | null;
  error: { message: string } | null;
}

interface CommentRecord {
  id: string;
  content: string;
  authorID: string;
  postID: string;
  parentID: string | null;
  status: CommentStatus;
  createdAt: string;
  updatedAt: string;
}

const parseError = async (res: Response, fallback: string) => {
  try {
    const payload = (await res.json()) as { error?: string; message?: string };
    return payload.error ?? payload.message ?? fallback;
  } catch {
    return fallback;
  }
};

const createComment = async (
  payload: CommentPayload
): Promise<ServiceResult<CommentRecord>> => {
  try {
    const res = await fetch(COMMENTS_URL, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: await parseError(res, "Failed to create comment."),
        },
      };
    }

    const json = (await res.json()) as ApiResponse<CommentRecord>;
    return {
      data: json.data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: {
        message: "Network error while creating comment.",
      },
    };
  }
};

const moderateComment = async (
  commentID: string,
  status: CommentStatus
): Promise<ServiceResult<CommentRecord>> => {
  try {
    const res = await fetch(`${COMMENTS_URL}/${commentID}/moderate`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: await parseError(res, "Failed to update comment status."),
        },
      };
    }

    const json = (await res.json()) as ApiResponse<CommentRecord>;
    return {
      data: json.data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: {
        message: "Network error while updating comment status.",
      },
    };
  }
};

const deleteComment = async (commentID: string): Promise<ServiceResult<CommentRecord>> => {
  try {
    const res = await fetch(`${COMMENTS_URL}/${commentID}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) {
      return {
        data: null,
        error: {
          message: await parseError(res, "Failed to delete comment."),
        },
      };
    }

    const json = (await res.json()) as ApiResponse<CommentRecord>;
    return {
      data: json.data,
      error: null,
    };
  } catch {
    return {
      data: null,
      error: {
        message: "Network error while deleting comment.",
      },
    };
  }
};

export const commentService = {
  createComment,
  moderateComment,
  deleteComment,
};
