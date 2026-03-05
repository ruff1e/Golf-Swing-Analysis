import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function VideoDetailPage({params,}: {params: Promise<{ videoId: string }>; }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  const { videoId } = await params;

  const video = await prisma.video.findUnique({
    where: { id: videoId },
    include: { feedback: true },
  });

  if (!video || video.userId !== session.user.id) notFound();

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/dashboard" className="text-gray-500 hover:text-white mb-8 block">
          ← Back to Dashboard
        </Link>

        <h1 className="text-3xl font-bold mb-6">Swing Analysis</h1>

        <div className="bg-gray-900 rounded-2xl overflow-hidden border border-white/10 mb-8">
          <video 
            src={`/api/video/${videoId}?type=skeleton`} 
            controls 
            className="w-full aspect-video bg-black"
          />
        </div>

        {video.feedback ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
            <h2 className="text-emerald-400 font-semibold mb-2">Coach's Feedback</h2>
            <p className="text-gray-300 leading-relaxed">{video.feedback.content}</p>
          </div>
        ) : (
          <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-2xl text-yellow-500">
            AI processing complete. Awaiting coach feedback.
          </div>
        )}
      </div>
    </div>
  );
}