import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");


  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const videos = await prisma.video.findMany({
    where: { status: "awaiting_review" },
    include: { user: true },
    orderBy: { createdAt: "asc" }, // sort the videos in ascending format
  });



  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-2">Coach Dashboard</h1>
      <p className="text-gray-400 mb-8">
        Videos awaiting your review
      </p>

      {videos.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">No videos awaiting review</p>
          <p className="text-sm mt-2">Check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 max-w-3xl">
          {videos.map((video) => (
            <Link
              key={video.id}
              href={`/admin/review/${video.id}`}
              className="block bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-white">
                    {video.user.name}
                  </p>
                  <p className="text-sm text-gray-400">
                    {video.user.email}
                  </p>
                  <p className="text-xs text-gray-600 mt-2">
                    ID: {video.id}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block bg-yellow-500/20 text-yellow-400 text-xs px-3 py-1 rounded-full">
                    Awaiting Review
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}