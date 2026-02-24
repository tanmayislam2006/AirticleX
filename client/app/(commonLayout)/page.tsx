import Link from "next/link";
import { ArrowRight, Eye, Flame, Search } from "lucide-react";
import { Fraunces, Manrope } from "next/font/google";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BlogPost, PostStatus, blogService } from "@/services/blog.service";

const displayFont = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700"],
});

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const postStatus: PostStatus[] = ["PUBLISHED", "DRAFT", "ARCHIVED"];

type SearchParams = {
  search?: string;
  status?: PostStatus;
  tags?: string;
  page?: string;
};

type PageProps = {
  searchParams: Promise<SearchParams>;
};

export default async function Home({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const selectedStatus = postStatus.includes(params.status as PostStatus)
    ? (params.status as PostStatus)
    : undefined;
  const page = Number(params.page) > 0 ? Number(params.page) : 1;
  const selectedTags = params.tags ? params.tags.split(",").filter(Boolean) : [];

  const [postsRes, featuredRes] = await Promise.all([
    blogService.getPosts({
      search: search || undefined,
      status: selectedStatus,
      tags: selectedTags,
      page,
      limit: 9,
    }),
    blogService.getPosts({
      isFeatures: true,
      status: "PUBLISHED",
      limit: 3,
      page: 1,
    }),
  ]);

  const posts = postsRes.data?.result ?? [];
  const featuredPosts = featuredRes.data?.result ?? [];
  const pagination = postsRes.data?.pagination ?? {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 0,
  };

  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).slice(0, 8);

  return (
    <div
      className={`${displayFont.variable} ${bodyFont.variable} relative overflow-hidden pb-14`}
    >
      <div className="pointer-events-none absolute -top-28 -left-24 h-80 w-80 rounded-full bg-amber-300/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-cyan-300/25 blur-3xl" />

      <section className="relative rounded-4xl border border-zinc-200/70 bg-gradient-to-br from-white to-zinc-50 p-8 shadow-xl shadow-zinc-950/5 md:p-14">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100/70 px-3 py-1 text-xs font-semibold tracking-wide text-amber-900 uppercase">
          <Flame className="h-3.5 w-3.5" />
          Fresh ideas every day
        </p>
        <h1
          style={{ fontFamily: "var(--font-display)" }}
          className="max-w-3xl text-4xl leading-tight font-semibold tracking-tight text-zinc-900 md:text-6xl"
        >
          Stories that make complex topics simple and useful.
        </h1>
        <p className="mt-5 max-w-2xl text-base text-zinc-600 md:text-lg">
          ArticleX brings practical, deeply researched posts from creators who build,
          ship, and learn in the real world.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link href="#all-posts">
              Start Reading <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <span className="text-sm text-zinc-500">
            {pagination.total} article{pagination.total === 1 ? "" : "s"} available
          </span>
        </div>
      </section>

      {featuredPosts.length > 0 && (
        <section className="mt-12">
          <div className="mb-5 flex items-end justify-between gap-4">
            <h2
              style={{ fontFamily: "var(--font-display)" }}
              className="text-2xl font-semibold text-zinc-900 md:text-3xl"
            >
              Featured stories
            </h2>
            <span className="text-sm text-zinc-500">Editor picks</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredPosts.map((post) => (
              <Card
                key={post.id}
                className="group overflow-hidden rounded-3xl border-zinc-200/80 bg-white/85 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10"
              >
                <CardContent className="p-0">
                  <Link href={`/posts/${post.id}`} className="block">
                    {post.thumbnail ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.thumbnail}
                        alt={post.title}
                        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-44 w-full items-center justify-center bg-gradient-to-r from-cyan-100 to-amber-100 text-sm font-medium text-zinc-600">
                        No thumbnail
                      </div>
                    )}
                    <div className="space-y-3 p-5">
                      <p className="text-xs font-semibold tracking-wide text-zinc-500 uppercase">
                        {formatDate(post.createdAt)}
                      </p>
                      <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900">
                        {post.title}
                      </h3>
                      <p className="line-clamp-3 text-sm text-zinc-600">
                        {excerpt(post.content, 120)}
                      </p>
                    </div>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section id="all-posts" className="mt-12">
        <div className="rounded-3xl border border-zinc-200/80 bg-white/90 p-5 md:p-6">
          <form className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                name="search"
                defaultValue={search}
                placeholder="Search title, content, or tags"
                className="h-11 rounded-xl border-zinc-300 bg-white pl-9"
              />
            </div>
            <select
              name="status"
              defaultValue={selectedStatus ?? ""}
              className="h-11 rounded-xl border border-zinc-300 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-zinc-300"
            >
              <option value="">All status</option>
              {postStatus.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button type="submit" className="h-11 rounded-xl px-6">
              Apply filters
            </Button>
          </form>

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag) => {
                const isActive = selectedTags.includes(tag);
                const nextTags = isActive
                  ? selectedTags.filter((selectedTag) => selectedTag !== tag)
                  : [...selectedTags, tag];

                return (
                  <Link
                    key={tag}
                    href={queryString({
                      search,
                      status: selectedStatus,
                      tags: nextTags,
                      page: 1,
                    })}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                      isActive
                        ? "border-zinc-900 bg-zinc-900 text-white"
                        : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
                    }`}
                  >
                    #{tag}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {postsRes.error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {postsRes.error.message}
          </p>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {posts.length === 0 && (
          <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-zinc-50 p-10 text-center">
            <p className="text-lg font-semibold text-zinc-800">No posts found</p>
            <p className="mt-2 text-sm text-zinc-500">
              Try another search term, status, or tag.
            </p>
          </div>
        )}

        {pagination.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (pageNo) => (
                <Link
                  key={pageNo}
                  href={queryString({
                    search,
                    status: selectedStatus,
                    tags: selectedTags,
                    page: pageNo,
                  })}
                  className={`inline-flex h-9 min-w-9 items-center justify-center rounded-lg border px-3 text-sm font-semibold transition ${
                    pageNo === pagination.page
                      ? "border-zinc-900 bg-zinc-900 text-white"
                      : "border-zinc-300 bg-white text-zinc-600 hover:border-zinc-500 hover:text-zinc-900"
                  }`}
                >
                  {pageNo}
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  return (
    <Card className="group rounded-3xl border-zinc-200/80 bg-white/90 py-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-zinc-900/10">
      <CardContent className="p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-600">
            {post.status}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
            <Eye className="h-3.5 w-3.5" />
            {post.views.toLocaleString()} views
          </span>
        </div>
        <h3 className="line-clamp-2 text-lg font-semibold text-zinc-900">{post.title}</h3>
        <p className="mt-3 line-clamp-4 text-sm text-zinc-600">{excerpt(post.content, 155)}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-xs text-zinc-500">{formatDate(post.createdAt)}</p>
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link href={`/posts/${post.id}`}>
              Read article
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function excerpt(content: string, maxLength = 120) {
  const plainText = content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (plainText.length <= maxLength) {
    return plainText;
  }
  return `${plainText.slice(0, maxLength - 1)}...`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function queryString({
  search,
  status,
  tags,
  page,
}: {
  search?: string;
  status?: PostStatus;
  tags?: string[];
  page?: number;
}) {
  const params = new URLSearchParams();

  if (search) {
    params.set("search", search);
  }

  if (status) {
    params.set("status", status);
  }

  if (tags && tags.length > 0) {
    params.set("tags", tags.join(","));
  }

  if (page && page > 1) {
    params.set("page", String(page));
  }

  const query = params.toString();
  return query ? `/?${query}` : "/";
}
