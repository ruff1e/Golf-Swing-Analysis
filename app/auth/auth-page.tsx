"use client";

import { useState } from "react";
import { signIn } from "@/lib/actions/auth-actions";
import { signUp } from "@/lib/actions/auth-actions";
import { useRouter } from "next/navigation";


export default function AuthClientPage() {

  const [activeTab, setActiveTab] = useState("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  

  // Auth Handler Function
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");


    // try to sign in the user
    try {
      if (activeTab === "signIn") {
        const result = await signIn(email, password);
        if(result.user) {
          router.push("/dashboard");
          router.refresh();
        }
        else {
          setError("invalid email or password");
        }
      } 
      // if the user is not signing in, they must be signing up, so we create a new account for them
      else {
        const result = await signUp(email, password, name);
        if(result.user) {
          router.push("/");
          router.refresh();
        }
        else {
          setError("Error while creating the user")
        }
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-8 rounded-2xl shadow-2xl">
        
        {/* Dynamic Titles */}
        <h1 className="text-3xl font-bold mb-2">
          {activeTab === "signIn" ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-gray-400 mb-8">
          {activeTab === "signIn" ? "Log in to your account." : "Start improving your game today."}
        </p>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailAuth} className="space-y-4">
          {/* Sign Up Specific Field */}
          {activeTab === "signUp" && (
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={activeTab === "signUp"}
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
                placeholder="Tiger Woods"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
              placeholder="name@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition"
              placeholder="••••••••"
            />
          </div>

          <button 
            disabled={isLoading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-all mt-4 flex items-center justify-center"
          >
            {isLoading ? (
              <span className="animate-pulse">Processing...</span>
            ) : (
              activeTab === "signIn" ? "Sign In" : "Create Account"
            )}
          </button>
        </form>

        {/* Toggle between sign in and sign up */}
        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={() => {
              setActiveTab(activeTab === "signIn" ? "signUp" : "signIn");
              setError("");
            }}
            className="text-emerald-400 hover:text-emerald-300 text-sm font-medium transition"
          >
            {activeTab === "signIn" 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}