"use server";

import { revalidatePath } from "next/cache";
import { auth, prisma } from "../auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Helper to verify the current user is an ADMIN
async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) redirect("/auth");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user || user.role !== "ADMIN") redirect("/dashboard");

  return { session, user };
}



export async function submitFeedbackAction(videoId: string,content: string) {

  const { user } = await requireAdmin();

  if (!content.trim()) throw new Error("Feedback cannot be empty");

  // Create the feedback
  await prisma.feedback.create({
    data: {
      videoId,
      coachId: user.id,
      content: content.trim(),
    },
  });

  // Update the video status to completed
  await prisma.video.update({
    where: { id: videoId },
    data: { status: "completed" },
  });

  revalidatePath("/admin");
  revalidatePath("/dashboard")
}