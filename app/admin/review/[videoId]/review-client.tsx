"use client";

import { useRef, useState } from "react";
import { submitFeedbackAction } from "@/lib/actions/admin-actions";
import { useRouter } from "next/navigation";

interface Props {
  videoId: string;
  rawVideoUrl: string;
  skeletonVideoUrl: string;
  userName: string;
}

export default function ReviewClient({ videoId, rawVideoUrl, skeletonVideoUrl, userName,}: Props) {

  const rawRef = useRef<HTMLVideoElement>(null);
  const skelRef = useRef<HTMLVideoElement>(null);
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Sync both videos together
  function syncVideos( source: HTMLVideoElement, target: HTMLVideoElement ) {
    target.currentTime = source.currentTime;
  }

  function handlePlay() {
    if (rawRef.current && rawRef.current.readyState >= 2) {
      rawRef.current.play().catch(() => console.log("Raw video play failed"));
    }
    if (skelRef.current && skelRef.current.readyState >= 2) {
      skelRef.current.play().catch(() => console.log("Skeleton video play failed"));
    }
  }

  function handlePause() {
    rawRef.current?.pause();
    skelRef.current?.pause();
  }

  function handleSeek(source: "raw" | "skeleton") {
    const src = source === "raw" ? rawRef.current : skelRef.current;
    const tgt = source === "raw" ? skelRef.current : rawRef.current;
    if (src && tgt) syncVideos(src, tgt);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Please write some feedback before submitting.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      await submitFeedbackAction(videoId, feedback);
      router.push("/admin"); // Go back to admin dashboard after submitting
      router.refresh();
    } catch (err) {
      setError("Failed to submit feedback. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Side by side video player */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">
            Original Swing
          </p>
          <video
            ref={rawRef}
            src={rawVideoUrl}
            className="w-full rounded-lg bg-black"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={() => handleSeek("raw")}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-400 font-medium">
            AI Skeleton Overlay
          </p>
          <video
            ref={skelRef}
            src={skeletonVideoUrl}
            className="w-full rounded-lg bg-black"
            controls
            onPlay={handlePlay}
            onPause={handlePause}
            onSeeked={() => handleSeek("skeleton")}
          />
        </div>
      </div>

      {/* Feedback form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Feedback for {userName}
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            placeholder="Write your coaching feedback here..."
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}