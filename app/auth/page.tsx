import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthClientPage from "./auth-page";
import { redirect } from "next/navigation";


export default async function AuthPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });


  if(session) {
    redirect("/dashboard");
  }

  return <AuthClientPage />;
}