"use client";

import { User } from "better-auth";
import Link from "next/link";

interface Video {
  id: string;
  status: string;
  createdAt: Date;
}

export default function DashboardClientPage({user, videos,}: {user: User; videos: Video[];}) {
    
  const totalSwings = videos.length;

  const processingCount = videos.filter(
    (v) => v.status === "pending_skeleton"
  ).length;

  const completedCounts = videos.filter(
    (v) => v.status === "completed"
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Welcome, <span className="text-emerald-400">{user.name}</span>
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Ready to shave some strokes off your game?
          </p>
        </div>

        <Link
          href="/upload"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95"
        >
          Upload New Swing
        </Link>
      </div>

      {/* Stats/Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
        {[
          { label: "Total Swings", value: totalSwings, color: "text-white" },
          {
            label: "AI Processing",
            value: processingCount,
            color: "text-amber-500",
          },
          {
            label: "Coach Reviewed",
            value: completedCounts,
            color: "text-emerald-500",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-zinc-900/50 border border-white/10 p-6 rounded-2xl"
          >
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              {stat.label}
            </p>
            <p className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Recent Sessions</h2>

        {/* Show Gallery if videos exist otherwise show Empty State */}
        {totalSwings === 0 ? (
          <div className="border-2 border-dashed border-white/5 rounded-3xl p-20 flex flex-col items-center justify-center text-center bg-zinc-900/20">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 text-emerald-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">
              No swings found
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Upload a video of your swing from down-the-line or face-on to get
              your first AI analysis.
            </p>
            <Link
              href="/upload"
              className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-2"
            >
              Get started now <span>&rarr;</span>
            </Link>
          </div>
        ) : (
          /* 3. The Video Gallery Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors"
              >
                {/* Video Thumbnail Placeholder */}
                <div className="aspect-video bg-black flex items-center justify-center relative">
                  <span className="text-gray-700 font-bold italic tracking-widest">
                    SWING VISION
                  </span>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        video.status === "completed"
                          ? "bg-emerald-500/20 text-emerald-500"
                          : "bg-amber-500/20 text-amber-500"
                      }`}
                    >
                      {video.status.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-white font-semibold text-sm">
                      Session {video.id.slice(-4).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Link
                    href={`/dashboard/video/${video.id}`}
                    className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center hover:bg-emerald-500 transition-colors group"
                  >
                    <span className="text-white group-hover:text-black">
                      &rarr;
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}