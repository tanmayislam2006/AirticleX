"use client";

import { useMemo, useState } from "react";
import { MessageSquareMore, Reply, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { BlogComment } from "@/services/blog.service";
import { CommentStatus, commentService } from "@/services/comment.service";
import { SessionUser } from "@/services/user.service";

type PostCommentsProps = {
  postID: string;
  comments: BlogComment[];
  currentUser: SessionUser | null;
};

type LoadingState = {
  type: "create" | "reply" | "moderate" | "delete";
  targetID?: string;
};

export function PostComments({ postID, comments, currentUser }: PostCommentsProps) {
  const router = useRouter();
  const [commentDraft, setCommentDraft] = useState("");
  const [replyDraftByID, setReplyDraftByID] = useState<Record<string, string>>({});
  const [replyTargetID, setReplyTargetID] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<LoadingState | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";
  const visibleComments = useMemo(
    () => comments.filter((comment) => canSeeComment(comment, currentUser, isAdmin)),
    [comments, currentUser, isAdmin]
  );

  const submitRootComment = async () => {
    const content = commentDraft.trim();
    if (!content) {
      setError("Comment can not be empty.");
      return;
    }
    setError("");
    setLoading({ type: "create" });
    const result = await commentService.createComment({ content, postID });
    setLoading(null);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setCommentDraft("");
    router.refresh();
  };

  const submitReply = async (parentID: string) => {
    const content = (replyDraftByID[parentID] ?? "").trim();
    if (!content) {
      setError("Reply can not be empty.");
      return;
    }
    setError("");
    setLoading({ type: "reply", targetID: parentID });
    const result = await commentService.createComment({
      content,
      postID,
      parentID,
    });
    setLoading(null);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setReplyDraftByID((prev) => ({ ...prev, [parentID]: "" }));
    setReplyTargetID(null);
    router.refresh();
  };

  const updateStatus = async (commentID: string, status: CommentStatus) => {
    setError("");
    setLoading({ type: "moderate", targetID: commentID });
    const result = await commentService.moderateComment(commentID, status);
    setLoading(null);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  };

  const removeComment = async (commentID: string) => {
    setError("");
    setLoading({ type: "delete", targetID: commentID });
    const result = await commentService.deleteComment(commentID);
    setLoading(null);

    if (result.error) {
      setError(result.error.message);
      return;
    }
    router.refresh();
  };

  return (
    <section className="rounded-3xl border border-zinc-200/80 bg-white/90 p-5 md:p-7">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-900">Discussion</h2>
          <p className="text-sm text-zinc-500">
            {visibleComments.length} top-level comment
            {visibleComments.length === 1 ? "" : "s"}
          </p>
        </div>
      </header>

      {!currentUser ? (
        <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 text-sm text-zinc-600">
          Sign in to post comments and replies.
        </div>
      ) : (
        <div className="mb-7 rounded-2xl border border-zinc-200 bg-zinc-50/70 p-4">
          <label htmlFor="new-comment" className="mb-2 block text-sm font-medium text-zinc-700">
            Add a comment
          </label>
          <textarea
            id="new-comment"
            value={commentDraft}
            onChange={(event) => setCommentDraft(event.target.value)}
            className="min-h-28 w-full resize-y rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Share your thoughts on this article"
          />
          <div className="mt-3 flex justify-end">
            <Button
              type="button"
              onClick={submitRootComment}
              disabled={loading?.type === "create"}
              className="rounded-full"
            >
              <MessageSquareMore className="h-4 w-4" />
              {loading?.type === "create" ? "Posting..." : "Post comment"}
            </Button>
          </div>
        </div>
      )}

      {error && (
        <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {visibleComments.length === 0 && (
          <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-sm text-zinc-500">
            No comments yet. Be the first to join the discussion.
          </p>
        )}

        {visibleComments.map((comment) => (
          <CommentNode
            key={comment.id}
            comment={comment}
            depth={0}
            currentUser={currentUser}
            isAdmin={isAdmin}
            loading={loading}
            replyTargetID={replyTargetID}
            setReplyTargetID={setReplyTargetID}
            replyDraftByID={replyDraftByID}
            setReplyDraftByID={setReplyDraftByID}
            onReplySubmit={submitReply}
            onModerate={updateStatus}
            onDelete={removeComment}
          />
        ))}
      </div>
    </section>
  );
}

type CommentNodeProps = {
  comment: BlogComment;
  depth: number;
  currentUser: SessionUser | null;
  isAdmin: boolean;
  loading: LoadingState | null;
  replyTargetID: string | null;
  setReplyTargetID: (id: string | null) => void;
  replyDraftByID: Record<string, string>;
  setReplyDraftByID: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onReplySubmit: (parentID: string) => Promise<void>;
  onModerate: (commentID: string, status: CommentStatus) => Promise<void>;
  onDelete: (commentID: string) => Promise<void>;
};

function CommentNode({
  comment,
  depth,
  currentUser,
  isAdmin,
  loading,
  replyTargetID,
  setReplyTargetID,
  replyDraftByID,
  setReplyDraftByID,
  onReplySubmit,
  onModerate,
  onDelete,
}: CommentNodeProps) {
  if (!canSeeComment(comment, currentUser, isAdmin)) {
    return null;
  }

  const canReply = Boolean(currentUser);
  const isOwner = currentUser?.id === comment.authorID;
  const isReplyOpen = replyTargetID === comment.id;
  const authorLabel = isOwner ? "You" : `User ${comment.authorID.slice(0, 8)}`;

  return (
    <article
      className={`rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm ${
        depth > 0 ? "ml-4 md:ml-8" : ""
      }`}
    >
      <header className="mb-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
        <span className="font-semibold text-zinc-700">{authorLabel}</span>
        <span>•</span>
        <span>{new Date(comment.createdAt).toLocaleString()}</span>
        {isAdmin && (
          <>
            <span>•</span>
            <span
              className={`rounded-full px-2 py-0.5 font-semibold ${
                comment.status === "APPROVED"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {comment.status}
            </span>
          </>
        )}
      </header>

      <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-800">{comment.content}</p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {canReply && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => setReplyTargetID(isReplyOpen ? null : comment.id)}
            className="h-8 rounded-full px-3"
          >
            <Reply className="h-3.5 w-3.5" />
            Reply
          </Button>
        )}

        {isOwner && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={() => onDelete(comment.id)}
            disabled={loading?.type === "delete" && loading.targetID === comment.id}
            className="h-8 rounded-full px-3 text-red-700 hover:text-red-800"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {loading?.type === "delete" && loading.targetID === comment.id
              ? "Deleting..."
              : "Delete"}
          </Button>
        )}

        {isAdmin && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() =>
              onModerate(comment.id, comment.status === "APPROVED" ? "REJECT" : "APPROVED")
            }
            disabled={loading?.type === "moderate" && loading.targetID === comment.id}
            className="h-8 rounded-full px-3"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            {loading?.type === "moderate" && loading.targetID === comment.id
              ? "Saving..."
              : comment.status === "APPROVED"
              ? "Reject"
              : "Approve"}
          </Button>
        )}
      </div>

      {isReplyOpen && canReply && (
        <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-3">
          <textarea
            value={replyDraftByID[comment.id] ?? ""}
            onChange={(event) =>
              setReplyDraftByID((prev) => ({
                ...prev,
                [comment.id]: event.target.value,
              }))
            }
            className="min-h-20 w-full resize-y rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            placeholder="Write a reply"
          />
          <div className="mt-3 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setReplyTargetID(null)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onReplySubmit(comment.id)}
              disabled={loading?.type === "reply" && loading.targetID === comment.id}
              className="rounded-full"
            >
              {loading?.type === "reply" && loading.targetID === comment.id
                ? "Posting..."
                : "Post reply"}
            </Button>
          </div>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUser={currentUser}
              isAdmin={isAdmin}
              loading={loading}
              replyTargetID={replyTargetID}
              setReplyTargetID={setReplyTargetID}
              replyDraftByID={replyDraftByID}
              setReplyDraftByID={setReplyDraftByID}
              onReplySubmit={onReplySubmit}
              onModerate={onModerate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </article>
  );
}

function canSeeComment(comment: BlogComment, user: SessionUser | null, isAdmin: boolean) {
  if (isAdmin) {
    return true;
  }
  if (comment.status === "APPROVED") {
    return true;
  }
  return user?.id === comment.authorID;
}
