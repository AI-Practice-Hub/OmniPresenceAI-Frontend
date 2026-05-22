import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Wand2, AudioLines } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-zinc-950 selection:bg-zinc-900 selection:text-white">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-zinc-900 rounded-sm flex items-center justify-center">
            <Play className="w-3 h-3 text-white fill-white" />
          </div>
          <span className="font-semibold tracking-tight text-lg">OmniPresence</span>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors">
            Log in
          </Link>
          <Link href="/signup">
            <Button className="h-9 px-4 shadow-sm bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-sm font-medium transition-all">
              Sign up
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-32 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium mb-12 border border-zinc-200/50">
          <SparklesIcon className="w-3.5 h-3.5" />
          <span>OmniPresence AI Video Engine 1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tighter text-zinc-900 max-w-4xl leading-[1.1] mb-8">
          Your digital twin, <br className="hidden md:block" />
          <span className="text-zinc-400">ready to speak on command.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mb-12 leading-relaxed">
          Upload an avatar, clone your voice, and generate professional video content instantly. 
          No studios. No retakes. Just type your script and render.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link href="/signup">
            <Button size="lg" className="h-12 px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-base shadow-sm group">
              Start generating for free
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 rounded-md text-base font-medium text-zinc-700 bg-white border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900">
              Go to Dashboard
            </Button>
          </Link>
        </div>

        {/* Feature Teasers */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 max-w-5xl text-left">
          <FeatureCard 
            icon={<Wand2 className="w-5 h-5" />}
            title="AI Avatar Sync"
            description="Our advanced lip-sync models perfectly match your generated audio to your static portrait."
          />
          <FeatureCard 
            icon={<AudioLines className="w-5 h-5" />}
            title="Custom Voice Cloning"
            description="Upload a short audio sample to create a reliable text-to-speech clone of your exact voice."
          />
          <FeatureCard 
            icon={<Play className="w-5 h-5" />}
            title="Instant Renders"
            description="Type a script and get a downloadable, shareable MP4 video in minutes, not hours."
          />
        </div>
      </main>
    </div>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col gap-3 p-6 rounded-2xl bg-zinc-50 border border-zinc-100/50">
      <div className="w-10 h-10 rounded-lg bg-white border border-zinc-200/50 shadow-sm flex items-center justify-center text-zinc-900">
        {icon}
      </div>
      <h3 className="font-semibold text-zinc-900 text-lg">{title}</h3>
      <p className="text-zinc-500 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
