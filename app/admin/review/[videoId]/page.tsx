import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import ReviewClient from "./review-client";

export default async function ReviewPage({params,}: {params: Promise<{ videoId: string }>;})  {

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  const { videoId } = await params;

  // get the video with the uploaders info
  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { user: true },
  });

  if (!video) notFound();
  if (video.status !== "awaiting_review") redirect("/admin");


  const rawVideoUrl = `/api/video/${videoId}?type=raw`;
  const skeletonVideoUrl = `/api/video/${videoId}?type=skeleton`;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin"
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">Review Swing</h1>
          <p className="text-gray-400 mt-1">
            User: {video.user.name} ({video.user.email})
          </p>
        </div>

        <ReviewClient
          videoId={videoId}
          rawVideoUrl={rawVideoUrl}
          skeletonVideoUrl={skeletonVideoUrl}
          userName={video.user.name}
        />
      </div>
    </div>
  );
}