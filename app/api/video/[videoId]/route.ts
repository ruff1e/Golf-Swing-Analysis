import { NextRequest, NextResponse } from "next/server";
import { auth, prisma } from "@/lib/auth";
import { headers } from "next/headers";
import { createReadStream, statSync } from "fs";
import { Readable } from "stream";



export async function GET(req: NextRequest, { params }: { params: Promise<{ videoId: string }> }) {

  // Verify the user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }


  const { videoId } = await params;
  const type = req.nextUrl.searchParams.get("type") ?? "raw";

  const video = await prisma.video.findUnique({
    where: { id: videoId },
  });

  if (!video) {
    return NextResponse.json({ error: "Video not found" }, { status: 404 });
  }


  // Only the owner or an ADMIN can view the video
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });


  if (video.userId !== session.user.id && user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }


  const filePath = type === "skeleton" ? video.procVideoPath : video.rawVideoPath;

  if (!filePath) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  
  const stat = statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.get("range");


  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const stream = createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(stream) as ReadableStream;

    return new NextResponse(webStream, {
      status: 206,
      headers: {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize.toString(),
        "Content-Type": "video/mp4",
      },
    });
  }


  const stream = createReadStream(filePath);
  const webStream = Readable.toWeb(stream) as ReadableStream;

  return new NextResponse(webStream, {
    status: 200,
    headers: {
      "Content-Length": fileSize.toString(),
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
    },
  });
}