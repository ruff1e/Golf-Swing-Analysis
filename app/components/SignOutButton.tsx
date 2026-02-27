"use client";

import { signOut } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/");
        router.refresh();
      }}
      className="text-sm text-gray-500 hover:text-red-400 transition"
    >
      Sign Out
    </button>
  );
}