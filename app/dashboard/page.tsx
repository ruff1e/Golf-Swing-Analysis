import { auth, prisma } from "@/lib/auth";
import DashboardClientPage from "./dashboard-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if(!session) {
    redirect("/auth");
  }

  const videos = await prisma.video.findMany({
    where: {
      userId: session.user.id,
    },
  });

  return <DashboardClientPage user={session.user} videos={videos}/>;
}