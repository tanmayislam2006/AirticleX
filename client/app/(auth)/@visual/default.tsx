import Link from "next/link";

export default function AuthVisual() {
  return (
    <div className="max-w-sm space-y-6 text-center">
      <Link href="/" className="text-3xl font-bold tracking-tight">
        ArticleX
      </Link>
      <p className="text-zinc-300">
        Read, write, and share meaningful articles.
      </p>
    </div>
  );
}
