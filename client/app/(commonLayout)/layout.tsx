import { Navbar } from "@/components/Layout/Navbar";

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto min-h-[calc(100vh-128px)] container px-4 py-10">
      <Navbar />
      {children}
    </main>
  );
}
