import { auth } from "@/lib/auth";
import VideoUploadClientPage from "./upload-client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if(!session) {
    redirect("/auth");
  }

  return <VideoUploadClientPage user={session.user}/>;
}