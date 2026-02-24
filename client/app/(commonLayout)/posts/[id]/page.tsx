import Link from "next/link";
import { Eye, MessageCircle, Tag } from "lucide-react";
import { notFound } from "next/navigation";

import { PostComments } from "@/components/post/post-comments";
import { blogService } from "@/services/blog.service";
import { userService } from "@/services/user.service";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostDetailsPage({ params }: PageProps) {
  const { id } = await params;

  const [postRes, sessionRes] = await Promise.all([
    blogService.getPostById(id),
    userService.getSessionUser(),
  ]);

  if (!postRes.data || postRes.error) {
    notFound();
  }

  const post = postRes.data;
  const currentUser = sessionRes.data?.user ?? null;

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-10">
      <Link
        href="/"
        className="inline-flex items-center rounded-full border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-500 hover:text-zinc-900"
      >
        Back to all posts
      </Link>

      <article className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white/90 shadow-sm">
        {post.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.thumbnail}
            alt={post.title}
            className="h-64 w-full object-cover md:h-80"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-gradient-to-r from-cyan-100 to-amber-100 text-sm font-semibold text-zinc-600">
            ArticleX
          </div>
        )}

        <div className="space-y-6 p-6 md:p-10">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-zinc-900 px-3 py-1 text-xs font-semibold text-white">
              {post.status}
            </span>
            {post.isFeatures && (
              <span className="rounded-full border border-zinc-300 px-3 py-1 text-xs font-semibold text-zinc-700">
                Featured
              </span>
            )}
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500">
            <span>{formatDate(post.createdAt)}</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()} views
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="h-4 w-4" />
              {post._count.comments.toLocaleString()} comments
            </span>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-medium text-zinc-600"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="prose prose-zinc max-w-none">
            <p className="whitespace-pre-wrap text-[15px] leading-7 text-zinc-700">
              {stripHtml(post.content)}
            </p>
          </div>
        </div>
      </article>

      <PostComments postID={post.id} comments={post.comments} currentUser={currentUser} />
    </div>
  );
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, "").trim();
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
