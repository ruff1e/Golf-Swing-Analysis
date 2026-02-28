import Link from "next/link";

export default function HomePage() {

  return (

    <main className="min-h-screen bg-black text-white">

      {/* Eye cather section */}
      <section className="flex flex-col items-center justify-center text-center px-4 py-24 sm:py-32">
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6">
          Pro-Level Analysis <br /> 
          <span className="text-emerald-400 font-serif italic">Powered by AI</span>
        </h1>
        
        <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mb-10">
          Upload your swing. Our AI extracts your body mechanics, and professional coaches provide personalized feedback to shave strokes off your game.
        </p>


        {/* Analyze my swing button, sends to upload page, (upload page sends to auth page if the user is not logged in) */}
        <div className="flex gap-4">
          <Link href="/upload" className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-bold transition-all shadow-lg shadow-emerald-500/20"
          >
            Analyze My Swing
          </Link>
        </div>
      </section>


            {/* 3. How It Works Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/10">
        <h2 className="text-3xl font-bold text-center mb-16">How SwingVision Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Step 1 */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
              1
            </div>
            <h3 className="text-xl font-semibold">Upload Your Swing</h3>
            <p className="text-gray-400">Record your swing from a down-the-line or face-on view and upload it to our secure portal.</p>
          </div>

          {/* Step 2: AI Processing */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
              2
            </div>
            <h3 className="text-xl font-semibold">AI Skeleton Overlay</h3>
            <p className="text-gray-400">Our AI engine uses complex algorithms to track 33 body landmarks, highlighting your posture and angles.</p>
          </div>

          {/* Step 3: Coach Review */}
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-bold text-xl">
              3
            </div>
            <h3 className="text-xl font-semibold">Professional Feedback</h3>
            <p className="text-gray-400">A certified coach reviews your processed video and provides specific drills to improve you swing.</p>
          </div>
        </div>
      </section>

    </main>
  );
}