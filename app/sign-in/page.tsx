"use client";
import { useState } from "react";

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState("signIn");

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
      <div className="w-full max-w-md bg-zinc-900/50 border border-white/10 p-8 rounded-2xl">
        
        {/* 1. Dynamic Titles */}
        <h1 className="text-3xl font-bold mb-2">
          {activeTab === "signIn" ? "Log in to your account" : "Create an account"}
        </h1>
        <p className="text-gray-400 mb-8">
          {activeTab === "signIn" ? "Welcome back!" : "Start improving your game today."}
        </p>

        {/* 2. SHOW SIGN IN FORM */}
        {activeTab === "signIn" && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors mt-4">
              Sign In
            </button>
            
            <p className="text-center text-sm text-gray-400 mt-6">
              Don&apos;t have an account?{" "}
              <button 
                type="button" 
                onClick={() => setActiveTab("signUp")}
                className="text-emerald-400 hover:underline"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* 3. SHOW SIGN UP FORM */}
        {activeTab === "signUp" && (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input
                type="text"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="Tiger Woods"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="name@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                className="w-full bg-black border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                placeholder="••••••••"
              />
            </div>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-lg transition-colors mt-4">
              Create Account
            </button>

            <p className="text-center text-sm text-gray-400 mt-6">
              Already have an account?{" "}
              <button 
                type="button" 
                onClick={() => setActiveTab("signIn")}
                className="text-emerald-400 hover:underline"
              >
                Sign In
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}