import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwingVision",
  description: "AI Golf Swing Analyzer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Navbar */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter">
            <Link href="/">SWINGVISION</Link>
          </div>

          <div className="flex gap-4">
            <Link
              href="/sign-in"
              className="bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-200 transition"
            >
              Sign In
            </Link>
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}