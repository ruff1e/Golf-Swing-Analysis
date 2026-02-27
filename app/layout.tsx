import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "./components/SignOutButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SwingVision",
  description: "AI Golf Swing Analyzer",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check for an active session on the server
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        {/* Navbar */}
        <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
          <div className="text-2xl font-bold tracking-tighter">
            <Link href="/">SWINGVISION</Link>
          </div>

          <div className="flex gap-6 items-center">
            {session ? (
              <>
                <Link 
                  href="/upload" 
                  className="text-sm font-medium text-gray-400 hover:text-emerald-400 transition"
                >
                  Upload Swing
                </Link>
                <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-emerald-400 transition">
                  Dashboard
                </Link>
                
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-black text-xs">
                    {session.user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <Link
                href="/auth"
                className="bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-gray-200 transition"
              >
                Sign In
              </Link>
            )}
          </div>
        </nav>

        {children}
      </body>
    </html>
  );
}