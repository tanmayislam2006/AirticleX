import Image from "next/image";

type Tip = {
  _id: string;
  title: string;
  plantType: string;
  difficulty: string;
  imageUrl: string;
  category: string;
  availability: string;
  userName: string;
  description: string;
  photoURL: string;
  totalLike: number;
};

async function getTips(): Promise<Tip[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const res = await fetch(
    "https://green-connect-server.vercel.app/browsetips",
    {
      cache: "no-store", // always fresh data
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch tips");
  }

  return res.json();
}

export default async function BrowseTipsPage() {
  const tips = await getTips();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-100">
          Browse Plant Care Tips 🌱
        </h1>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((tip) => (
            <div
              key={tip._id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md dark:bg-zinc-900"
            >
              {/* Image */}
              <div className="relative h-48 w-full">
                <Image
                  src={tip.imageUrl}
                  alt={tip.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-5">
                <h2 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {tip.title}
                </h2>

                <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                  {tip.description}
                </p>

                {/* Meta Info */}
                <div className="mb-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-green-100 px-3 py-1 text-green-700 dark:bg-green-900 dark:text-green-200">
                    {tip.plantType}
                  </span>
                  <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                    {tip.difficulty}
                  </span>
                  <span className="rounded-full bg-zinc-200 px-3 py-1 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {tip.category}
                  </span>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image
                      src={tip.photoURL}
                      alt={tip.userName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span className="text-sm text-zinc-700 dark:text-zinc-300">
                      {tip.userName}
                    </span>
                  </div>

                  <span className="text-sm text-zinc-600 dark:text-zinc-400">
                    ❤️ {tip.totalLike}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
