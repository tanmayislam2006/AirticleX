import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Layout/Navbar";
import { ThemeProvider } from "./providers/ThemeProvider";

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
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {/* Page Content */}
          <main className="mx-auto min-h-[calc(100vh-128px)] container px-4 py-10">
            {children}
          </main>
          {/* Footer */}
          <footer className="border-t">
            <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-muted-foreground">
              © {new Date().getFullYear()} ArticleX. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
