"use client";

import { User } from "better-auth";
import { useState } from "react";
import { uploadVideoAction } from "@/lib/actions/upload-actions";
import { useRouter } from "next/navigation";

export default function UploadClient({ user }: {user: User}) {

  const [file, setFile] = useState<File | null>(null); // it will eventually be a "File" but currently its null
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setError("");

    if (selectedFile) {
      // Validate File Type
      const validTypes = ["video/mp4", "video/quicktime"]; // quicktime for Apple(Iphone) based users= .mov
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please upload an .mp4 or .mov file.");
        return;
      }

      // Validate File Size (100MB max)
      if (selectedFile.size > 100 * 1024 * 1024) {
        setError("File size must be less than 100MB.");
        return;
      }

      setFile(selectedFile);
    }
  };


  const handleUpload = async (e: React.FormEvent) => {
    //stop from refreshing the page
    e.preventDefault();
    //to stop if the user didn't select a video but still tries to submit
    if (!file) return;

    setIsUploading(true);
    setError("");

    try {
        //  wrap the file in form data
        const formData = new FormData();
        formData.append("video", file);

        // then send it to the server action
        const result = await uploadVideoAction(formData);

        if(result && result.success) {
            router.refresh();
            router.push("/dashboard");
        }
    }
    catch (err) {
        setError("Failed to upload the video. Please try again later.");
        console.log(err);
    }
    finally {
        setIsUploading(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-20 p-8 bg-zinc-900/50 border border-white/10 rounded-3xl">
      <h1 className="text-3xl font-bold mb-2 text-center">Upload Your Swing</h1>
      <p className="text-gray-400 text-center mb-8 text-sm">
        Max size: 100MB | Formats: .mp4, .mov
      </p>

      <form onSubmit={handleUpload} className="space-y-6">
        <div className="border-2 border-dashed border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center hover:border-emerald-500/50 transition-colors group cursor-pointer relative">
          <input
            type="file"
            accept=".mp4,.mov"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          
          <div className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
             {/* Upload Icon Placeholder */}
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
               <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
             </svg>
          </div>
          
          <p className="text-white font-medium">
            {file ? file.name : "Click to select or drag and drop"}
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center bg-red-500/10 p-2 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        <button
          disabled={!file || isUploading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          {isUploading ? "Uploading..." : "Analyze My Swing"}
        </button>
      </form>
    </div>
  );
}