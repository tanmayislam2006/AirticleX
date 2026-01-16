import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "ArticleX",
  description: "Read, write, and share articles",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-white font-sans antialiased text-zinc-900`}
      >
        {/* Top Navigation */}
        <header className="border-b border-zinc-200">
          <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
            <span className="text-lg font-semibold tracking-tight">
              ArticleX
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="mx-auto min-h-[calc(100vh-128px)] max-w-6xl px-6 py-10">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200">
          <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-zinc-500">
            © {new Date().getFullYear()} ArticleX. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
